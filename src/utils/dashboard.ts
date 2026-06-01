import { PERMISSIONS } from "@/constants/permissions";

export function getDashboardPathByPermissions(permissions = []) {
  if (permissions.includes(PERMISSIONS.ADMIN_DASHBOARD_READ)) return "/admin";
  if (permissions.includes(PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ)) return "/security-manager";
  if (permissions.includes(PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ)) return "/quality-manager";
  if (permissions.includes(PERMISSIONS.PENTEST_DASHBOARD_READ)) return "/pentester";
  if (permissions.includes(PERMISSIONS.DEVOPS_DASHBOARD_READ)) return "/devops";
  if (permissions.includes(PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ)) return "/representative";
  if (permissions.includes(PERMISSIONS.QA_DASHBOARD_READ)) return "/qa";
  return "/profile";
}
