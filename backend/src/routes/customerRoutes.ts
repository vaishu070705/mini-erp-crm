import { Router } from "express";
import {
  getAllCustomers,
  getCustomer,
  addCustomer,
  editCustomer,
  removeCustomer,
  getFollowups,
  addFollowup,
} from "../controllers/customerController";

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomer);
router.get("/:id/followups", getFollowups);
router.post("/:id/followups", addFollowup);
router.post("/", addCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", removeCustomer);

export default router;
