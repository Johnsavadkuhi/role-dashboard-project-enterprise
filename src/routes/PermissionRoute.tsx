import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

export default function PermissionRoute({ permissions = [] }) {
  const { hasAnyPermission } = usePermission();

  if (!hasAnyPermission(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
