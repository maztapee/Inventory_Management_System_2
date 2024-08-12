
import { Request, Response } from "express";
import { Customer } from "../entities/customer/customers.entity";
import { lowerCase } from "lower-case";
import { objToString, sendConfirmationEmail } from "../utility/user.utils";
import { validate } from "class-validator";
import { generateToken, verifyToken } from "./../utility/user.utils";

export const deleteCustomerByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    const exist = await Customer.findOne({ where: { email } });
    if (!exist) {
      return res.status(400).json({
        message: `this email ${email} Not Found`,
      });
    }
    try {
      exist.remove();
      res.status(201).json({
        message: "Customer account deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Customer account deletion failed",
        err: error,
      });
    }
  };

  export const SearchCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const customer = await Customer.findOne({
      select: ["id", "username", "email", "phone"],
      where: { id },
      relations: { paymentPlan: true },
      loadRelationIds: true,
    });
    if (!customer) {
      return res.status(400).json({
        message: `Customer with this id ${id} not found`,
      });
    }
    try {
      res.status(201).json({
        customer,
      });
    } catch (error) {
      res.status(500).json({
        message: "  Failed to search for customer by id",
        err: error,
      });
    }
  };
  
  export const SearchCustomerByEmail = async (req: Request, res: Response) => {
    const { email } = req.params as any;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(400).json({
        message: `Customer with this email ${email} not found`,
      });
    }
    try {
      res.status(201).json({
        customer,
      });
    } catch (error) {
      res.status(500).json({
        message: "  Failed to search for customer by email",
        err: error,
      });
    }
  };
  
  export const SearchCustomerByPhone = async (req: Request, res: Response) => {
    const { phone } = req.params as any;
    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) {
      return res.status(400).json({
        message: `Customer with this phone ${phone} not found`,
      });
    }
    try {
      res.status(201).json({
        customer,
      });
    } catch (error) {
      res.status(500).json({
        message: "  Failed to search for customer by phone",
        err: error,
      });
    }
  };
  
  export const SearchCustomerByUsername = async (req: Request, res: Response) => {
    const { username } = req.params as any;
    const customer = await Customer.find({ where: { username } });
    if (!customer) {
      return res.status(400).json({
        message: `user with this username ${username} not found`,
      });
    }
    try {
      res.status(201).json({
        customer,
      });
    } catch (error) {
      res.status(500).json({
        message: "  Failed to search for customer by name",
        err: error,
      });
    }
  };
  
  export const deleteCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const customer = await Customer.findOne({ where: { id } });
    if (!customer) {
      return res.status(400).json({
        message: `Customer with id ${id} not found`,
      });
    }
    try {
      customer.remove();
      res.status(201).json({
        message: "Customer deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Customer deletion failed",
        err: error,
      });
    }
  };
  
  export const UpdateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const { username, email, phone } = req.body;
    const customer = await Customer.findOne({ where: { id } });
    if (!customer) {
      return res.status(400).json({
        message: `Customer with id ${id} not found`,
      });
    }
    if (!customer) {
      return res.status(400).json({
        message: `Customer with id ${id} not found`,
      });
    }
    try {
      customer.username = username;
      customer.phone = phone;
      await customer.save();
      res.status(201).json({
        message: "Customer update successful",
      });
    } catch (error) {
      res.status(500).json({
        message: "Customer update failed",
        err: error,
      });
    }
  };
  
  export const getAllCustomer = async (req: Request, res: Response) => {
    const customer = await Customer.find({
      select: ["id", "username", "email", "phone"], 

      //TODO:
      //implement paymentplan fetch too

      relations: { paymentPlan: true },
      loadRelationIds: true,
    });
    if (!customer) {
      return res.status(400).json({
        message: `no customers found due to server or network error`,
      });
    }
    try {
      res.status(201).json({
        customer,
      });
    } catch (error) {
      res.status(500).json({
        message: "  Failed to search for user",
        err: error,
      });
    }
  };
  
  export const createCustomer = async (req: Request, res: Response) => {
    const { username, email, password, phone, address } = req.body;
    const customerEmail = await Customer.findOne({ where: { email } });
    const customerPhone = await Customer.findOne({ where: { phone } });
    const customerUsername = await Customer.findOne({ where: { username } });

    if (customerUsername) {
        return res.status(400).json({
          message: `User with username ${customerUsername} already exist`,
        });
      }

    if (customerEmail) {
      return res.status(400).json({
        message: `User with email ${email} already exist`,
      });
    }

    if (customerPhone) {
      return res.status(400).json({
        message: `User with phone number ${phone} already exist`,
      });
    }

    try {
      const newCustomer = new Customer();
      newCustomer.username = lowerCase(username);
      newCustomer.email = lowerCase(email);
      newCustomer.password = password;
      //TODO:
      // Hash the password before storing
      newCustomer.phone = phone;
      newCustomer.address = address;
  
      validate(newCustomer).then(async (errors) => {
        if (errors.length > 0) {
          const { constraints } = errors[0];
          return res.status(422).json({
            message: objToString(constraints),
          });
        } else {
          const token = await generateToken({
            username: newCustomer.username,
            email: newCustomer.email,
            password: newCustomer.password,
            phone: newCustomer.phone,
            address: newCustomer.address,
          });
          await sendConfirmationEmail(newCustomer.username, newCustomer.email, token);
          return res.status(201).json({
            message: "Customer created successfully",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: "Customer creation failed",
        err: error,
      });
    }
  };
  