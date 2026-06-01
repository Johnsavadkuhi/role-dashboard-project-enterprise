import { useAuth } from "@/hooks/useAuth";

export function usePermission() {
  const { permissions, roles } = useAuth();

  const hasPermission = (permission) => permissions.includes(permission);

  const hasAnyPermission = (requiredPermissions = []) =>
    requiredPermissions.length === 0 || requiredPermissions.some((permission) => permissions.includes(permission));

  const hasAllPermissions = (requiredPermissions = []) =>
    requiredPermissions.every((permission) => permissions.includes(permission));

  const hasRole = (role) => roles.includes(role);

  return { permissions, roles, hasPermission, hasAnyPermission, hasAllPermissions, hasRole };
}
