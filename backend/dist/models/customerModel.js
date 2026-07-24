"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerFollowup = exports.getCustomerFollowups = exports.deleteCustomer = exports.createCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getCustomers = async () => {
    const result = await db_1.default.query("SELECT * FROM customers ORDER BY id DESC");
    return result.rows;
};
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    const result = await db_1.default.query("SELECT * FROM customers WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (id, customer_name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes) => {
    const result = await db_1.default.query(`UPDATE customers
     SET customer_name=$1,
         mobile=$2,
         email=$3,
         business_name=$4,
         gst_number=$5,
         customer_type=$6,
         address=$7,
         status=$8,
         follow_up_date=$9,
         notes=$10
     WHERE id=$11
     RETURNING *`, [
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes,
        id,
    ]);
    return result.rows[0];
};
exports.updateCustomer = updateCustomer;
const createCustomer = async (customer_name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes) => {
    const result = await db_1.default.query(`INSERT INTO customers
    (customer_name,mobile,email,business_name,gst_number,
    customer_type,address,status,follow_up_date,notes)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`, [
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes,
    ]);
    return result.rows[0];
};
exports.createCustomer = createCustomer;
const deleteCustomer = async (id) => {
    const result = await db_1.default.query("DELETE FROM customers WHERE id=$1 RETURNING *", [id]);
    return result.rows[0];
};
exports.deleteCustomer = deleteCustomer;
const getCustomerFollowups = async (customerId) => {
    const result = await db_1.default.query(`SELECT *
     FROM customer_followups
     WHERE customer_id = $1
     ORDER BY created_at DESC, id DESC`, [customerId]);
    return result.rows;
};
exports.getCustomerFollowups = getCustomerFollowups;
const createCustomerFollowup = async (customerId, note, followUpDate, createdBy) => {
    const result = await db_1.default.query(`INSERT INTO customer_followups
     (customer_id, note, follow_up_date, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [customerId, note, followUpDate || null, createdBy || "System"]);
    return result.rows[0];
};
exports.createCustomerFollowup = createCustomerFollowup;
