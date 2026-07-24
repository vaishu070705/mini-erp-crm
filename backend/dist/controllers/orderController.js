"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOrder = exports.editOrder = exports.addOrder = exports.getOrder = exports.getAllOrders = void 0;
const orderModel_1 = require("../models/orderModel");
const getAllOrders = async (req, res) => {
    try {
        const orders = await (0, orderModel_1.getOrders)();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
exports.getAllOrders = getAllOrders;
const getOrder = async (req, res) => {
    try {
        const order = await (0, orderModel_1.getOrderById)(Number(req.params.id));
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch order" });
    }
};
exports.getOrder = getOrder;
const addOrder = async (req, res) => {
    try {
        const order = await (0, orderModel_1.createOrder)(req.body);
        res.status(201).json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create order" });
    }
};
exports.addOrder = addOrder;
const editOrder = async (req, res) => {
    try {
        const order = await (0, orderModel_1.updateOrder)(Number(req.params.id), req.body);
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update order" });
    }
};
exports.editOrder = editOrder;
const removeOrder = async (req, res) => {
    try {
        await (0, orderModel_1.deleteOrder)(Number(req.params.id));
        res.json({ message: "Order deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
};
exports.removeOrder = removeOrder;
