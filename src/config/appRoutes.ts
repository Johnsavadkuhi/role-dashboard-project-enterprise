import { lazy } from "react";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";

const AdminDashboard = lazy(() => import("@/modules/admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("@/modules/admin/pages/AdminUsers"));
const PentesterDashboard = lazy(
  () => import("@/modules/pentester/pages/PentesterDashboard")
);
const SecurityProjectManagerDashboard = lazy(
  () => import("@/modules/security-manager/pages/SecurityProjectManagerDashboard")
);
const DevOpsDashboard = lazy(() => import("@/modules/devops/pages/DevOpsDashboard"));
const RepresentativeDashboard = lazy(
  () => import("@/modules/representative/pages/RepresentativeDashboard")
);
const QualityAssuranceDashboard = lazy(
  () => import("@/modules/qa/pages/QualityAssuranceDashboard")
);
const QualityProjectManagerDashboard = lazy(
  () => import("@/modules/quality-manager/pages/QualityProjectManagerDashboard")
);
const Profile = lazy(() => import("@/pages/shared/Profile"));
const Settings = lazy(() => import("@/pages/shared/Settings"));
const Projects = lazy(() => import("@/pages/shared/Projects"));
const CreateProject = lazy(() => import("@/pages/shared/CreateProject"));

const projectRoutePermissions = [
  PERMISSIONS.ADMIN_DASHBOARD_READ,
  PERMISSIONS.PENTEST_DASHBOARD_READ,
  PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
  PERMISSIONS.DEVOPS_DASHBOARD_READ,
  PERMISSIONS.QA_DASHBOARD_READ,
  PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
];

export const protectedRouteConfig = [
  {
    path: "/admin",
    element: AdminDashboard,
    permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ],
    roles: [ROLES.ADMIN],
  },
  {
    path: "/admin/users",
    element: AdminUsers,
    permissions: [PERMISSIONS.USERS_READ],
  },
  {
    path: "/security-manager",
    element: SecurityProjectManagerDashboard,
    permissions: [PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ],
    roles: [ROLES.SECURITY_PROJECT_MANAGER],
  },
  {
    path: "/pentester",
    element: PentesterDashboard,
    permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ],
    roles: [ROLES.PENTESTER],
  },
  {
    path: "/devops",
    element: DevOpsDashboard,
    permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ],
    roles: [ROLES.DEVOPS],
  },
  {
    path: "/representative",
    element: RepresentativeDashboard,
    permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ],
    roles: [ROLES.REPRESENTATIVE],
  },
  {
    path: "/quality-manager",
    element: QualityProjectManagerDashboard,
    permissions: [PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ],
    roles: [ROLES.QUALITY_PROJECT_MANAGER],
  },
  {
    path: "/qa",
    element: QualityAssuranceDashboard,
    permissions: [PERMISSIONS.QA_DASHBOARD_READ],
    roles: [ROLES.QA],
  },
  { path: "/projects", element: Projects, permissions: projectRoutePermissions },
  {
    path: "/projects/create",
    element: CreateProject,
    permissions: [PERMISSIONS.PROJECTS_CREATE],
  },
  { path: "/profile", element: Profile, permissions: [] },
  { path: "/settings", element: Settings, permissions: [] },
];
