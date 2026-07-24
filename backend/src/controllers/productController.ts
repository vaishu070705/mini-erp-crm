import { Request, Response } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/productModel";

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get single product
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(Number(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Create product
export const createNewProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      minimum_stock_alert,
      warehouse_location,
    } = req.body;

    const product = await createProduct(
      product_name,
      sku,
      category,
      Number(unit_price),
      Number(current_stock),
      Number(minimum_stock_alert),
      warehouse_location
    );

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product
export const editProduct = async (req: Request, res: Response) => {
  try {
    const { product_name, unit_price, current_stock } = req.body;

    const product = await updateProduct(
      Number(req.params.id),
      product_name,
      Number(unit_price),
      Number(current_stock)
    );

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product
export const removeProduct = async (req: Request, res: Response) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};