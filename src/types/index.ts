import { ROLES } from "@/constants/roles";

export type {
  CertificateAuthority,
  CreateProjectRequest,
  CreateProjectResponse,
  ProjectPlatform,
  ProjectType,
} from "@/types/api/projects";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = string;
export type UserStatus = "Active" | "Inactive";
export type RoleCatalogItem = {
  id: string;
  key: Role;
  name: string;
  permissions: string[];
  isSystem: boolean;
};

export type RolesAndPermissions = {
  roles: RoleCatalogItem[];
  permissions: string[];
};

export type User = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: Role[];
  permissions: Permission[];
  status?: UserStatus;
  avatarUrl?: string;
};

export type AuthResponse = {
  user: User;
  csrfToken?: string;
};

export type UploadResponse = {
  url: string;
  fileId: string;
};

export type ApiError = {
  status?: number | string;
  data?: { message?: string };
};

export type UserFormPayload = {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: Role[];
  permissions: Permission[];
  status?: UserStatus;
  avatarUrl?: string;
};

export type ProjectStatus = "planning" | "active" | "blocked" | "review" | "completed";
export type ProjectPriority = "low" | "medium" | "high" | "critical";
export type ProjectDiscipline = "security" | "quality" | "devops" | "platform";
export type ProjectAssignmentRole = "pentester" | "qa";
export type ProjectAssignmentStatus =
  | "assigned"
  | "in_progress"
  | "submitted"
  | "changes_requested"
  | "accepted";

export type Project = {
  id: string;
  name: string;
  client: string;
  discipline: ProjectDiscipline;
  status: ProjectStatus;
  priority: ProjectPriority;
  owner: string;
  assignee: string;
  dueDate: string;
  progress: number;
  riskScore: number;
  vulnerabilities: number;
  testCoverage: number;
  openBugs: number;
  environment: string;
  repository: string;
  pipeline: string;
  lastActivity: string;
};

export type ProjectAssignment = Project & {
  assignmentId: string;
  assignmentRole: ProjectAssignmentRole;
  assignmentStatus: ProjectAssignmentStatus;
  assignedAt: string;
  assignmentDueDate: string;
  reviewer: string;
  scope: string;
  phase: string;
  submittedItems: number;
};
