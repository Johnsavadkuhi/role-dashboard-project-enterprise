import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";
import { hasPermissionGrant } from "@/utils/permissionGrants";

export function getDashboardPathByPermissions(permissions = []) {
  if (hasPermissionGrant(permissions, PERMISSIONS.ADMIN_DASHBOARD_READ)) return "/admin";
  if (hasPermissionGrant(permissions, PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ))
    return "/security-manager";
  if (hasPermissionGrant(permissions, PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ))
    return "/quality-manager";
  if (hasPermissionGrant(permissions, PERMISSIONS.PENTEST_DASHBOARD_READ))
    return "/pentester";
  if (hasPermissionGrant(permissions, PERMISSIONS.DEVOPS_DASHBOARD_READ))
    return "/devops";
  if (hasPermissionGrant(permissions, PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ))
    return "/representative";
  if (hasPermissionGrant(permissions, PERMISSIONS.QA_DASHBOARD_READ)) return "/qa";
  return "/profile";
}

export function getDashboardPathByRoles(roles = [], permissions = []) {
  if (
    roles.includes(ROLES.ADMIN) &&
    hasPermissionGrant(permissions, PERMISSIONS.ADMIN_DASHBOARD_READ)
  ) {
    return "/admin";
  }
  if (
    roles.includes(ROLES.SECURITY_PROJECT_MANAGER) &&
    hasPermissionGrant(permissions, PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ)
  ) {
    return "/security-manager";
  }
  if (
    roles.includes(ROLES.QUALITY_PROJECT_MANAGER) &&
    hasPermissionGrant(permissions, PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ)
  ) {
    return "/quality-manager";
  }
  if (
    roles.includes(ROLES.PENTESTER) &&
    hasPermissionGrant(permissions, PERMISSIONS.PENTEST_DASHBOARD_READ)
  ) {
    return "/pentester";
  }
  if (
    roles.includes(ROLES.DEVOPS) &&
    hasPermissionGrant(permissions, PERMISSIONS.DEVOPS_DASHBOARD_READ)
  ) {
    return "/devops";
  }
  if (
    roles.includes(ROLES.REPRESENTATIVE) &&
    hasPermissionGrant(permissions, PERMISSIONS.REPRESENTATIVE_DASHBOARD_READ)
  ) {
    return "/representative";
  }
  if (
    roles.includes(ROLES.QA) &&
    hasPermissionGrant(permissions, PERMISSIONS.QA_DASHBOARD_READ)
  ) {
    return "/qa";
  }
  return getDashboardPathByPermissions(permissions);
}
