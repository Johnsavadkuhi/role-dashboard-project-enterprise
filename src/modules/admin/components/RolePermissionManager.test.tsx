import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import { http, HttpResponse } from "msw";
import RolePermissionManager from "@/modules/admin/components/RolePermissionManager";
import { mockUsers } from "@/mocks/data";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { adminAuthState } from "@/test/testUsers";
import { PERMISSIONS } from "@/constants/permissions";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

describe("RolePermissionManager", () => {
  it("renders users and saves changed permissions", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Toaster />
        <RolePermissionManager users={mockUsers} />
      </>,
      { preloadedState: { auth: adminAuthState } }
    );
    expect((await screen.findAllByText("Admin User")).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Save Access" }));
    expect(await screen.findByText("User access updated")).toBeInTheDocument();
  });

  it("sends selected roles, permissions, and status to the backend", async () => {
    let requestBody: any;
    server.use(
      http.put(`${apiUrl}/users/:id`, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: {
            ...mockUsers[0],
            ...requestBody,
          },
        });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Toaster />
        <RolePermissionManager users={mockUsers} />
      </>,
      { preloadedState: { auth: adminAuthState } }
    );

    expect((await screen.findAllByText("Admin User")).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Save Access" }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({
        roles: ["admin"],
        permissions: [PERMISSIONS.ADMIN_ALL],
        status: "Active",
      });
    });
  });

  it("shows backend errors when saving access fails", async () => {
    server.use(
      http.put(`${apiUrl}/users/:id`, () =>
        HttpResponse.json({ message: "Cannot update this user" }, { status: 422 })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Toaster />
        <RolePermissionManager users={mockUsers} />
      </>,
      { preloadedState: { auth: adminAuthState } }
    );

    expect((await screen.findAllByText("Admin User")).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Save Access" }));
    expect(await screen.findByText("Cannot update this user")).toBeInTheDocument();
  });
});
