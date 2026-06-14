import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { http, HttpResponse } from "msw";
import Login from "@/pages/public/Login";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test/renderWithProviders";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

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

  it("logs in with nested backend response and redirects", async () => {
    server.use(
      http.post(`${apiUrl}/auth/login`, () =>
        HttpResponse.json({
          success: true,
          data: {
            user: {
              id: "6a1fbecbd979b652b524c0a2",
              firstName: "John",
              lastName: "savadkuhi",
              username: "msavad",
              roles: ["pentester"],
              permissions: ["pentest.dashboard.read"],
              sessionVersion: 0,
              projectIds: [],
            },
            csrfToken: "CO2um8UXxNfigSPoPsK030ZQXodZvfqUCwyGcocUUMM",
          },
        })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pentester" element={<div>Pentester Page</div>} />
      </Routes>,
      { route: "/login" }
    );

    await user.type(screen.getByLabelText("Username"), "msavad");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Pentester Page")).toBeInTheDocument();
  });

  it("keeps omitted permissions empty and redirects to profile", async () => {
    server.use(
      http.post(`${apiUrl}/auth/login`, () =>
        HttpResponse.json({
          success: true,
          data: {
            user: {
              id: "6a1fbecbd979b652b524c0a2",
              firstName: "John",
              lastName: "savadkuhi",
              username: "admin",
              roles: ["admin"],
              sessionVersion: 0,
              projectIds: [],
            },
            csrfToken: "CO2um8UXxNfigSPoPsK030ZQXodZvfqUCwyGcocUUMM",
          },
        })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<div>Admin Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
      </Routes>,
      { route: "/login" }
    );

    await user.type(screen.getByLabelText("Username"), "admin");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Profile Page")).toBeInTheDocument();
  });
});
