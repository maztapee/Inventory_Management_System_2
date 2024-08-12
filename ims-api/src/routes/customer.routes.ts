import {
    deleteCustomerByEmail,
    SearchCustomerByEmail,
    SearchCustomerById,
    SearchCustomerByPhone,
    SearchCustomerByUsername,
    UpdateCustomer,
    getAllCustomer,
    createCustomer,
    deleteCustomerById,
  } from "./../controllers/customer.controller";
  import { Router } from "express";
  
  export const CustomerRouter: Router = Router({
    strict: true,
  });
  
  CustomerRouter.get("/customer/username/:username", SearchCustomerByUsername);
  CustomerRouter.get("/customer/email/:email", SearchCustomerByEmail);
  CustomerRouter.get("/customer/phone/:phone", SearchCustomerByPhone);
  CustomerRouter.get("/customer/:id", SearchCustomerById);
  CustomerRouter.put("/customer/:id", UpdateCustomer);
  CustomerRouter.delete("/customer/email/:email", deleteCustomerByEmail);
  CustomerRouter.delete("/customer/:id", deleteCustomerById);
  CustomerRouter.get("/customer", getAllCustomer);
  CustomerRouter.post("/", createCustomer);