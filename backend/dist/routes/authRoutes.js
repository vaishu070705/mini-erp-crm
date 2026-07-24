"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/profile", auth_middleware_1.verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});
exports.default = router;
