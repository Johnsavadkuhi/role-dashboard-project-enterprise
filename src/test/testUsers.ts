import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";

export const adminAuthState = {
  token: "test-token",
  refreshToken: "test-refresh-token",
  isAuthenticated: true,
  user: {
    id: "admin-test",
    name: "Admin Test",
    email: "admin@test.local",
    roles: [ROLES.ADMIN],
    permissions: getPermissionsFromRoles([ROLES.ADMIN]),
  },
};

export const qaAuthState = {
  token: "test-token",
  refreshToken: "test-refresh-token",
  isAuthenticated: true,
  user: {
    id: "qa-test",
    name: "QA Test",
    email: "qa@test.local",
    roles: [ROLES.QA],
    permissions: getPermissionsFromRoles([ROLES.QA]),
  },
};
