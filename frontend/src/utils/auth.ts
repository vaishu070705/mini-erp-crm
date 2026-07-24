export type UserRole = "Admin" | "Sales" | "Warehouse" | "Accounts";

export const getUserRole = (): UserRole | null => {
  const role = localStorage.getItem("role") as UserRole | null;
  return role;
};

export const hasAllowedRole = (allowedRoles: UserRole[]) => {
  const role = getUserRole();
  return Boolean(role && allowedRoles.includes(role));
};

export const canAccessNav = (label: string) => {
  const role = getUserRole();

  if (role === "Admin") return true;

  const accessMap: Record<UserRole, string[]> = {
    Admin: ["Dashboard", "Customers", "Products", "Orders", "Sales Challans", "Stock History"],
    Sales: ["Dashboard", "Customers", "Orders", "Sales Challans"],
    Warehouse: ["Dashboard", "Products", "Stock History"],
    Accounts: ["Dashboard", "Orders"],
  };

  return Boolean(role && accessMap[role]?.includes(label));
};
