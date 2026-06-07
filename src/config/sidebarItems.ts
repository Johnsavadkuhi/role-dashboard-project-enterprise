import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";
import type { Role } from "@/types";
import type { TranslationKey } from "@/i18n";

const projectRoutePermissions = [
  PERMISSIONS.ADMIN_DASHBOARD_READ,
  PERMISSIONS.PENTEST_DASHBOARD_READ,
  PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
  PERMISSIONS.DEVOPS_DASHBOARD_READ,
  PERMISSIONS.QA_DASHBOARD_READ,
  PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
];

export type SidebarItem = {
  icon: string;
  title: string;
  titleKey: TranslationKey;
  path: string;
  permissions: string[];
  roles?: Role[];
  section: string;
  sectionKey: TranslationKey;
};

export const sidebarItems: SidebarItem[] = [
  {
    icon: "layout",
    title: "Admin Dashboard",
    titleKey: "sidebar.adminDashboard",
    path: "/admin",
    permissions: [PERMISSIONS.ADMIN_DASHBOARD_READ],
    roles: [ROLES.ADMIN],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "users",
    title: "User Management",
    titleKey: "sidebar.userManagement",
    path: "/admin/users",
    permissions: [PERMISSIONS.USERS_READ],
    section: "Admin",
    sectionKey: "sidebar.admin",
  },
  {
    icon: "shield",
    title: "Security Manager Dashboard",
    titleKey: "sidebar.securityManagerDashboard",
    path: "/security-manager",
    permissions: [PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ],
    roles: [ROLES.SECURITY_PROJECT_MANAGER],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "target",
    title: "Pentester Dashboard",
    titleKey: "sidebar.pentesterDashboard",
    path: "/pentester",
    permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ],
    roles: [ROLES.PENTESTER],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "server",
    title: "DevOps Dashboard",
    titleKey: "sidebar.devopsDashboard",
    path: "/devops",
    permissions: [PERMISSIONS.DEVOPS_DASHBOARD_READ],
    roles: [ROLES.DEVOPS],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "briefcase",
    title: "Representative Dashboard",
    titleKey: "sidebar.representativeDashboard",
    path: "/representative",
    permissions: [PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ],
    roles: [ROLES.REPRESENTATIVE],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "clipboard",
    title: "Quality Manager Dashboard",
    titleKey: "sidebar.qualityManagerDashboard",
    path: "/quality-manager",
    permissions: [PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ],
    roles: [ROLES.QUALITY_PROJECT_MANAGER],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "check",
    title: "QA Dashboard",
    titleKey: "sidebar.qaDashboard",
    path: "/qa",
    permissions: [PERMISSIONS.QA_DASHBOARD_READ],
    roles: [ROLES.QA],
    section: "Dashboards",
    sectionKey: "sidebar.dashboards",
  },
  {
    icon: "folder",
    title: "Projects",
    titleKey: "sidebar.projects",
    path: "/projects",
    permissions: projectRoutePermissions,
    section: "Workspace",
    sectionKey: "sidebar.workspace",
  },
  {
    icon: "plus",
    title: "Create Project",
    titleKey: "sidebar.createProject",
    path: "/projects/create",
    permissions: [PERMISSIONS.PROJECTS_CREATE],
    section: "Workspace",
    sectionKey: "sidebar.workspace",
  },
  {
    icon: "user",
    title: "Profile",
    titleKey: "sidebar.profile",
    path: "/profile",
    permissions: [],
    section: "Account",
    sectionKey: "sidebar.account",
  },
  {
    icon: "settings",
    title: "Settings",
    titleKey: "sidebar.settings",
    path: "/settings",
    permissions: [],
    section: "Account",
    sectionKey: "sidebar.account",
  },
];
