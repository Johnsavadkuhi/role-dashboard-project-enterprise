import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import Login from "@/pages/public/Login";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("Login page", () => {
  it("shows validation errors for invalid values", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(
      await screen.findByText("Username must be at least 3 characters")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  it("logs in with mocked API and redirects", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>,
      { route: "/login" }
    );

    await user.type(screen.getByLabelText("Username"), "admin");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Admin Page")).toBeInTheDocument();
  });
});
