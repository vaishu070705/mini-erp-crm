"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await (0, userModel_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await (0, userModel_1.createUser)(fullName, email, hashedPassword);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Registration failed",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, userModel_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Login failed",
        });
    }
};
exports.login = login;
