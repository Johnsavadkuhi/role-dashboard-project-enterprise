import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import Signup from "@/pages/public/Signup";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("Signup page", () => {
  it("requires an avatar image", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Name"), "New User");
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByLabelText("Representative"));
    await user.click(screen.getByRole("button", { name: "Signup" }));
    expect(await screen.findByText("Avatar image is required")).toBeInTheDocument();
  });

  it("uploads avatar, registers, and redirects", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/representative" element={<div>Representative Page</div>} />
      </Routes>,
      { route: "/signup" }
    );

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    await user.type(screen.getByLabelText("Name"), "New User");
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByLabelText("Representative"));
    await user.upload(screen.getByLabelText("Avatar Image"), file);
    await user.click(screen.getByRole("button", { name: "Signup" }));
    expect(await screen.findByText("Representative Page")).toBeInTheDocument();
  });
});
