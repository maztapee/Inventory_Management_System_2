import { Router } from "express";
import { createPaymentPlan } from "../controllers/paymentplan.controller";
  
export const PaymentPlanRouter: Router = Router({
  strict: true,
});



PaymentPlanRouter.post("/", createPaymentPlan);

/*
    TODO:
        1. route for getting all payment plans
        2. route for getting all payment plans for a customer by customerID
        3. route for getting all active payment plans
        4. route for getting all defaulted payment plans
        5. route for getting all completed payment plans
        6. route for getting all cancelled payment plans
        7. route for updating payment plan when customers pay a monthly-installments
*/