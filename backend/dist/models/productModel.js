"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const stockMovementModel_1 = require("./stockMovementModel");
// Get all products
const getProducts = async () => {
    const result = await db_1.default.query("SELECT * FROM products ORDER BY id DESC");
    return result.rows;
};
exports.getProducts = getProducts;
// Get single product
const getProductById = async (id) => {
    const result = await db_1.default.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getProductById = getProductById;
// Create product
const createProduct = async (product_name, sku, category, unit_price, current_stock, minimum_stock_alert, warehouse_location) => {
    const result = await db_1.default.query(`INSERT INTO products
    (product_name, sku, category, unit_price, current_stock, minimum_stock_alert, warehouse_location)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`, [
        product_name,
        sku,
        category,
        unit_price,
        current_stock,
        minimum_stock_alert,
        warehouse_location,
    ]);
    if (Number(current_stock) > 0) {
        await (0, stockMovementModel_1.createStockMovement)(result.rows[0].id, "IN", Number(current_stock), "Initial product stock");
    }
    return result.rows[0];
};
exports.createProduct = createProduct;
// Update product
const updateProduct = async (id, product_name, unit_price, current_stock) => {
    const existing = await db_1.default.query("SELECT current_stock FROM products WHERE id=$1", [id]);
    const result = await db_1.default.query(`UPDATE products
     SET product_name=$1,
         unit_price=$2,
         current_stock=$3
     WHERE id=$4
     RETURNING *`, [
        product_name,
        unit_price,
        current_stock,
        id,
    ]);
    if (existing.rows[0] && result.rows[0]) {
        const oldStock = Number(existing.rows[0].current_stock);
        const newStock = Number(result.rows[0].current_stock);
        const difference = newStock - oldStock;
        if (difference > 0) {
            await (0, stockMovementModel_1.createStockMovement)(id, "IN", difference, "Product stock updated");
        }
        if (difference < 0) {
            await (0, stockMovementModel_1.createStockMovement)(id, "OUT", Math.abs(difference), "Product stock updated");
        }
    }
    return result.rows[0];
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (id) => {
    await db_1.default.query("DELETE FROM products WHERE id=$1", [id]);
    return true;
};
exports.deleteProduct = deleteProduct;
