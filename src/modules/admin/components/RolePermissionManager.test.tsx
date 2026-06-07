import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import RolePermissionManager from "@/modules/admin/components/RolePermissionManager";
import { mockUsers } from "@/mocks/data";
import { renderWithProviders } from "@/test/renderWithProviders";
import { adminAuthState } from "@/test/testUsers";

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
    expect(screen.getAllByText("Admin User").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Save Access" }));
    expect(await screen.findByText("User access updated")).toBeInTheDocument();
  });
});
