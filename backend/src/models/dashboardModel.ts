import pool from "../config/db";

export const getDashboardStats = async () => {
  const customerResult = await pool.query(
    "SELECT COUNT(*) AS total FROM customers"
  );

  const productResult = await pool.query(
    "SELECT COUNT(*) AS total FROM products"
  );

  const orderResult = await pool.query(
    "SELECT COUNT(*) AS total FROM orders"
  );

  const revenueResult = await pool.query(
    "SELECT COALESCE(SUM(total_price),0) AS total FROM orders"
  );

  const recentOrders = await pool.query(`
    SELECT
      c.customer_name,
      p.product_name,
      o.quantity,
      o.order_status
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.id DESC
    LIMIT 5
  `);

  return {
    customers: Number(customerResult.rows[0].total),
    products: Number(productResult.rows[0].total),
    orders: Number(orderResult.rows[0].total),
    revenue: Number(revenueResult.rows[0].total),
    recentOrders: recentOrders.rows,
  };
};