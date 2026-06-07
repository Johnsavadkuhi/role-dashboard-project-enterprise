import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";

export const adminAuthState = {
  isAuthenticated: true,
  user: {
    id: "admin-test",
    name: "Admin Test",
    firstName: "Admin",
    lastName: "Test",
    username: "admin.test",
    roles: [ROLES.ADMIN],
    permissions: getPermissionsFromRoles([ROLES.ADMIN]),
  },
};

export const qaAuthState = {
  isAuthenticated: true,
  user: {
    id: "qa-test",
    name: "QA Test",
    firstName: "QA",
    lastName: "Test",
    username: "qa.test",
    roles: [ROLES.QA],
    permissions: getPermissionsFromRoles([ROLES.QA]),
  },
};

export const securityProjectManagerAuthState = {
  isAuthenticated: true,
  user: {
    id: "security-manager-test",
    name: "Security Manager Test",
    firstName: "Security Manager",
    lastName: "Test",
    username: "security.manager.test",
    roles: [ROLES.SECURITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.SECURITY_PROJECT_MANAGER]),
  },
};

export const qualityProjectManagerAuthState = {
  isAuthenticated: true,
  user: {
    id: "quality-manager-test",
    name: "Quality Manager Test",
    firstName: "Quality Manager",
    lastName: "Test",
    username: "quality.manager.test",
    roles: [ROLES.QUALITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.QUALITY_PROJECT_MANAGER]),
  },
};
