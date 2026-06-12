import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useGetRolesAndPermissionsQuery } from "@/services/usersApi";
import { getEffectivePermissions } from "@/utils/permissionGrants";

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const roles = auth.user?.roles || [];
  const hasPermissions = Boolean(auth.user?.permissions?.length);
  const { data: rolesAndPermissions } = useGetRolesAndPermissionsQuery(undefined, {
    skip: !auth.isAuthenticated || hasPermissions,
  });

  return {
    ...auth,
    roles,
    permissions: getEffectivePermissions(
      roles,
      auth.user?.permissions,
      rolesAndPermissions?.roles
    ),
  };
}
