import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  login as loginRequest,
  validateToken,
} from "../api/auth";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/auth", () => ({
  login: vi.fn(),
  validateToken: vi.fn(),
}));

function AuthProbe({ signIn = false }) {
  const auth = useAuth();
  const { login } = auth;

  useEffect(() => {
    if (signIn) {
      login("test-user", "password123");
    }
  }, [login, signIn]);

  return (
    <>
      <span data-testid="loading">{String(auth.loading)}</span>
      <span data-testid="user">{auth.user?.username || "guest"}</span>
    </>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps a valid saved session after validating it", async () => {
    localStorage.setItem("mh_token", "valid-token");
    localStorage.setItem(
      "mh_user",
      JSON.stringify({ username: "saved-user" })
    );
    validateToken.mockResolvedValue({ code: "jwt_auth_valid_token" });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("saved-user");
  });

  it("clears a saved session when token validation fails", async () => {
    localStorage.setItem("mh_token", "expired-token");
    localStorage.setItem(
      "mh_user",
      JSON.stringify({ username: "stale-user" })
    );
    validateToken.mockRejectedValue(new Error("Expired"));

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("guest");
    });
    expect(localStorage.getItem("mh_token")).toBeNull();
    expect(localStorage.getItem("mh_user")).toBeNull();
  });

  it("stores the normalized user returned by login", async () => {
    loginRequest.mockResolvedValue({
      token: "new-token",
      user_display_name: "Test User",
      user_email: "test@example.com",
      user_nicename: "test-user",
    });

    render(
      <AuthProvider>
        <AuthProbe signIn />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test-user");
    });
    expect(localStorage.getItem("mh_token")).toBe("new-token");
  });
});
