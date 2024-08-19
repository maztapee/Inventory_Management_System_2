import { Request, Response } from "express";
import { Sale } from "../entities/sales/sales.entity";
import { Between } from "typeorm";
import { SalesStatus } from "../entities/sales/constants.sales";
import { Product } from "../entities/product/product.entity";
import { Customer } from "../entities/customer/customers.entity";
import { User } from "../entities/user/user.entity";
import { Order } from "../entities/order/order.entity";
import { PaymentPlan } from "../entities/paymentplan/paymentplan.entity";

// Controller to handle Sale operations
export class SaleController {
  // 1. Create a sale
  static async createSale(req: Request, res: Response): Promise<Response> {
    try {
      const {
        amount,
        productId,
        customerId,
        orderId,
        userId,
        paymentPlanId,
      } = req.body;

      // Initialize a new Sale instance
      const sale = new Sale();
      sale.amount = amount;

      // Fetch related entities and validate their existence
      const product = await Product.findOneBy({ id: productId });
      const customer = await Customer.findOneBy({ id: customerId });
      const user = await User.findOneBy({ id: userId });

      if (!product || !customer || !user) {
        return res.status(400).json({ message: "Invalid related entity provided" });
      }

      sale.product = product;
      sale.customer = customer;
      sale.salesPerson = user;

      if (orderId) {
        const order = await Order.findOneBy({ id: orderId });
        if (!order) {
          return res.status(400).json({ message: "Invalid order ID provided" });
        }
        sale.order = order;
      }

      if (paymentPlanId) {
        const paymentPlan = await PaymentPlan.findOneBy({ id: paymentPlanId });
        if (!paymentPlan) {
          return res.status(400).json({ message: "Invalid payment plan ID provided" });
        }
        sale.paymentPlan = paymentPlan;
      }

      // Save the sale entity to the database
      await sale.save();
      return res.status(201).json(sale);
    } catch (error) {
      return res.status(400).json({ message: "Error creating sale", error });
    }
  }

  // 2. Fetch all successful sales
  static async fetchSuccessfulSales(req: Request, res: Response): Promise<Response> {
    try {
      const sales = await Sale.find({ where: { status: SalesStatus.success } });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching successful sales", error });
    }
  }

  // 3. Sum all successful sales
  static async sumSuccessfulSales(req: Request, res: Response): Promise<Response> {
    try {
      const total = await Sale.createQueryBuilder("sale")
        .where("sale.status = :status", { status: SalesStatus.success })
        .select("SUM(sale.amount)", "total")
        .getRawOne();
      return res.status(200).json({ total: total?.total || 0 });
    } catch (error) {
      return res.status(400).json({ message: "Error summing successful sales", error });
    }
  }

  // 4. Get all sales using a date range/time period parameter
  static async getSalesByDateRange(req: Request, res: Response): Promise<Response> {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate || isNaN(Date.parse(startDate as string)) || isNaN(Date.parse(endDate as string))) {
      return res.status(400).json({ message: "Invalid date range provided" });
    }

    try {
      const sales = await Sale.find({
        where: {
          soldAt: Between(new Date(startDate as string), new Date(endDate as string)),
        },
      });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching sales by date range", error });
    }
  }

  // 5. Search sales related to a customer via customer id
  static async getSalesByCustomerId(req: Request, res: Response): Promise<Response> {
    const { customerId } = req.params;
    try {
      const sales = await Sale.find({ where: { customer: { id: Number(customerId) } } });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching sales by customer", error });
    }
  }

  // 6. Search sales related to a payment plan via paymentPlan id
  static async getSalesByPaymentPlanId(req: Request, res: Response): Promise<Response> {
    const { paymentPlanId } = req.params;
    try {
      const sales = await Sale.find({ where: { paymentPlan: { id: Number(paymentPlanId) } } });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching sales by payment plan", error });
    }
  }

  // 7. Get all sales related to a product via product id
  static async getSalesByProductId(req: Request, res: Response): Promise<Response> {
    const { productId } = req.params;
    try {
      const sales = await Sale.find({ where: { product: { id: Number(productId) } } });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching sales by product", error });
    }
  }

  // 8. Get sales related to a user via user id (salesperson)
  static async getSalesByUserId(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    try {
      const sales = await Sale.find({ where: { salesPerson: { id: Number(userId) } } });
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(400).json({ message: "Error fetching sales by user", error });
    }
  }
}
