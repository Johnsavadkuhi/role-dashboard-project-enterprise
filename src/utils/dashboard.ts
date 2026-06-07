import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";

export function getDashboardPathByPermissions(permissions = []) {
  if (permissions.includes(PERMISSIONS.ADMIN_DASHBOARD_READ)) return "/admin";
  if (permissions.includes(PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ))
    return "/security-manager";
  if (permissions.includes(PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ))
    return "/quality-manager";
  if (permissions.includes(PERMISSIONS.PENTEST_DASHBOARD_READ)) return "/pentester";
  if (permissions.includes(PERMISSIONS.DEVOPS_DASHBOARD_READ)) return "/devops";
  if (permissions.includes(PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ))
    return "/representative";
  if (permissions.includes(PERMISSIONS.QA_DASHBOARD_READ)) return "/qa";
  return "/profile";
}

export function getDashboardPathByRoles(roles = [], permissions = []) {
  if (
    roles.includes(ROLES.ADMIN) &&
    permissions.includes(PERMISSIONS.ADMIN_DASHBOARD_READ)
  ) {
    return "/admin";
  }
  if (
    roles.includes(ROLES.SECURITY_PROJECT_MANAGER) &&
    permissions.includes(PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ)
  ) {
    return "/security-manager";
  }
  if (
    roles.includes(ROLES.QUALITY_PROJECT_MANAGER) &&
    permissions.includes(PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ)
  ) {
    return "/quality-manager";
  }
  if (
    roles.includes(ROLES.PENTESTER) &&
    permissions.includes(PERMISSIONS.PENTEST_DASHBOARD_READ)
  ) {
    return "/pentester";
  }
  if (
    roles.includes(ROLES.DEVOPS) &&
    permissions.includes(PERMISSIONS.DEVOPS_DASHBOARD_READ)
  ) {
    return "/devops";
  }
  if (
    roles.includes(ROLES.REPRESENTATIVE) &&
    permissions.includes(PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ)
  ) {
    return "/representative";
  }
  if (roles.includes(ROLES.QA) && permissions.includes(PERMISSIONS.QA_DASHBOARD_READ)) {
    return "/qa";
  }
  return getDashboardPathByPermissions(permissions);
}
