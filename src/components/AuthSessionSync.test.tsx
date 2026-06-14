import { describe, expect, it } from "vitest";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import AuthSessionSync from "@/components/AuthSessionSync";
import { PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test/renderWithProviders";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

describe("AuthSessionSync", () => {
  it("accepts /auth/me data-as-user responses and refreshes restored permissions", async () => {
    server.use(
      http.get(`${apiUrl}/auth/me`, () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "pentester-session",
            name: "Pentester Session",
            username: "pentester.session",
            roles: [ROLES.PENTESTER],
            permissions: [
              PERMISSIONS.PENTEST_DASHBOARD_READ,
              PERMISSIONS.PENTESTER_PROJECT_READ,
            ],
          },
        })
      )
    );

    const { store } = renderWithProviders(<AuthSessionSync />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            id: "pentester-session",
            name: "Pentester Session",
            username: "pentester.session",
            roles: [ROLES.PENTESTER],
            permissions: [PERMISSIONS.PENTEST_DASHBOARD_READ],
          },
        },
      },
    });

    await waitFor(() => {
      expect(store.getState().auth.user?.permissions).toContain(
        PERMISSIONS.PENTESTER_PROJECT_READ
      );
    });
  });
});
