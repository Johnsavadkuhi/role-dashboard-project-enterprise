import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import CreateProject from "@/pages/shared/CreateProject";
import { ROLES } from "@/constants/roles";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { adminAuthState } from "@/test/testUsers";
import type { CreateProjectRequest } from "@/types/api/projects";

describe("CreateProject", () => {
  it("selects certification authorities without file uploads", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProject />, {
      route: "/projects/create",
      preloadedState: { auth: adminAuthState },
    });

    await user.click(screen.getByRole("button", { name: /^Certificate issuance/i }));
    expect(screen.getByRole("button", { name: /Bank/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: /^AFTA/i }));
    expect(screen.getByRole("button", { name: /^AFTA/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(
      screen.getByRole("button", { name: /National Standards Organization/i })
    );
    expect(
      screen.getByRole("button", { name: /National Standards Organization/i })
    ).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector('input[type="file"]')).not.toBeInTheDocument();
  });

  it("switches eligible project leadership with project type", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProject />, {
      route: "/projects/create",
      preloadedState: { auth: adminAuthState },
    });

    expect(await screen.findByText("Security Project Manager")).toBeInTheDocument();
    expect(screen.getByText("Pentester QA")).toBeInTheDocument();
    expect(screen.queryByText("Quality Project Manager")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Quality assurance/i }));
    expect(await screen.findByText("Quality Project Manager")).toBeInTheDocument();
    expect(screen.getByText("Pentester QA")).toBeInTheDocument();
    expect(screen.queryByText("Security Project Manager")).not.toBeInTheDocument();
  });

  it("renders users without a name using their available identity fields", async () => {
    server.use(
      http.get("http://localhost:4000/api/users", () =>
        HttpResponse.json([
          {
            id: "security-user-without-name",
            firstName: "Sara",
            lastName: "Ahmadi",
            username: "sara.ahmadi",
            roles: [ROLES.PENTESTER],
            permissions: [],
            status: "Active",
          },
        ])
      )
    );

    renderWithProviders(<CreateProject />, {
      route: "/projects/create",
      preloadedState: { auth: adminAuthState },
    });

    expect(await screen.findByText("Sara Ahmadi")).toBeInTheDocument();
    expect(screen.getByText("SA")).toBeInTheDocument();
  });

  it("maps form state to the project API contract", async () => {
    const user = userEvent.setup();
    let requestBody: CreateProjectRequest | undefined;

    server.use(
      http.post("http://localhost:4000/api/projects", async ({ request }) => {
        requestBody = (await request.json()) as CreateProjectRequest;
        return HttpResponse.json({
          project: {
            ...requestBody,
            id: "project-contract-test",
            createdAt: "2026-06-14T00:00:00.000Z",
          },
        });
      })
    );

    renderWithProviders(<CreateProject />, {
      route: "/projects/create",
      preloadedState: { auth: adminAuthState },
    });

    await user.type(screen.getByLabelText("Project name"), "Contract Project");
    await user.type(screen.getByLabelText("Project version"), "1.0.0");
    await user.type(screen.getByLabelText("Letter number"), "LTR-100");
    await user.click(
      await screen.findByRole("button", { name: /Security Project Manager/ })
    );
    await user.click(screen.getByRole("button", { name: /DevOps User/ }));
    await user.type(screen.getByLabelText("Test end date"), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /^Create project$/i }));

    await waitFor(() => expect(requestBody).toBeDefined());
    expect(requestBody?.projectName).toBe("Contract Project");
    expect(requestBody).not.toHaveProperty("name");
  });
});
