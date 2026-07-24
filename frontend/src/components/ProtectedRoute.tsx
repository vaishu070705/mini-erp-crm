import { Navigate } from "react-router-dom";
import { hasAllowedRole } from "../utils/auth";
import type { UserRole } from "../utils/auth";

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!hasAllowedRole(allowedRoles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
