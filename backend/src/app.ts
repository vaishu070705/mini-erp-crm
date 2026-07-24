import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import challanRoutes from "./routes/challanRoutes";
import stockMovementRoutes from "./routes/stockMovementRoutes";
import { verifyToken } from "./middleware/auth.middleware";
import { authorize } from "./middleware/authorize";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Mini ERP CRM Backend Running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Authentication Routes
app.use("/api/auth", authRoutes);
//Employee Routes
app.use("/api/customers", verifyToken, authorize(["Admin", "Sales"]), customerRoutes);
// product Routes
app.use("/api/products", verifyToken, authorize(["Admin", "Warehouse"]), productRoutes);
// order Routes
app.use("/api/orders", verifyToken, authorize(["Admin", "Sales", "Accounts"]), orderRoutes);
app.use(
  "/api/dashboard",
  verifyToken,
  authorize(["Admin", "Sales", "Warehouse", "Accounts"]),
  dashboardRoutes
);
app.use("/api/challans", verifyToken, authorize(["Admin", "Sales"]), challanRoutes);
app.use(
  "/api/stock-movements",
  verifyToken,
  authorize(["Admin", "Warehouse"]),
  stockMovementRoutes
);

export default app;
