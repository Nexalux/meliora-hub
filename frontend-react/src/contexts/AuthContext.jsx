import {
  createContext,
  useContext,
  useState,
} from "react";

import { login as loginRequest } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [loading, setLoading] = useState(false);

  async function login(username, password) {

    setLoading(true);

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
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setToken(data.token);
      setUser(userData);

      return true;

    } finally {

      setLoading(false);

    }

  }

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}