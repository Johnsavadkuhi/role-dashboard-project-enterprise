import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import PermissionRoute from "@/routes/PermissionRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import PermissionGate from "@/components/PermissionGate";
import Sidebar from "@/components/Sidebar";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { hasPermissionGrant } from "@/utils/permissionGrants";
import { renderWithProviders } from "@/test/renderWithProviders";
import {
  adminAuthState,
  qaAuthState,
  securityProjectManagerAuthState,
} from "@/test/testUsers";

describe("permission mapping", () => {
  it("admin wildcard grants concrete frontend permissions", () => {
    const permissions = [PERMISSIONS.ADMIN_ALL];
    expect(hasPermissionGrant(permissions, PERMISSIONS.USERS_DELETE)).toBe(true);
    expect(hasPermissionGrant(permissions, PERMISSIONS.PROJECTS_CREATE)).toBe(true);
    expect(hasPermissionGrant(permissions, PERMISSIONS.QA_DASHBOARD_READ)).toBe(true);
  });

  it("concrete permissions remain exact for non-admin users", () => {
    const permissions = [PERMISSIONS.QA_DASHBOARD_READ];
    expect(hasPermissionGrant(permissions, PERMISSIONS.QA_DASHBOARD_READ)).toBe(true);
    expect(hasPermissionGrant(permissions, PERMISSIONS.USERS_DELETE)).toBe(false);
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
        <Route
          element={<PermissionRoute permissions={[PERMISSIONS.QA_DASHBOARD_READ]} />}
        >
          <Route path="/qa" element={<div>QA Page</div>} />
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>,
      { route: "/qa", preloadedState: { auth: qaAuthState } }
    );
    expect(screen.getByText("QA Page")).toBeInTheDocument();
  });

  it("blocks dashboard routes when the user has permission but not the represented role", () => {
    renderWithProviders(
      <Routes>
        <Route
          element={
            <PermissionRoute
              permissions={[PERMISSIONS.QA_DASHBOARD_READ]}
              roles={[ROLES.QA]}
            />
          }
        >
          <Route path="/qa" element={<div>QA Page</div>} />
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>,
      { route: "/qa", preloadedState: { auth: adminAuthState } }
    );
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("blocks users without required permission", () => {
    renderWithProviders(
      <Routes>
        <Route
          element={<PermissionRoute permissions={[PERMISSIONS.ADMIN_DASHBOARD_READ]} />}
        >
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
    renderWithProviders(<Sidebar />, {
      preloadedState: { auth: qaAuthState, ui: { sidebarOpen: true, theme: "light" } },
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("QA Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Project")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("Sidebar shows one dashboard entry for admins", () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: adminAuthState,
        ui: { sidebarOpen: true, drawerOpen: false, theme: "light" },
      },
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("QA Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Pentester Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Security Manager Dashboard")).not.toBeInTheDocument();
  });

  it("Sidebar derives admin drawer links when permissions are empty", async () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            id: "admin-empty-permissions-test",
            name: "Admin Empty Permissions Test",
            username: "admin.empty.permissions.test",
            roles: [ROLES.ADMIN],
            permissions: [],
          },
        },
        ui: { sidebarOpen: true, drawerOpen: false, theme: "light" },
      },
    });

    expect(await screen.findByText("User Management")).toBeInTheDocument();
    expect(await screen.findByText("Create Project")).toBeInTheDocument();
    expect(await screen.findByText("Projects")).toBeInTheDocument();
  });

  it("Sidebar groups features by assigned roles for multi-role users", () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            id: "admin-pentester-test",
            name: "Admin Pentester Test",
            username: "admin.pentester.test",
            roles: [ROLES.ADMIN, ROLES.PENTESTER],
            permissions: [PERMISSIONS.ADMIN_ALL],
          },
        },
        ui: { sidebarOpen: true, drawerOpen: false, theme: "light" },
      },
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Pentester")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
    expect(screen.getAllByText("Projects")).toHaveLength(2);
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Pentester Dashboard")).not.toBeInTheDocument();
  });

  it("Sidebar shows a single dashboard entry for security project managers", () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: securityProjectManagerAuthState,
        ui: { sidebarOpen: true, theme: "light" },
      },
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Security Manager Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });
});
