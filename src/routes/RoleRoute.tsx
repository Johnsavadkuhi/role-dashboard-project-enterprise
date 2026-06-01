import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

export default function RoleRoute({ allowedRoles = [] }) {
  const { roles } = usePermission();
  const hasAccess = allowedRoles.length === 0 || roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
