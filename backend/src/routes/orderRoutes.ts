import { Router } from "express";
import {
  getAllOrders,
  getOrder,
  addOrder,
  editOrder,
  removeOrder,
} from "../controllers/orderController";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/", addOrder);
router.put("/:id", editOrder);
router.delete("/:id", removeOrder);

export default router;