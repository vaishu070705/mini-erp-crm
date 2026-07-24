"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductStockMovements = exports.getAllStockMovements = void 0;
const stockMovementModel_1 = require("../models/stockMovementModel");
const getAllStockMovements = async (_req, res) => {
    try {
        const movements = await (0, stockMovementModel_1.getStockMovements)();
        res.json(movements);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch stock movements" });
    }
};
exports.getAllStockMovements = getAllStockMovements;
const getProductStockMovements = async (req, res) => {
    try {
        const movements = await (0, stockMovementModel_1.getStockMovementsByProduct)(Number(req.params.productId));
        res.json(movements);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch product stock history" });
    }
};
exports.getProductStockMovements = getProductStockMovements;
