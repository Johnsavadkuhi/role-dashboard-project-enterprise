import { useAuth } from "@/hooks/useAuth";
import {
  hasAllPermissionGrants,
  hasAnyPermissionGrant,
  hasPermissionGrant,
} from "@/utils/permissionGrants";

export function usePermission() {
  const { permissions, roles } = useAuth();

  const hasPermission = (permission) => hasPermissionGrant(permissions, permission);

  const hasAnyPermission = (requiredPermissions = []) =>
    hasAnyPermissionGrant(permissions, requiredPermissions);

  const hasAllPermissions = (requiredPermissions = []) =>
    hasAllPermissionGrants(permissions, requiredPermissions);

  const hasRole = (role) => roles.includes(role);

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
