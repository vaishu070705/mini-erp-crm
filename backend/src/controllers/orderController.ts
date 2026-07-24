import { Request, Response } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../models/orderModel";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(Number(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const editOrder = async (req: Request, res: Response) => {
  try {
    const order = await updateOrder(Number(req.params.id), req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

export const removeOrder = async (req: Request, res: Response) => {
  try {
    await deleteOrder(Number(req.params.id));
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};