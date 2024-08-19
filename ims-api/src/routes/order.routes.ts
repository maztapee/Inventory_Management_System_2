import { OrderController } from "../controllers/order.controller";
import { Router } from "express";
  
export const OrderRouter: Router = Router({
  strict: true,
});



// Route to create a new order
OrderRouter.post("/", OrderController.createOrder);

// Route to update an existing order
OrderRouter.put("/:orderId", OrderController.updateOrder);

// Route to fetch an order by ID
OrderRouter.get("/:orderId", OrderController.getOrderById);

// Route to fetch orders by customer ID
OrderRouter.get("/customer/:customerId", OrderController.getOrdersByCustomer);

// Route to fetch orders by salesperson ID
OrderRouter.get("/salesperson/:userId", OrderController.getOrdersBySalesPerson);

// Route to fetch orders by date or date range
OrderRouter.get("/date", OrderController.getOrdersByDate);

// Route to fetch all orders with payment plans
OrderRouter.get("/payment-plans", OrderController.getPaidOrActivePaymentPlanOrders);
