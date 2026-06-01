import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
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
];

export function resetMockUsers() {
  mockUsers = mockUsers.slice(0, 3);
}

export function upsertMockUser(user: User) {
  const index = mockUsers.findIndex((item) => item.id === user.id);
  if (index >= 0) mockUsers[index] = user;
  else mockUsers.push(user);
  return user;
}
