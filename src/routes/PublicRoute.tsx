import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPathByPermissions } from "@/utils/dashboard";

export default function PublicRoute() {
  const { isAuthenticated, permissions } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathByPermissions(permissions)} replace />;
  }

  return <Outlet />;
}
