import { SaleController } from "../controllers/sale.controller";
import { Router } from "express";
  
export const SaleRouter: Router = Router({
  strict: true,
});


SaleRouter.post("/sales", SaleController.createSale);
SaleRouter.get("/sales/successful", SaleController.fetchSuccessfulSales);
SaleRouter.get("/sales/successful/sum", SaleController.sumSuccessfulSales);
SaleRouter.get("/sales/daterange", SaleController.getSalesByDateRange);
SaleRouter.get("/sales/customer/:customerId", SaleController.getSalesByCustomerId);
SaleRouter.get("/sales/paymentplan/:paymentPlanId", SaleController.getSalesByPaymentPlanId);
SaleRouter.get("/sales/product/:productId", SaleController.getSalesByProductId);
SaleRouter.get("/sales/user/:userId", SaleController.getSalesByUserId);


