import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPathByRoles } from "@/utils/dashboard";

export default function PublicRoute() {
  const { isAuthenticated, permissions, roles } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathByRoles(roles, permissions)} replace />;
  }

  return <Outlet />;
}
