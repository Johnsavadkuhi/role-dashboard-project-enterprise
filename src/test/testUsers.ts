import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";

export const adminAuthState = {
  isAuthenticated: true,
  user: {
    id: "admin-test",
    name: "Admin Test",
    firstName: "Admin",
    lastName: "Test",
    username: "admin.test",
    roles: [ROLES.ADMIN],
    permissions: [PERMISSIONS.ADMIN_ALL],
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
    permissions: [
      PERMISSIONS.QA_DASHBOARD_READ,
      PERMISSIONS.QA_PROJECT_READ,
      PERMISSIONS.QA_TEST_CASES_READ,
      PERMISSIONS.QA_TEST_CASES_CREATE,
      PERMISSIONS.QA_TEST_CASES_UPDATE,
      PERMISSIONS.VULNERABILITIES_READ,
    ],
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
    permissions: [
      PERMISSIONS.SECURITY_MANAGER_DASHBOARD_READ,
      PERMISSIONS.SECURITY_PROJECTS_READ,
      PERMISSIONS.SECURITY_PROJECTS_ASSIGN,
      PERMISSIONS.SECURITY_PROJECTS_ASSIGN_SELF,
      PERMISSIONS.SECURITY_FINDINGS_REVIEW,
      PERMISSIONS.SECURITY_FINDINGS_APPROVE,
      PERMISSIONS.SECURITY_FINDINGS_REJECT,
      PERMISSIONS.SECURITY_REPORTS_CREATE,
      PERMISSIONS.SECURITY_REPORTS_SUBMIT_FOR_APPROVAL,
    ],
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
    permissions: [
      PERMISSIONS.QUALITY_MANAGER_DASHBOARD_READ,
      PERMISSIONS.QUALITY_PROJECTS_READ,
      PERMISSIONS.QUALITY_PROJECTS_ASSIGN,
      PERMISSIONS.QUALITY_PROJECTS_ASSIGN_SELF,
      PERMISSIONS.QUALITY_RESULTS_REVIEW,
      PERMISSIONS.QUALITY_RESULTS_APPROVE,
      PERMISSIONS.QUALITY_RESULTS_REJECT,
      PERMISSIONS.QUALITY_REPORTS_CREATE,
      PERMISSIONS.QUALITY_REPORTS_SUBMIT_FOR_APPROVAL,
    ],
  },
};
