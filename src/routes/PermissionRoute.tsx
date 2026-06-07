import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

export default function PermissionRoute({ permissions = [], roles = [] }) {
  const { hasAnyPermission, roles: userRoles } = usePermission();

  const hasRequiredRole =
    roles.length === 0 || roles.some((role) => userRoles.includes(role));

  if (!hasAnyPermission(permissions) || !hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
