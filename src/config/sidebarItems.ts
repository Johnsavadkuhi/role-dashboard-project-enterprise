import { PERMISSIONS } from "@/constants/permissions";

const projectRoutePermissions = [
  PERMISSIONS.ADMIN_DASHBOARD_READ,
  PERMISSIONS.PENTEST_DASHBOARD_READ,
  PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
  PERMISSIONS.DEVOPS_DASHBOARD_READ,
  PERMISSIONS.QA_DASHBOARD_READ,
  PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
];

export const sidebarItems = [
  {
    title: "Admin Dashboard",
    path: "/admin",
    permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "User Management",
    path: "/admin/users",
    permissions: [PERMISSIONS.USERS_READ],
    section: "Admin",
  },
  {
    title: "Security Manager Dashboard",
    path: "/security-manager",
    permissions: [PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "Pentester Dashboard",
    path: "/pentester",
    permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "DevOps Dashboard",
    path: "/devops",
    permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "Representative Dashboard",
    path: "/representative",
    permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "Quality Manager Dashboard",
    path: "/quality-manager",
    permissions: [PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "QA Dashboard",
    path: "/qa",
    permissions: [PERMISSIONS.QA_DASHBOARD_READ],
    section: "Dashboards",
  },
  {
    title: "Projects",
    path: "/projects",
    permissions: projectRoutePermissions,
    section: "Workspace",
  },
  { title: "Profile", path: "/profile", permissions: [], section: "Account" },
  { title: "Settings", path: "/settings", permissions: [], section: "Account" },
];
