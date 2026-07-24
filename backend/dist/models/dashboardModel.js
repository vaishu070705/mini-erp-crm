"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async () => {
    const customerResult = await db_1.default.query("SELECT COUNT(*) AS total FROM customers");
    const productResult = await db_1.default.query("SELECT COUNT(*) AS total FROM products");
    const orderResult = await db_1.default.query("SELECT COUNT(*) AS total FROM orders");
    const revenueResult = await db_1.default.query("SELECT COALESCE(SUM(total_price),0) AS total FROM orders");
    const recentOrders = await db_1.default.query(`
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
exports.getDashboardStats = getDashboardStats;
