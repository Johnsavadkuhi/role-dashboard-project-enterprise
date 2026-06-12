import type { Permission, Role, RoleCatalogItem } from "@/types";
import { PERMISSIONS } from "@/constants/permissions";

export function getPermissionsFromRoleCatalog(
  roles: Role[] = [],
  roleCatalog: RoleCatalogItem[] = []
) {
  return Array.from(
    new Set(
      roles.flatMap(
        (role) => roleCatalog.find((item) => item.key === role)?.permissions || []
      )
    )
  );
}

export function getEffectivePermissions(
  roles: Role[] = [],
  permissions?: Permission[],
  roleCatalog: RoleCatalogItem[] = []
) {
  if (Array.isArray(permissions) && permissions.length > 0) {
    return permissions;
  }

  return getPermissionsFromRoleCatalog(roles, roleCatalog);
}

export function hasPermissionGrant(
  permissions: Permission[] = [],
  permission: Permission
) {
  return permissions.includes(PERMISSIONS.ADMIN_ALL) || permissions.includes(permission);
}

export function hasAnyPermissionGrant(
  permissions: Permission[] = [],
  requiredPermissions: Permission[] = []
) {
  return (
    requiredPermissions.length === 0 ||
    permissions.includes(PERMISSIONS.ADMIN_ALL) ||
    requiredPermissions.some((permission) => permissions.includes(permission))
  );
}

export function hasAllPermissionGrants(
  permissions: Permission[] = [],
  requiredPermissions: Permission[] = []
) {
  return (
    permissions.includes(PERMISSIONS.ADMIN_ALL) ||
    requiredPermissions.every((permission) => permissions.includes(permission))
  );
}
