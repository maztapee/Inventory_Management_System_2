import { PaymentPlan } from "../entities/paymentplan/paymentplan.entity";
import { Customer } from "../entities/customer/customers.entity";
import { Request, Response } from "express";
import { Product } from "../entities/product/product.entity";
import { Sale } from "../entities/sales/sales.entity"; //imported for fetching initialAmount/intialDeposit
import { In } from "typeorm";
import { PaymentPlanStatus } from "../entities/paymentplan/constants.paymentplan";
// import { validate } from "class-validator";
// import { objToString } from "../utility/user.utils";

 
// async function getPaymentPlanData (req: Request): Promise<Partial<PaymentPlan>>{
//     const paymentPlanData: Partial<PaymentPlan> = await { ... req.body };

//     return paymentPlanData;

// };

//1. Check for existing payment plan on customer using customer ID
async function isEligibleForPaymentPlan(customerId: number): Promise<boolean> {

    /*
        TODO: Function to check if total amount meets the minimum threshold
        1.  Returns true if customer does not have an active paymentPlan 
        2.  Returns false if customer has an active paymentPlan
        3.  Check isEligibleForPaymentPlan in createPaymentPlan() before anything!
        4.  A.O.B
    */
        const customer = await Customer.findOne({
            where: { id: customerId },
            relations: ["paymentPlan"],
          });
        
          if (customer && customer.paymentPlan?.status === PaymentPlanStatus.active) {
            return !(customer.paymentPlan.status === PaymentPlanStatus.active);
          }
        
          return true; 
};
//2. setting payment plan increment
async function setPaymentPlanIncrement(productIds: number[], req: Request){
    /*
        TODO:
            1. Implement flat rate for all duration selection
                OR
            2. Implement tiered rate for all duration selection
    */

    //Implementing flat rate for all duration selection at setMonthlyPaymentPlanAmount();
    let priceIncrement:number = 0;
    let totalAmount = await getAmount(productIds);
    let initialDeposit = await getInitialDeposit(req);
    priceIncrement = (totalAmount - initialDeposit) * 0.25

    return priceIncrement;
}
//3. getting total amount of item/product selected (Need to convert this to orderID)
async function getAmount (productIds: number[]): Promise<number> {
    const products = await Product.findBy({ id: In(productIds) });
    // throw an error when products are are not found

    // Sum up of prices for all the products in customer order
    const totalAmount = products.reduce((sum, product) => sum + product.unitPrice, 0);

    return parseFloat(totalAmount.toFixed(2)); // Return total amount rounded to 2 decimal places
};
//4. setting selectable (allowable) duration for payment plan
async function setDuration (productIds: number[], req: Request): Promise<number> {
    /* 

    TODO: Function to set allowable paymentPlanDuration
    Get paymentPlanAmount from the setPaymentPlanAmount to use as a comparative base-
    for verifying allowable duration (minimum = 1week, maximum = 6months)
    Duration check at front end
    duration = 1 (Eligible for 1 week payment plan)
    duration = 2 (Eligible for 2 weeks payment plan)
    duration = 3 (Eligible for 1 month payment plan)
    duration = 4 (Eligible for 1-3 months payment plan)
    duration = 5 (Eligible for 1-6 months payment plan)

    */
    let paymentPlanAmount = await setPaymentPlanAmount(productIds, req);

    let duration: number = 0;
    if (paymentPlanAmount <= 4999.99){
        duration = 1;
        return duration;
    }

    else if ((paymentPlanAmount > 4999.99) && (paymentPlanAmount <= 19999.99)){
        duration = 2;
        return duration;
    }

    else if (paymentPlanAmount < 19999.99) {
        duration = 3;
        return duration;
    } 
    else if ((paymentPlanAmount >= 20000) && (paymentPlanAmount <= 49999.99)){
        duration = 4;
        return duration; 
    }
    else if (paymentPlanAmount >= 50000){
        duration = 5;
        return duration;
    };
    return duration;
};
//5. calculating total amount to be paid for this payment plan
async function setPaymentPlanAmount (productIds: number[], req: Request): Promise<number> {
    let totalAmount = await getAmount(productIds);
    let minimumDeposit = await setMinimumDeposit(productIds);
    let paymentmentPlanAmount: number = 0;
    let priceIncrement: number = 0;

    //TODO:
    //Add a discount if the customer is a premium loyal customer (by duration)
    //Verify initialDeposit >= minimumDeposit

    let initialDeposit:number = await getInitialDeposit(req);
    //NOTE: Check for type-reference errors for line 136 (above)

    priceIncrement = await setPaymentPlanIncrement(productIds, req);

    if (initialDeposit >= minimumDeposit){

        paymentmentPlanAmount = (totalAmount - initialDeposit) + priceIncrement;

        return paymentmentPlanAmount;
    }

    /*
        TODO:
        Return an error message if initialDeposit is not >= minimumDeposit
    */

    

    return paymentmentPlanAmount;
}
//6. calculating amount to be paid periodically
async function setMonthlyPaymentPlanAmount (productIds: number[], req: Request): Promise<number> {
    let duration: number; //Initialized to zero if all conditions check fails
    let paymentPlanAmount: number;
    let monthlyPaymentPlanAmount: number = 0;

    duration = await setDuration(productIds, req);
    paymentPlanAmount = await setPaymentPlanAmount(productIds, req);

    if (duration == 1){
        monthlyPaymentPlanAmount = paymentPlanAmount;
        return monthlyPaymentPlanAmount;
    }else if( duration == 2){
        monthlyPaymentPlanAmount = paymentPlanAmount / 3;
        return monthlyPaymentPlanAmount;
    }else if(duration == 3){
        monthlyPaymentPlanAmount = paymentPlanAmount / 6;
        return monthlyPaymentPlanAmount;
    }
    return monthlyPaymentPlanAmount;
}
//7. setting minimum amount acceptable for initial payment to start a payment plan
async function setMinimumDeposit (productIds: number[]): Promise<number> {
    let totalAmount = await getAmount(productIds);
    let minimumDeposit: number = 0;

    //minimumDeposit variable definition:
    //implementing a 65% of totalAmount (Verify with Business Owner)
    minimumDeposit = totalAmount * 0.65;

    return minimumDeposit;
}
//8. getting initial payment made by customer
async function getInitialDeposit (req: Request): Promise<number>{
    let initialDeposit: number = 0;
    initialDeposit=  await (req.body.initialAmount); //Getting initial amount paid by customer for an order
    // throw error when initialAmount is not found
    return initialDeposit;
};
//9. setting a defaulting fee
async function setDefaultingFee ():Promise<number>{
    let defaultingFee: number = 0;
    /*
        TODO:
        - Verify with Business Owner
        - Implement flat rate logic to calculate the defaulting fee
        - To consider tiered rate logic in the future
    */
    defaultingFee = 5000;
    return defaultingFee;
};
//10. update paymentplan when a customer makes a monthly-installment payment
export async function updatePaymentPlan (req: Request, res: Response): Promise<Response> {
    const { amountPaid, saleId, customerId } = req.body;
    /*
        Request must contain the following for updatePaymentPlan:
        1. amountPaid: Amount customer pays to check and make 
        comparison with supposed monthly payment and effect logic for insufficient payment amounts.
        2. saleId: to update amountPaid on payment-plan table
        3. paymentPlanId: to associate Request: amountPaid and saleId to a paymentPlan
    */

    try {
        // Find the PaymentPlan
        const paymentPlan = await PaymentPlan.findOne({
            where: {
                customer: {
                    id: customerId
                }
            }
        });
        if (!paymentPlan) {
            return res.status(404).json({ message: "Your payment plan not found" });
        };
        // Update the paymentPlan amountPaid
        paymentPlan.amountPaid += amountPaid;

        // Check if the payment plan is fully paid
        if (paymentPlan.amountPaid >= paymentPlan.paymentPlanAmount) {
            paymentPlan.status = PaymentPlanStatus.completed;
            } else {
            // Calculate the next charge date (this logic assumes monthly payments)
            const nextChargeDate = new Date(paymentPlan.nextChargeDate);
            nextChargeDate.setMonth(nextChargeDate.getMonth() + 1);
            paymentPlan.nextChargeDate = nextChargeDate;
            };


      // Save the updated PaymentPlan
      await paymentPlan.save();

      // Prepare the response based on payment status
      const response = {
        paymentPlan, //expecting a status check on all payment-plan status
        nextChargeDate: paymentPlan.nextChargeDate,
        monthlyPaymentPlanAmount: paymentPlan.monthlyPaymentPlanAmount,
      };

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Error updating payment plan", error });
    };
  };
