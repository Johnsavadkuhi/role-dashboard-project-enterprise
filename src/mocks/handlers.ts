import { http, HttpResponse } from "msw";
import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
import {
  markAllMockNotificationsRead,
  markMockNotificationRead,
  mockNotifications,
  mockUsers,
  upsertMockUser,
} from "@/mocks/data";
import type { User } from "@/types";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const endpoint = (path: string) => `${apiUrl}${path}`;

export const handlers = [
  http.post(endpoint("/auth/login"), async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password || body.password.length < 6) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = mockUsers.find((item) => item.email === body.email) ||
      mockUsers[0] || {
        id: "1",
        name: "Admin User",
        email: body.email,
        roles: [ROLES.ADMIN],
        permissions: getPermissionsFromRoles([ROLES.ADMIN]),
      };

    return HttpResponse.json({ user });
  }),

  http.post(endpoint("/auth/register"), async ({ request }) => {
    const body = (await request.json()) as Partial<User> & { password?: string };
    const roles = body.roles?.length ? body.roles : [ROLES.REPRESENTATIVE];
    const permissions = body.permissions?.length
      ? body.permissions
      : getPermissionsFromRoles(roles);
    const user: User = {
      id: crypto.randomUUID(),
      name: body.name || "New User",
      email: body.email || "new@example.com",
      roles,
      permissions,
      avatarUrl: body.avatarUrl,
    };
    upsertMockUser(user);
    return HttpResponse.json({ user }, { status: 201 });
  }),

  http.post(endpoint("/auth/refresh-token"), async () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(endpoint("/auth/me"), () => {
    return HttpResponse.json(mockUsers[0]);
  }),

  http.post(endpoint("/auth/logout"), () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(endpoint("/users"), () => HttpResponse.json(mockUsers)),

  http.put(endpoint("/users/:id"), async ({ params, request }) => {
    const body = (await request.json()) as Partial<User>;
    const existing = mockUsers.find((item) => item.id === params.id);
    if (!existing)
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    const roles = body.roles || existing.roles;
    const permissions = body.permissions || getPermissionsFromRoles(roles);
    const updated = upsertMockUser({ ...existing, ...body, roles, permissions });
    return HttpResponse.json(updated);
  }),

  http.delete(endpoint("/users/:id"), ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id });
  }),

  http.post(endpoint("/uploads"), async () => {
    return HttpResponse.json({
      url: "https://placehold.co/256x256?text=Avatar",
      fileId: crypto.randomUUID(),
    });
  }),

  http.get(endpoint("/notifications"), () =>
    HttpResponse.json({ items: mockNotifications })
  ),

  http.patch(endpoint("/notifications/:id/read"), ({ params }) => {
    const notification = markMockNotificationRead(String(params.id));
    if (!notification)
      return HttpResponse.json({ message: "Notification not found" }, { status: 404 });
    return HttpResponse.json(notification);
  }),

  http.patch(endpoint("/notifications/read-all"), () => {
    markAllMockNotificationsRead();
    return HttpResponse.json({ success: true });
  }),

  http.delete(endpoint("/notifications/:id"), () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(endpoint("/pentest/vulnerabilities"), () =>
    HttpResponse.json([{ id: "v1", title: "Stored XSS", severity: "high" }])
  ),
  http.get(endpoint("/devops/deployments"), () =>
    HttpResponse.json([{ id: "d1", service: "api", status: "success" }])
  ),
  http.get(endpoint("/tickets"), () =>
    HttpResponse.json([{ id: "t1", title: "Customer onboarding", status: "open" }])
  ),
  http.get(endpoint("/qa/test-cases"), () =>
    HttpResponse.json([
      { id: "q1", title: "Login validates required fields", status: "passed" },
    ])
  ),
];
