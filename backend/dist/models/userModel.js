"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByEmail = void 0;
const db_1 = __importDefault(require("../config/db"));
const findUserByEmail = async (email) => {
    const result = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
    return result.rows[0];
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (fullName, email, password) => {
    const result = await db_1.default.query(`INSERT INTO users(full_name,email,password)
     VALUES($1,$2,$3)
     RETURNING *`, [fullName, email, password]);
    return result.rows[0];
};
exports.createUser = createUser;