//11. creating a payment plan
export async function createPaymentPlan(req: Request, res: Response) {
    //Request from client must contain customerId(as a number/int)
    //Request from client must contain productIds (as an Array of numbers/int)
    //Request from client must contain initialAmount (as a number/float)
    const { customerId, productIds, initialAmount } = req.body;

    // Find the customer
    const customer = await Customer.findOne({ where: { id: customerId }, relations: ["paymentPlan"] });
    if (!customer) {
        return res.status(404).json({ message: "Customer not found." });
    }

    // Check if the customer is eligible for a payment plan (not having an active paymentPlan)
    const isEligible = await isEligibleForPaymentPlan(customerId);
    if (!isEligible) {
        return res.status(400).json({ message: "Customer is not eligible for a payment plan." });
    }

    // Calculate payment plan details
    const minimumDeposit = await setMinimumDeposit(productIds);
    const duration = await setDuration(productIds, req);
    const priceIncrement = await setPaymentPlanIncrement(productIds, req);
    const defaultingFee = await setDefaultingFee();
    const paymentPlanAmount = await setPaymentPlanAmount(productIds, req);
    const monthlypaymentAmount = await setMonthlyPaymentPlanAmount(productIds, req);
    const createdAt = new Date();
    const nextChargeDate = new Date(createdAt);
    nextChargeDate.setMonth(nextChargeDate.getMonth()+1);
    


    // Create the payment plan
    const paymentPlan = new PaymentPlan();
    paymentPlan.createdAt = createdAt; // Set the creation date
    paymentPlan.minimumDeposit = minimumDeposit;
    paymentPlan.duration = duration;
    paymentPlan.priceIncrement = priceIncrement;
    paymentPlan.defaultingFee = defaultingFee;
    paymentPlan.status = PaymentPlanStatus.active;//imported enum
    paymentPlan.customer = customer;
    paymentPlan.paymentPlanAmount = paymentPlanAmount;
    paymentPlan.monthlyPaymentPlanAmount = monthlypaymentAmount;
    paymentPlan.nextChargeDate = nextChargeDate;


    // Assuming the initial deposit is stored in the Sales entity
    // Check for Sales implementation of initialAmount before query to fetch initialDeposit
    if (!initialAmount) {
        return res.status(404).json({ message: "Initial amount (Sale) not found." });
    }
    paymentPlan.amountPaid = initialAmount;

    // Save the payment plan
    await paymentPlan.save();

    return res.status(201).json({ message: "Payment plan created successfully.", paymentPlan });
}



/*
    TODO:
    1. call updatePaymentPlan whenever there is a successful payment
    on a payment-plan
    2. verify that a sale is outright or installment before call
*/