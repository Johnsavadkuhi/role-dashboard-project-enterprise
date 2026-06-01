import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
import type { AppNotification } from "@/types/notification";
import type { User } from "@/types";

export let mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    roles: [ROLES.ADMIN],
    permissions: getPermissionsFromRoles([ROLES.ADMIN]),
    avatarUrl: "https://placehold.co/128x128?text=AU",
  },
  {
    id: "2",
    name: "Pentester QA",
    email: "pentest.qa@example.com",
    roles: [ROLES.PENTESTER, ROLES.QA],
    permissions: getPermissionsFromRoles([ROLES.PENTESTER, ROLES.QA]),
    avatarUrl: "https://placehold.co/128x128?text=PQ",
  },
  {
    id: "3",
    name: "DevOps User",
    email: "devops@example.com",
    roles: [ROLES.DEVOPS],
    permissions: getPermissionsFromRoles([ROLES.DEVOPS]),
    avatarUrl: "https://placehold.co/128x128?text=DU",
  },
  {
    id: "4",
    name: "Security Project Manager",
    email: "security.pm@example.com",
    roles: [ROLES.SECURITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.SECURITY_PROJECT_MANAGER]),
    avatarUrl: "https://placehold.co/128x128?text=SPM",
  },
  {
    id: "5",
    name: "Quality Project Manager",
    email: "quality.pm@example.com",
    roles: [ROLES.QUALITY_PROJECT_MANAGER],
    permissions: getPermissionsFromRoles([ROLES.QUALITY_PROJECT_MANAGER]),
    avatarUrl: "https://placehold.co/128x128?text=QPM",
  },
];

export function resetMockUsers() {
  mockUsers = mockUsers.slice(0, 5);
}

export function upsertMockUser(user: User) {
  const index = mockUsers.findIndex((item) => item.id === user.id);
  if (index >= 0) mockUsers[index] = user;
  else mockUsers.push(user);
  return user;
}

export let mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "project.assigned",
    title: "Security project assigned",
    message: "A new security assessment has been assigned to your team.",
    priority: "high",
    isRead: false,
    createdAt: new Date().toISOString(),
    entity: { id: "p1", type: "project", label: "Security Assessment" },
    actionUrl: "/security-manager",
  },
  {
    id: "n2",
    type: "qa.result.submitted",
    title: "QA result submitted",
    message: "A QA member submitted test results for review.",
    priority: "medium",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    entity: { id: "q1", type: "qa_result", label: "Regression Cycle" },
    actionUrl: "/quality-manager",
  },
];

export function markMockNotificationRead(id: string) {
  const notification = mockNotifications.find((item) => item.id === id);
  if (notification) notification.isRead = true;
  return notification;
}

export function markAllMockNotificationsRead() {
  mockNotifications = mockNotifications.map((item) => ({ ...item, isRead: true }));
}
