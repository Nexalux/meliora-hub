import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import "../styles/pages/login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      await login(username, password);

      const returnPath =
        typeof location.state?.from === "string" &&
        location.state.from.startsWith("/")
          ? location.state.from
          : "/";

      navigate(returnPath, {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="login-page">

      <div className="login-background"></div>

      <section className="login-card">

        <div className="login-header">

          <div className="login-badge">
            MELIORA HUB
          </div>

          <h1>Welcome Back</h1>

          <p>
            Continue your learning journey on
            Meliora Hub.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {location.state?.success && (
            <div className="login-success">
              {location.state.success}
            </div>
          )}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        <footer className="login-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create one
          </Link>

        </footer>

      </section>

    </main>
  );
}

export default Login;
