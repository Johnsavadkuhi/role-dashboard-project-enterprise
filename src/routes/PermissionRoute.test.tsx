import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import PermissionRoute from "@/routes/PermissionRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import PermissionGate from "@/components/PermissionGate";
import Sidebar from "@/components/Sidebar";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { renderWithProviders } from "@/test/renderWithProviders";
import { adminAuthState, qaAuthState } from "@/test/testUsers";

describe("permission mapping", () => {
  it("admin receives all permissions", () => {
    const permissions = getPermissionsFromRoles([ROLES.ADMIN]);
    expect(permissions).toContain(PERMISSIONS.USERS_DELETE);
    expect(permissions).toContain(PERMISSIONS.QA_DASHBOARD_READ);
  });

  it("multi-role users receive merged permissions", () => {
    const permissions = getPermissionsFromRoles([ROLES.PENTESTER, ROLES.QA]);
    expect(permissions).toContain(PERMISSIONS.PENTEST_DASHBOARD_READ);
    expect(permissions).toContain(PERMISSIONS.QA_DASHBOARD_READ);
  });
});

describe("route guards", () => {
  it("redirects unauthenticated users from protected routes", () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/private" element={<div>Private Page</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { route: "/private" }
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("allows users with required permission", () => {
    renderWithProviders(
      <Routes>
        <Route element={<PermissionRoute permissions={[PERMISSIONS.QA_DASHBOARD_READ]} />}>
          <Route path="/qa" element={<div>QA Page</div>} />
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>,
      { route: "/qa", preloadedState: { auth: qaAuthState } }
    );
    expect(screen.getByText("QA Page")).toBeInTheDocument();
  });

  it("blocks users without required permission", () => {
    renderWithProviders(
      <Routes>
        <Route element={<PermissionRoute permissions={[PERMISSIONS.ADMIN_DASHBOARD_READ]} />}>
          <Route path="/admin" element={<div>Admin Page</div>} />
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>,
      { route: "/admin", preloadedState: { auth: qaAuthState } }
    );
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("redirects authenticated users away from public routes", () => {
    renderWithProviders(
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>,
      { route: "/login", preloadedState: { auth: adminAuthState } }
    );
    expect(screen.getByText("Admin Page")).toBeInTheDocument();
  });
});

describe("permission UI", () => {
  it("PermissionGate hides forbidden content", () => {
    renderWithProviders(
      <PermissionGate permissions={[PERMISSIONS.USERS_DELETE]}>
        <button>Delete User</button>
      </PermissionGate>,
      { preloadedState: { auth: qaAuthState } }
    );
    expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
  });

  it("Sidebar only shows links allowed by current permissions", () => {
    renderWithProviders(<Sidebar />, { preloadedState: { auth: qaAuthState, ui: { sidebarOpen: true, theme: "light" } } });
    expect(screen.getByText("QA Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });
});
