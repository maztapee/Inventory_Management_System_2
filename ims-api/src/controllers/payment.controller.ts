import { PaymentPlan } from "../entities/paymentplan/paymentplan.entity";
import { Customer } from "../entities/customer/customers.entity";
import { Request, Response } from "express";
import { Product } from "../entities/product/product.entity"
import { In } from "typeorm";
// import { validate } from "class-validator";
// import { objToString } from "../utility/user.utils";

async function hasActivePaymentPlan(customerId: number) {
    const customer = await Customer.findOne({
      where: { id: customerId },
      relations: ["paymentPlan"],
    });
  
    if (customer && customer.paymentPlan?.status === "active") {
      return customer.paymentPlan.status === "active";
    }
  
    return false;
  };
async function getPaymentPlanData (req: Request): Promise<Partial<PaymentPlan>>{
    const paymentPlanData: Partial<PaymentPlan> = await { ... req.body };

    return paymentPlanData;

};

// Function to check if total amount meets the minimum threshold
async function isEligibleForPaymentPlan(productIds: number[], minThreshold: number): Promise<boolean> {
    const totalAmount = await getAmount(productIds);

    //TODO:
    // Derive the logic for calculating minThreshold
    // Consider making minThreshold a global variable for access when evaluating priceIncrement
    minThreshold = 1000.00;
    //minthreshold is the minimum amount required to initiate a payment plan


    if (totalAmount >= minThreshold) {
        return true; // Eligible for payment plan
    } else {
        return false; // Not eligible
    }
}

export const createPaymentPlan = async function (
    req: Request,
    res: Response
): Promise<Response> {
    const customerId = Number(req.params.customerId);
    const paymentPlanData = await getPaymentPlanData(req);

    const customer = await Customer.findOne({ where: { id: customerId } });
  
    if (!customer) {
        return res.status(404).send("You are not logged in, please sign in to make purchase.");
    }

    const hasActivePlan = await hasActivePaymentPlan(customerId);
  
    if (hasActivePlan) {
        return res.status(400).send(
            "Customer already has an active payment plan. Please complete your current payment plan"
        );
    }
  
    const paymentPlan = PaymentPlan.create({
      ...paymentPlanData,
      customer: customer,
    });
  
    await paymentPlan.save();
    return res.status(201).json(paymentPlan);
  }

export const calculateInstallment = async (req: Request, res: Response) =>{
    const { paymentPlanId, amount } = req.body;
}

export const getAmount = async (productIds: number[]): Promise<number> => {
    const products = await Product.findBy({ id: In(productIds) });

    // Sum up of prices for all the products in customer order
    const totalAmount = products.reduce((sum, product) => sum + product.unitPrice, 0);

    return parseFloat(totalAmount.toFixed(2)); // Return total amount rounded to 2 decimal places
};



