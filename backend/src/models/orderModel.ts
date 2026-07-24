import pool from "../config/db";

export const getOrders = async () => {
  const result = await pool.query(`
    SELECT
      orders.*,
      customers.customer_name,
      products.product_name
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    JOIN products ON orders.product_id = products.id
    ORDER BY orders.id DESC
  `);

  return result.rows;
};

export const getOrderById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const createOrder = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO orders
    (customer_id, product_id, quantity, total_price, order_status)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [
      data.customer_id,
      data.product_id,
      data.quantity,
      data.total_price,
      data.order_status,
    ]
  );

  return result.rows[0];
};

export const updateOrder = async (id: number, data: any) => {
  const result = await pool.query(
    `UPDATE orders
    SET customer_id=$1,
        product_id=$2,
        quantity=$3,
        total_price=$4,
        order_status=$5
    WHERE id=$6
    RETURNING *`,
    [
      data.customer_id,
      data.product_id,
      data.quantity,
      data.total_price,
      data.order_status,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteOrder = async (id: number) => {
  await pool.query(
    "DELETE FROM orders WHERE id = $1",
    [id]
  );
};