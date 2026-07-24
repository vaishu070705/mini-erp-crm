import { Router } from "express";
import {
  addChallanItem,
  cancelChallan,
  confirmChallan,
  createChallan,
  deleteChallanItem,
  deleteChallan,
  getAllChallans,
  getChallanById,
  getChallanItems,
  updateChallan,
} from "../controllers/challanController";

const router = Router();

router.get("/", getAllChallans);
router.get("/:id", getChallanById);
router.post("/", createChallan);
router.put("/:id", updateChallan);
router.delete("/:id", deleteChallan);
router.put("/:id/confirm", confirmChallan);
router.put("/:id/cancel", cancelChallan);
router.post("/:id/items", addChallanItem);
router.get("/:id/items", getChallanItems);
router.delete("/:id/items/:itemId", deleteChallanItem);

export default router;
