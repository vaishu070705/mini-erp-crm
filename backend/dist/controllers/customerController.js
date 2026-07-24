"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFollowup = exports.getFollowups = exports.removeCustomer = exports.editCustomer = exports.addCustomer = exports.getCustomer = exports.getAllCustomers = void 0;
const customerModel_1 = require("../models/customerModel");
// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await (0, customerModel_1.getCustomers)();
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch customers" });
    }
};
exports.getAllCustomers = getAllCustomers;
// Get customer by ID
const getCustomer = async (req, res) => {
    try {
        const customer = await (0, customerModel_1.getCustomerById)(Number(req.params.id));
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        res.json(customer);
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch customer",
        });
    }
};
exports.getCustomer = getCustomer;
// Add customer
const addCustomer = async (req, res) => {
    try {
        const { customer_name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes, } = req.body;
        const customer = await (0, customerModel_1.createCustomer)(customer_name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes);
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create customer" });
    }
};
exports.addCustomer = addCustomer;
// Update customer
const editCustomer = async (req, res) => {
    try {
        const customer = await (0, customerModel_1.updateCustomer)(Number(req.params.id), req.body.customer_name, req.body.mobile, req.body.email, req.body.business_name, req.body.gst_number, req.body.customer_type, req.body.address, req.body.status, req.body.follow_up_date, req.body.notes);
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        res.json(customer);
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to update customer",
        });
    }
};
exports.editCustomer = editCustomer;
// deleteCustomer
const removeCustomer = async (req, res) => {
    try {
        const customer = await (0, customerModel_1.deleteCustomer)(Number(req.params.id));
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }
        res.json({
            message: "Customer deleted successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to delete customer",
        });
    }
};
exports.removeCustomer = removeCustomer;
const getFollowups = async (req, res) => {
    try {
        const customer = await (0, customerModel_1.getCustomerById)(Number(req.params.id));
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const followups = await (0, customerModel_1.getCustomerFollowups)(Number(req.params.id));
        res.json(followups);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch follow-up notes" });
    }
};
exports.getFollowups = getFollowups;
const addFollowup = async (req, res) => {
    try {
        const customer = await (0, customerModel_1.getCustomerById)(Number(req.params.id));
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if (!req.body.note) {
            return res.status(400).json({ message: "Note is required" });
        }
        const followup = await (0, customerModel_1.createCustomerFollowup)(Number(req.params.id), req.body.note, req.body.follow_up_date, req.body.created_by);
        res.status(201).json(followup);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to add follow-up note" });
    }
};
exports.addFollowup = addFollowup;
