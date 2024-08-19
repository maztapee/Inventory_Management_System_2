import { Request, Response } from "express";
import { Database } from "../config/database";
import { Refund } from "../entities/refund/refund.entity";
import { Order } from "../entities/order/order.entity";
import { Sale } from "../entities/sales/sales.entity";
import { PaymentPlan } from "../entities/paymentplan/paymentplan.entity";
import { PaymentPlanStatus } from "../entities/paymentplan/constants.paymentplan";
import { Customer } from "../entities/customer/customers.entity";

export default class RefundController {
  static async createRefund(req: Request, res: Response) {
    const { orderId, customerId, reason } = req.body;

    try {
      // Fetch the order by ID
      const order = await Order.findOne({
        where: { id: orderId },
        relations: ["paymentPlans", "customer"],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get the active payment plan for the order
      const paymentPlan = order.paymentPlans;

      if (!paymentPlan || paymentPlan.status !== PaymentPlanStatus.active) {
        return res.status(400).json({ message: "No active payment plan found for this order" });
      }

      // Calculate total amount paid by customer from sales linked to this payment plan
      const sales = await Sale.find({
        where: { 
            paymentPlan: {id: paymentPlan.id }
        },
      });

      const amountPaid = sales.reduce((total, sale) => total + sale.amount, 0);

      // Calculating the refund amount
      const refundAmount = amountPaid - paymentPlan.defaultingFee;

      // Fetch Customer with customerId if provided
      let customer: Customer | null = null;
        customer = await Customer.findOne({ 
            where: { id: customerId } 
        });
        
        if (!customer) {
            customer = order.customer; // Fallback to the order's customer
          };
    
          if (!customer) {
            return res.status(400).json({ message: "Customer not found" });
          }

      // Create and save the refund
      const refund = new Refund();
      refund.amount = refundAmount;
      refund.reason = req.body.reason || ""; // Optional reason for refund
      refund.order = order;
      refund.customer = customer || order.customer; // Fallback to the order's customer
      refund.paymentPlan = paymentPlan;

      await refund.save();

      return res.status(201).json(refund);
    } catch (error) {
      return res.status(500).json({ message: "Error creating refund", error });
    }
  }
}
