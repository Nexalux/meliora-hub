/* eslint-disable react-refresh/only-export-components */

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginRequest,
  validateToken,
} from "../api/auth";
import { AUTH_EXPIRED_EVENT } from "../api/client";

const AuthContext = createContext();

function getStoredUser() {
  const savedUser = localStorage.getItem("mh_user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("mh_user");
    return null;
  }
}

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() =>
    localStorage.getItem("mh_token")
  );

  const [user, setUser] = useState(getStoredUser);

  const [initializing, setInitializing] = useState(
    () => Boolean(localStorage.getItem("mh_token"))
  );
  const [authenticating, setAuthenticating] = useState(false);

  const logout = useCallback(() => {

    localStorage.removeItem("mh_token");
    localStorage.removeItem("mh_user");

    setToken(null);
    setUser(null);

  }, []);

  useEffect(() => {

    function handleExpiredSession() {
      logout();
    }

    globalThis.addEventListener(
      AUTH_EXPIRED_EVENT,
      handleExpiredSession
    );

    return () => {
      globalThis.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handleExpiredSession
      );
    };

  }, [logout]);

  useEffect(() => {

    let active = true;
    const controller = new AbortController();
    const storedToken = localStorage.getItem("mh_token");
    const storedUser = getStoredUser();

    if (!storedToken || !storedUser) {
      logout();
      setInitializing(false);
      return undefined;
    }

    validateToken({ signal: controller.signal })
      .catch(() => {
        if (active) {
          logout();
        }
      })
      .finally(() => {
        if (active) {
          setInitializing(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };

  }, [logout]);

  const login = useCallback(async (username, password) => {

    setAuthenticating(true);

    try {

      const data = await loginRequest(
        username,
        password
      );

      const userData = {
        name: data.user_display_name,
        email: data.user_email,
        username: data.user_nicename,
      };

      localStorage.setItem(
        "mh_token",
        data.token
      );

      localStorage.setItem(
        "mh_user",
        JSON.stringify(userData)
      );

      setToken(data.token);
      setUser(userData);

      return true;

    } finally {

      setAuthenticating(false);

    }

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: initializing || authenticating,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;

}
