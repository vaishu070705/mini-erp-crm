import { Router } from "express";
import {
  getAllStockMovements,
  getProductStockMovements,
} from "../controllers/stockMovementController";

const router = Router();

router.get("/", getAllStockMovements);
router.get("/:productId", getProductStockMovements);

export default router;
