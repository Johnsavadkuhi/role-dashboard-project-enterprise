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

export const securityProjectManagerAuthState = {
  token: "test-token",
  refreshToken: "test-refresh-token",
  isAuthenticated: true,
  user: {
    id: "security-manager-test",
    name: "Security Manager Test",
    email: "security.manager@test.local",
    roles: [ROLES.SECURITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.SECURITY_PROJECT_MANAGER]),
  },
};

export const qualityProjectManagerAuthState = {
  token: "test-token",
  refreshToken: "test-refresh-token",
  isAuthenticated: true,
  user: {
    id: "quality-manager-test",
    name: "Quality Manager Test",
    email: "quality.manager@test.local",
    roles: [ROLES.QUALITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.QUALITY_PROJECT_MANAGER]),
  },
};
