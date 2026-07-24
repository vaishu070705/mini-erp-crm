"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChallan = exports.cancelChallan = exports.confirmChallan = exports.updateChallan = exports.createChallan = exports.deleteChallanItem = exports.addChallanItem = exports.getChallanItems = exports.getChallanById = exports.getChallans = exports.generateChallanNumber = void 0;
const db_1 = __importDefault(require("../config/db"));
const VALID_STATUSES = ["Draft", "Confirmed", "Cancelled"];
const validateStatus = (status) => {
    if (!VALID_STATUSES.includes(status)) {
        throw new Error("Invalid challan status");
    }
};
const validateItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("At least one challan item is required");
    }
    items.forEach((item) => {
        if (!Number.isInteger(Number(item.product_id)) || Number(item.product_id) <= 0) {
            throw new Error("Valid product is required for every item");
        }
        if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
    });
};
const getTotalQuantity = (items) => items.reduce((total, item) => total + Number(item.quantity), 0);
const generateChallanNumber = async (client) => {
    const year = new Date().getFullYear();
    const prefix = `CH-${year}-`;
    const result = await client.query(`SELECT challan_number
     FROM challans
     WHERE challan_number LIKE $1
     ORDER BY CAST(SPLIT_PART(challan_number, '-', 3) AS INTEGER) DESC
     LIMIT 1`, [`${prefix}%`]);
    const lastNumber = result.rows[0]?.challan_number;
    const nextSequence = lastNumber
        ? Number(String(lastNumber).split("-")[2]) + 1
        : 1;
    return `${prefix}${String(nextSequence).padStart(4, "0")}`;
};
exports.generateChallanNumber = generateChallanNumber;
const getChallanItemsForStock = async (client, challanId) => {
    const result = await client.query(`SELECT product_id, quantity
     FROM challan_items
     WHERE challan_id = $1`, [challanId]);
    return result.rows;
};
const restoreStock = async (client, items) => {
    for (const item of items) {
        await client.query(`UPDATE products
       SET current_stock = current_stock + $1
       WHERE id = $2`, [Number(item.quantity), Number(item.product_id)]);
    }
};
const deductStock = async (client, items) => {
    for (const item of items) {
        const product = await client.query(`SELECT id, product_name, current_stock
       FROM products
       WHERE id = $1
       FOR UPDATE`, [Number(item.product_id)]);
        if (!product.rows[0]) {
            throw new Error("Product not found");
        }
        const currentStock = Number(product.rows[0].current_stock);
        const quantity = Number(item.quantity);
        if (currentStock - quantity < 0) {
            throw new Error(`Insufficient stock for ${product.rows[0].product_name}. Available stock is ${currentStock}`);
        }
        await client.query(`UPDATE products
       SET current_stock = current_stock - $1
       WHERE id = $2`, [quantity, Number(item.product_id)]);
    }
};
const deductStockForConfirmation = async (client, items) => {
    const productQuantities = new Map();
    for (const item of items) {
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);
        productQuantities.set(productId, (productQuantities.get(productId) || 0) + quantity);
    }
    for (const [productId, quantity] of productQuantities) {
        const product = await client.query(`SELECT id, product_name, current_stock
       FROM products
       WHERE id = $1
       FOR UPDATE`, [productId]);
        if (!product.rows[0]) {
            throw new Error("Product not found");
        }
        const currentStock = Number(product.rows[0].current_stock);
        if (currentStock - quantity < 0) {
            throw new Error(`Insufficient stock for ${product.rows[0].product_name}. Available stock is ${currentStock}`);
        }
    }
    for (const [productId, quantity] of productQuantities) {
        const result = await client.query(`UPDATE products
       SET current_stock = current_stock - $1
       WHERE id = $2 AND current_stock >= $1
       RETURNING id`, [quantity, productId]);
        if (!result.rows[0]) {
            throw new Error("Insufficient stock while confirming challan");
        }
    }
};
const insertChallanItems = async (client, challanId, items) => {
    for (const item of items) {
        const product = await client.query(`SELECT id, product_name, sku, unit_price
       FROM products
       WHERE id = $1`, [Number(item.product_id)]);
        if (!product.rows[0]) {
            throw new Error("Product not found");
        }
        await client.query(`INSERT INTO challan_items
       (challan_id, product_id, product_name_snapshot, unit_price_snapshot, quantity)
       VALUES ($1, $2, $3, $4, $5)`, [
            challanId,
            Number(item.product_id),
            product.rows[0].product_name,
            Number(product.rows[0].unit_price),
            Number(item.quantity),
        ]);
    }
};
const recalculateChallanTotalQuantity = async (client, challanId) => {
    const result = await client.query(`SELECT COALESCE(SUM(quantity), 0) AS total_quantity
     FROM challan_items
     WHERE challan_id = $1`, [challanId]);
    const totalQuantity = Number(result.rows[0].total_quantity);
    await client.query(`UPDATE challans
     SET total_quantity = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`, [totalQuantity, challanId]);
    return totalQuantity;
};
const getChallans = async () => {
    const result = await db_1.default.query(`SELECT c.*, customers.customer_name
     FROM challans c
     LEFT JOIN customers ON customers.id = c.customer_id
     ORDER BY c.id DESC`);
    return result.rows;
};
exports.getChallans = getChallans;
const getChallanById = async (id) => {
    const challan = await db_1.default.query(`SELECT c.*, customers.customer_name, customers.mobile, customers.email, customers.business_name
     FROM challans c
     LEFT JOIN customers ON customers.id = c.customer_id
     WHERE c.id = $1`, [id]);
    if (!challan.rows[0])
        return null;
    const items = await db_1.default.query(`SELECT id,
            challan_id,
            product_id,
            product_name_snapshot,
            product_name_snapshot AS product_name,
            unit_price_snapshot,
            unit_price_snapshot AS unit_price,
            quantity
     FROM challan_items
     WHERE challan_id = $1
     ORDER BY id ASC`, [id]);
    return {
        ...challan.rows[0],
        items: items.rows,
    };
};
exports.getChallanById = getChallanById;
const getChallanItems = async (challanId) => {
    const result = await db_1.default.query(`SELECT ci.id,
            ci.challan_id,
            ci.product_id,
            ci.product_name_snapshot,
            ci.product_name_snapshot AS product_name,
            ci.unit_price_snapshot,
            ci.unit_price_snapshot AS unit_price,
            ci.quantity
     FROM challan_items ci
     WHERE ci.challan_id = $1
     ORDER BY ci.id ASC`, [challanId]);
    return result.rows;
};
exports.getChallanItems = getChallanItems;
const addChallanItem = async (challanId, productId, quantity) => {
    if (!Number.isInteger(Number(productId)) || Number(productId) <= 0) {
        throw new Error("Valid product is required");
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        throw new Error("Quantity must be greater than zero");
    }
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const challan = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [challanId]);
        if (!challan.rows[0]) {
            throw new Error("Challan not found");
        }
        if (challan.rows[0].status !== "Draft") {
            throw new Error("Items can only be added to draft challans");
        }
        const product = await client.query(`SELECT id, product_name, unit_price
       FROM products
       WHERE id = $1`, [productId]);
        if (!product.rows[0]) {
            throw new Error("Product not found");
        }
        const item = await client.query(`INSERT INTO challan_items
       (challan_id, product_id, product_name_snapshot, unit_price_snapshot, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id,
                 challan_id,
                 product_id,
                 product_name_snapshot,
                 unit_price_snapshot,
                 quantity`, [
            challanId,
            productId,
            product.rows[0].product_name,
            Number(product.rows[0].unit_price),
            quantity,
        ]);
        const totalQuantity = await recalculateChallanTotalQuantity(client, challanId);
        await client.query("COMMIT");
        return {
            item: item.rows[0],
            total_quantity: totalQuantity,
        };
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.addChallanItem = addChallanItem;
const deleteChallanItem = async (challanId, itemId) => {
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const challan = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [challanId]);
        if (!challan.rows[0]) {
            throw new Error("Challan not found");
        }
        if (challan.rows[0].status !== "Draft") {
            throw new Error("Items can only be removed from draft challans");
        }
        const deleted = await client.query(`DELETE FROM challan_items
       WHERE id = $1 AND challan_id = $2
       RETURNING *`, [itemId, challanId]);
        if (!deleted.rows[0]) {
            throw new Error("Challan item not found");
        }
        const totalQuantity = await recalculateChallanTotalQuantity(client, challanId);
        await client.query("COMMIT");
        return {
            deleted: deleted.rows[0],
            total_quantity: totalQuantity,
        };
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.deleteChallanItem = deleteChallanItem;
const createChallan = async (input) => {
    validateStatus(input.status);
    validateItems(input.items);
    if (!Number.isInteger(Number(input.created_by)) || Number(input.created_by) <= 0) {
        throw new Error("Valid created_by user id is required");
    }
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        if (input.status === "Confirmed") {
            await deductStock(client, input.items);
        }
        const challanNumber = await (0, exports.generateChallanNumber)(client);
        const totalQuantity = getTotalQuantity(input.items);
        const challan = await client.query(`INSERT INTO challans
       (challan_number, customer_id, status, total_quantity, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [
            challanNumber,
            Number(input.customer_id),
            input.status,
            totalQuantity,
            Number(input.created_by),
        ]);
        await insertChallanItems(client, challan.rows[0].id, input.items);
        await client.query("COMMIT");
        return (0, exports.getChallanById)(challan.rows[0].id);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.createChallan = createChallan;
const updateChallan = async (id, input) => {
    validateStatus(input.status);
    validateItems(input.items);
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const existing = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (!existing.rows[0]) {
            throw new Error("Challan not found");
        }
        if (existing.rows[0].status === "Confirmed") {
            const oldItems = await getChallanItemsForStock(client, id);
            await restoreStock(client, oldItems);
        }
        if (input.status === "Confirmed") {
            await deductStock(client, input.items);
        }
        const totalQuantity = getTotalQuantity(input.items);
        await client.query(`UPDATE challans
       SET customer_id = $1,
           status = $2,
           total_quantity = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`, [Number(input.customer_id), input.status, totalQuantity, id]);
        await client.query("DELETE FROM challan_items WHERE challan_id = $1", [id]);
        await insertChallanItems(client, id, input.items);
        await client.query("COMMIT");
        return (0, exports.getChallanById)(id);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.updateChallan = updateChallan;
const confirmChallan = async (id) => {
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const challan = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (!challan.rows[0]) {
            throw new Error("Challan not found");
        }
        if (challan.rows[0].status === "Confirmed") {
            throw new Error("Challan is already confirmed");
        }
        if (challan.rows[0].status === "Cancelled") {
            throw new Error("Cancelled challans cannot be confirmed");
        }
        const items = await getChallanItemsForStock(client, id);
        validateItems(items);
        await deductStockForConfirmation(client, items);
        await client.query(`UPDATE challans
       SET status = 'Confirmed',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`, [id]);
        await client.query("COMMIT");
        return (0, exports.getChallanById)(id);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.confirmChallan = confirmChallan;
const cancelChallan = async (id) => {
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const existing = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (!existing.rows[0]) {
            throw new Error("Challan not found");
        }
        if (existing.rows[0].status === "Confirmed") {
            const oldItems = await getChallanItemsForStock(client, id);
            await restoreStock(client, oldItems);
        }
        await client.query(`UPDATE challans
       SET status = 'Cancelled',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`, [id]);
        await client.query("COMMIT");
        return (0, exports.getChallanById)(id);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.cancelChallan = cancelChallan;
const deleteChallan = async (id) => {
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const existing = await client.query(`SELECT *
       FROM challans
       WHERE id = $1
       FOR UPDATE`, [id]);
        if (!existing.rows[0]) {
            throw new Error("Challan not found");
        }
        if (existing.rows[0].status === "Confirmed") {
            const oldItems = await getChallanItemsForStock(client, id);
            await restoreStock(client, oldItems);
        }
        await client.query("DELETE FROM challan_items WHERE challan_id = $1", [id]);
        await client.query("DELETE FROM challans WHERE id = $1", [id]);
        await client.query("COMMIT");
        return true;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.deleteChallan = deleteChallan;
