import { verifyToken } from "../middleware/auth.middleware";
import { Router } from "express";
import {
  register,
  login,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: (req as any).user
    });
});
export default router;