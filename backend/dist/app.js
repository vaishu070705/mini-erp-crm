"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const challanRoutes_1 = __importDefault(require("./routes/challanRoutes"));
const stockMovementRoutes_1 = __importDefault(require("./routes/stockMovementRoutes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const authorize_1 = require("./middleware/authorize");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Test Route
app.get("/", async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT NOW()");
        res.json({
            message: "Mini ERP CRM Backend Running",
            databaseTime: result.rows[0].now,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Database connection failed",
        });
    }
});
// Authentication Routes
app.use("/api/auth", authRoutes_1.default);
//Employee Routes
app.use("/api/customers", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Sales"]), customerRoutes_1.default);
// product Routes
app.use("/api/products", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Warehouse"]), productRoutes_1.default);
// order Routes
app.use("/api/orders", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Sales", "Accounts"]), orderRoutes_1.default);
app.use("/api/dashboard", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Sales", "Warehouse", "Accounts"]), dashboardRoutes_1.default);
app.use("/api/challans", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Sales"]), challanRoutes_1.default);
app.use("/api/stock-movements", auth_middleware_1.verifyToken, (0, authorize_1.authorize)(["Admin", "Warehouse"]), stockMovementRoutes_1.default);
exports.default = app;
