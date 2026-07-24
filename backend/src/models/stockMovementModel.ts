import pool from "../config/db";

export type StockMovementType = "IN" | "OUT";

export const createStockMovement = async (
  product_id: number,
  movement_type: StockMovementType,
  quantity: number,
  reason: string
) => {
  if (!Number.isInteger(Number(product_id)) || Number(product_id) <= 0) {
    throw new Error("Valid product is required");
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  if (!["IN", "OUT"].includes(movement_type)) {
    throw new Error("Movement type must be IN or OUT");
  }

  const result = await pool.query(
    `INSERT INTO stock_movements
     (product_id, movement_type, quantity, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [product_id, movement_type, quantity, reason]
  );

  return result.rows[0];
};

export const getStockMovements = async () => {
  const result = await pool.query(
    `SELECT sm.id,
            sm.product_id,
            p.product_name,
            sm.movement_type,
            sm.quantity,
            sm.reason,
            sm.created_at
     FROM stock_movements sm
     LEFT JOIN products p ON p.id = sm.product_id
     ORDER BY sm.created_at DESC, sm.id DESC`
  );

  return result.rows;
};

export const getStockMovementsByProduct = async (productId: number) => {
  const result = await pool.query(
    `SELECT sm.id,
            sm.product_id,
            p.product_name,
            sm.movement_type,
            sm.quantity,
            sm.reason,
            sm.created_at
     FROM stock_movements sm
     LEFT JOIN products p ON p.id = sm.product_id
     WHERE sm.product_id = $1
     ORDER BY sm.created_at DESC, sm.id DESC`,
    [productId]
  );

  return result.rows;
};
