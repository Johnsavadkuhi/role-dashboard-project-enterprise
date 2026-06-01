import { PERMISSIONS } from "@/constants/permissions";

export const sidebarItems = [
  { title: "Admin Dashboard", path: "/admin", permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ] },
  { title: "Security Manager Dashboard", path: "/security-manager", permissions: [PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ] },
  { title: "Pentester Dashboard", path: "/pentester", permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ] },
  { title: "DevOps Dashboard", path: "/devops", permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ] },
  { title: "Representative Dashboard", path: "/representative", permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ] },
  { title: "Quality Manager Dashboard", path: "/quality-manager", permissions: [PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ] },
  { title: "QA Dashboard", path: "/qa", permissions: [PERMISSIONS.QA_DASHBOARD_READ] },
  { title: "Profile", path: "/profile", permissions: [] },
  { title: "Settings", path: "/settings", permissions: [] },
];
