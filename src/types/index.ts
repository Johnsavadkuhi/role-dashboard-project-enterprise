import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type User = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  avatarUrl?: string;
};

export type AuthResponse = {
  user: User;
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
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  avatarUrl?: string;
};
