import { Request, Response } from "express";
import {
  getStockMovements,
  getStockMovementsByProduct,
} from "../models/stockMovementModel";

export const getAllStockMovements = async (_req: Request, res: Response) => {
  try {
    const movements = await getStockMovements();
    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
};

export const getProductStockMovements = async (
  req: Request,
  res: Response
) => {
  try {
    const movements = await getStockMovementsByProduct(
      Number(req.params.productId)
    );
    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product stock history" });
  }
};
