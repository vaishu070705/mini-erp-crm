"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const db_1 = __importDefault(require("../config/db"));
const getOrders = async () => {
    const result = await db_1.default.query(`
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
exports.getOrders = getOrders;
const getOrderById = async (id) => {
    const result = await db_1.default.query("SELECT * FROM orders WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getOrderById = getOrderById;
const createOrder = async (data) => {
    const result = await db_1.default.query(`INSERT INTO orders
    (customer_id, product_id, quantity, total_price, order_status)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`, [
        data.customer_id,
        data.product_id,
        data.quantity,
        data.total_price,
        data.order_status,
    ]);
    return result.rows[0];
};
exports.createOrder = createOrder;
const updateOrder = async (id, data) => {
    const result = await db_1.default.query(`UPDATE orders
    SET customer_id=$1,
        product_id=$2,
        quantity=$3,
        total_price=$4,
        order_status=$5
    WHERE id=$6
    RETURNING *`, [
        data.customer_id,
        data.product_id,
        data.quantity,
        data.total_price,
        data.order_status,
        id,
    ]);
    return result.rows[0];
};
exports.updateOrder = updateOrder;
const deleteOrder = async (id) => {
    await db_1.default.query("DELETE FROM orders WHERE id = $1", [id]);
};
exports.deleteOrder = deleteOrder;
