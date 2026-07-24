"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({
                message: "Access denied. You are not authorized to access this resource.",
            });
        }
        next();
    };
};
exports.authorize = authorize;
