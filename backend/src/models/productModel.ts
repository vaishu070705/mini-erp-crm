import pool from "../config/db";
import { createStockMovement } from "./stockMovementModel";

// Get all products
export const getProducts = async () => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY id DESC"
  );
  return result.rows;
};

// Get single product
export const getProductById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// Create product
export const createProduct = async (
  product_name: string,
  sku: string,
  category: string,
  unit_price: number,
  current_stock: number,
  minimum_stock_alert: number,
  warehouse_location: string
) => {
  const result = await pool.query(
    `INSERT INTO products
    (product_name, sku, category, unit_price, current_stock, minimum_stock_alert, warehouse_location)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      minimum_stock_alert,
      warehouse_location,
    ]
  );

  if (Number(current_stock) > 0) {
    await createStockMovement(
      result.rows[0].id,
      "IN",
      Number(current_stock),
      "Initial product stock"
    );
  }

  return result.rows[0];
};

// Update product
export const updateProduct = async (
  id: number,
  product_name: string,
  unit_price: number,
  current_stock: number
) => {
  const existing = await pool.query(
    "SELECT current_stock FROM products WHERE id=$1",
    [id]
  );

  const result = await pool.query(
    `UPDATE products
     SET product_name=$1,
         unit_price=$2,
         current_stock=$3
     WHERE id=$4
     RETURNING *`,
    [
      product_name,
      unit_price,
      current_stock,
      id,
    ]
  );

  if (existing.rows[0] && result.rows[0]) {
    const oldStock = Number(existing.rows[0].current_stock);
    const newStock = Number(result.rows[0].current_stock);
    const difference = newStock - oldStock;

    if (difference > 0) {
      await createStockMovement(id, "IN", difference, "Product stock updated");
    }

    if (difference < 0) {
      await createStockMovement(
        id,
        "OUT",
        Math.abs(difference),
        "Product stock updated"
      );
    }
  }

  return result.rows[0];
};

// Delete product
export const deleteProduct = async (id: number) => {
  await pool.query(
    "DELETE FROM products WHERE id=$1",
    [id]
  );

  return true;
};
