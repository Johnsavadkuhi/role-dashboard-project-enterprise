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
import { adminAuthState, qaAuthState, securityProjectManagerAuthState } from "@/test/testUsers";

describe("permission mapping", () => {
  it("admin receives all permissions", () => {
    const permissions = getPermissionsFromRoles([ROLES.ADMIN]);
    expect(permissions).toContain(PERMISSIONS.USERS_DELETE);
    expect(permissions).toContain(PERMISSIONS.QA_DASHBOARD_READ);
    expect(permissions).toContain(PERMISSIONS.SECURITY_REPORTS_SUBMIT_FOR_APPROVAL);
    expect(permissions).toContain(PERMISSIONS.QUALITY_REPORTS_SUBMIT_FOR_APPROVAL);
  });

  it("multi-role users receive merged permissions", () => {
    const permissions = getPermissionsFromRoles([ROLES.PENTESTER, ROLES.QA]);
    expect(permissions).toContain(PERMISSIONS.PENTEST_DASHBOARD_READ);
    expect(permissions).toContain(PERMISSIONS.QA_DASHBOARD_READ);
  });

  it("security project managers can assign work and review findings", () => {
    const permissions = getPermissionsFromRoles([ROLES.SECURITY_PROJECT_MANAGER]);
    expect(permissions).toContain(PERMISSIONS.SECURITY_PROJECTS_ASSIGN);
    expect(permissions).toContain(PERMISSIONS.SECURITY_PROJECTS_ASSIGN_SELF);
    expect(permissions).toContain(PERMISSIONS.SECURITY_FINDINGS_APPROVE);
    expect(permissions).toContain(PERMISSIONS.SECURITY_FINDINGS_REJECT);
  });

  it("quality project managers can assign work and review results", () => {
    const permissions = getPermissionsFromRoles([ROLES.QUALITY_PROJECT_MANAGER]);
    expect(permissions).toContain(PERMISSIONS.QUALITY_PROJECTS_ASSIGN);
    expect(permissions).toContain(PERMISSIONS.QUALITY_PROJECTS_ASSIGN_SELF);
    expect(permissions).toContain(PERMISSIONS.QUALITY_RESULTS_APPROVE);
    expect(permissions).toContain(PERMISSIONS.QUALITY_RESULTS_REJECT);
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

  it("Sidebar shows the security manager dashboard for security project managers", () => {
    renderWithProviders(<Sidebar />, { preloadedState: { auth: securityProjectManagerAuthState, ui: { sidebarOpen: true, theme: "light" } } });
    expect(screen.getByText("Security Manager Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });
});
