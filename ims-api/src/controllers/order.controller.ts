import { Request, Response } from "express";
import { Database } from "../config/database";
import {  Between } from "typeorm";
import { Order } from "../entities/order/order.entity";
import { Sale } from "../entities/sales/sales.entity";
import { PaymentPlan } from "../entities/paymentplan/paymentplan.entity";

export class OrderController {
  
  // 1. Fetch all orders by a specified customer using customerID
  static async getOrdersByCustomer(req: Request, res: Response) {
    const { customerId } = req.params;
    try {
      const orders = await Database.getRepository(Order).find({
        where: { customer: { id: parseInt(customerId, 10) } },
        relations: ["customer", "sale", "paymentPlans"],
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  // 2. Fetch all orders handled by a specified salesperson using userID
  static async getOrdersBySalesPerson(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const orders = await Database.getRepository(Order).find({
        where: { sale: { salesPerson: { id: parseInt(userId, 10) } } },
        relations: ["customer", "sale", "sale.salesPerson", "paymentPlans"],
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  // 3. Fetch an order using orderID
  static async getOrderById(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const order = await Database.getRepository(Order).findOne({
        where: { id: parseInt(orderId, 10) },
        relations: ["customer", "sale", "paymentPlans"],
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching order", error });
    }
  }

  // 4. Fetch orders using a specified date/date range
  static async getOrdersByDate(req: Request, res: Response) {
    const { startDate, endDate } = req.query; // Assuming startDate and endDate are in the format 'YYYY-MM-DD'
    try {
      const dateRange = Between(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      const orders = await Database.getRepository(Order).find({
        where: { orderDate: dateRange },
        relations: ["customer", "sale", "paymentPlans"],
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  // 5. Fetch all orders that have been paid for or have an active payment plan
  static async getPaidOrActivePaymentPlanOrders(req: Request, res: Response) {
    try {
      const orders = await Database.getRepository(Order)
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.sale", "sale")
        .leftJoinAndSelect("order.paymentPlans", "paymentPlan")
        .where("order.paymentType = :paymentType", { paymentType: "instant" })
        .orWhere("paymentPlan.status = :status", { status: "active" })
        .getMany();

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  // 6. Fetch all orders
  static async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await Database.getRepository(Order).find({
        relations: ["customer", "sale", "paymentPlans"],
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  // 7. Create a new order
  static async createOrder(req: Request, res: Response) {
    const { customer, totalAmount, paymentType, saleId, paymentPlans } = req.body;
    try {
      const sale = await Database.getRepository(Sale).findOne({
        where: { id: saleId },
      });
  
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
  
      const order = new Order();
      order.customer = customer;
      order.totalAmount = totalAmount;
      order.paymentType = paymentType;
      order.sale = sale;
      order.paymentPlans = paymentPlans || [];
  
      await order.save();
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ message: "Error creating order", error });
    }
  }

  //8. Update an existing order
  static async updateOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const { totalAmount, paymentType, saleId, paymentPlans } = req.body;
    try {
      const order = await Database.getRepository(Order).findOne({
        where: { id: parseInt(orderId, 10) }
    });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.totalAmount = totalAmount;
      order.paymentType = paymentType;

      if (saleId) {
        const sale = await Database.getRepository(Sale).findOne({
            where: { id: saleId },
        });

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
          }
        order.sale = sale;
      }
      order.paymentPlans = paymentPlans || [];

      await order.save();
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: "Error updating order", error });
    }
  }

  //9. Delete an order
  static async deleteOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const order = await Database.getRepository(Order).findOne({
        where: { id: parseInt(orderId, 10) }
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      await order.remove();
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting order", error });
    }
  }
}
