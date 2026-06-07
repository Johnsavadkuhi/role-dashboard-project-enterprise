import { PERMISSIONS } from "@/constants/permissions";
import type { TranslationKey } from "@/i18n";

const projectRoutePermissions = [
  PERMISSIONS.ADMIN_DASHBOARD_READ,
  PERMISSIONS.PENTEST_DASHBOARD_READ,
  PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
  PERMISSIONS.DEVOPS_DASHBOARD_READ,
  PERMISSIONS.QA_DASHBOARD_READ,
  PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
];

type SidebarItem = {
  title: string;
  titleKey: TranslationKey;
  path: string;
  permissions: string[];
  section: string;
  sectionKey: TranslationKey;
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Admin Dashboard",
    titleKey: "sidebar.adminDashboard",
    path: "/admin",
    permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "User Management",
    titleKey: "sidebar.userManagement",
    path: "/admin/users",
    permissions: [PERMISSIONS.USERS_READ],
    section: "Admin",
    sectionKey: "sidebar.admin",
  },
  {
    title: "Security Manager Dashboard",
    titleKey: "sidebar.securityManagerDashboard",
    path: "/security-manager",
    permissions: [PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "Pentester Dashboard",
    titleKey: "sidebar.pentesterDashboard",
    path: "/pentester",
    permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "DevOps Dashboard",
    titleKey: "sidebar.devopsDashboard",
    path: "/devops",
    permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "Representative Dashboard",
    titleKey: "sidebar.representativeDashboard",
    path: "/representative",
    permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "Quality Manager Dashboard",
    titleKey: "sidebar.qualityManagerDashboard",
    path: "/quality-manager",
    permissions: [PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "QA Dashboard",
    titleKey: "sidebar.qaDashboard",
    path: "/qa",
    permissions: [PERMISSIONS.QA_DASHBOARD_READ],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    title: "Projects",
    titleKey: "sidebar.projects",
    path: "/projects",
    permissions: projectRoutePermissions,
    section: "Workspace",
    sectionKey: "sidebar.workspace",
  },
  {
    title: "Profile",
    titleKey: "sidebar.profile",
    path: "/profile",
    permissions: [],
    section: "Account",
    sectionKey: "sidebar.account",
  },
  {
    title: "Settings",
    titleKey: "sidebar.settings",
    path: "/settings",
    permissions: [],
    section: "Account",
    sectionKey: "sidebar.account",
  },
];
