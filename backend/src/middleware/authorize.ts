import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export type UserRole = "Admin" | "Sales" | "Warehouse" | "Accounts";

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to access this resource.",
      });
    }

    next();
  };
};
