import { useState } from "react";
import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

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

      // Remove success message after login
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back!</h1>

        <p>
          Continue your learning journey on
          Meliora Hub.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

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

        <div className="login-footer">
          Don't have an account?

          <Link to="/register">
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;