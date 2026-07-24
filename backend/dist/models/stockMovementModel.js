"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMovementsByProduct = exports.getStockMovements = exports.createStockMovement = void 0;
const db_1 = __importDefault(require("../config/db"));
const createStockMovement = async (product_id, movement_type, quantity, reason) => {
    if (!Number.isInteger(Number(product_id)) || Number(product_id) <= 0) {
        throw new Error("Valid product is required");
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        throw new Error("Quantity must be greater than zero");
    }
    if (!["IN", "OUT"].includes(movement_type)) {
        throw new Error("Movement type must be IN or OUT");
    }
    const result = await db_1.default.query(`INSERT INTO stock_movements
     (product_id, movement_type, quantity, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [product_id, movement_type, quantity, reason]);
    return result.rows[0];
};
exports.createStockMovement = createStockMovement;
const getStockMovements = async () => {
    const result = await db_1.default.query(`SELECT sm.id,
            sm.product_id,
            p.product_name,
            sm.movement_type,
            sm.quantity,
            sm.reason,
            sm.created_at
     FROM stock_movements sm
     LEFT JOIN products p ON p.id = sm.product_id
     ORDER BY sm.created_at DESC, sm.id DESC`);
    return result.rows;
};
exports.getStockMovements = getStockMovements;
const getStockMovementsByProduct = async (productId) => {
    const result = await db_1.default.query(`SELECT sm.id,
            sm.product_id,
            p.product_name,
            sm.movement_type,
            sm.quantity,
            sm.reason,
            sm.created_at
     FROM stock_movements sm
     LEFT JOIN products p ON p.id = sm.product_id
     WHERE sm.product_id = $1
     ORDER BY sm.created_at DESC, sm.id DESC`, [productId]);
    return result.rows;
};
exports.getStockMovementsByProduct = getStockMovementsByProduct;
