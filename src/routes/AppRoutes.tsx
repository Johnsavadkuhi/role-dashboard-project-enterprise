import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PermissionRoute from "@/routes/PermissionRoute";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { protectedRouteConfig } from "@/config/appRoutes";

const Login = lazy(() => import("@/pages/public/Login"));
const Signup = lazy(() => import("@/pages/public/Signup"));
const ForgotPassword = lazy(() => import("@/pages/public/ForgotPassword"));
const Unauthorized = lazy(() => import("@/pages/shared/Unauthorized"));
const NotFound = lazy(() => import("@/pages/shared/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen text="Loading page..." />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<PublicRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/unauthorized" element={<Unauthorized />} />
            {protectedRouteConfig.map((route) => {
              const Page = route.element;
              return (
                <Route
                  key={route.path}
                  element={
                    <PermissionRoute
                      permissions={route.permissions}
                      roles={route.roles}
                    />
                  }
                >
                  <Route
                    path={route.path}
                    element={
                      <ErrorBoundary>
                        <Page />
                      </ErrorBoundary>
                    }
                  />
                </Route>
              );
            })}
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
