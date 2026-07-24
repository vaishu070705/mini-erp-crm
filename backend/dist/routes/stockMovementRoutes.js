"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockMovementController_1 = require("../controllers/stockMovementController");
const router = (0, express_1.Router)();
router.get("/", stockMovementController_1.getAllStockMovements);
router.get("/:productId", stockMovementController_1.getProductStockMovements);
exports.default = router;
