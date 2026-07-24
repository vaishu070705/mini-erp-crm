import { Router } from "express";
import {
  getAllProducts,
  getSingleProduct,
  createNewProduct,
  editProduct,
  removeProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", createNewProduct);
router.put("/:id", editProduct);
router.delete("/:id", removeProduct);

export default router;