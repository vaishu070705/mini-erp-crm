import { Request, Response } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerFollowups,
  createCustomerFollowup,
} from "../models/customerModel";

// Get all customers
export const getAllCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// Get customer by ID
export const getCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await getCustomerById(Number(req.params.id));

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
};

// Add customer
export const addCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    } = req.body;

    const customer = await createCustomer(
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes
    );

    res.status(201).json(customer);
  } catch (error) {
  res.status(500).json({ message: "Failed to create customer" });
}
};

// Update customer
export const editCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await updateCustomer(
      Number(req.params.id),
      req.body.customer_name,
      req.body.mobile,
      req.body.email,
      req.body.business_name,
      req.body.gst_number,
      req.body.customer_type,
      req.body.address,
      req.body.status,
      req.body.follow_up_date,
      req.body.notes
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update customer",
    });
  }
};
// deleteCustomer
export const removeCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await deleteCustomer(
      Number(req.params.id)
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete customer",
    });
  }
};

export const getFollowups = async (req: Request, res: Response) => {
  try {
    const customer = await getCustomerById(Number(req.params.id));

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const followups = await getCustomerFollowups(Number(req.params.id));
    res.json(followups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch follow-up notes" });
  }
};

export const addFollowup = async (req: Request, res: Response) => {
  try {
    const customer = await getCustomerById(Number(req.params.id));

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!req.body.note) {
      return res.status(400).json({ message: "Note is required" });
    }

    const followup = await createCustomerFollowup(
      Number(req.params.id),
      req.body.note,
      req.body.follow_up_date,
      req.body.created_by
    );

    res.status(201).json(followup);
  } catch (err) {
    res.status(500).json({ message: "Failed to add follow-up note" });
  }
};
