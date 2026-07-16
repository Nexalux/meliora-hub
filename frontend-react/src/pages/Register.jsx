import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth";

import "../styles/pages/login.css";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {

      setError("Passwords do not match.");

      return;
    }

    try {

      setLoading(true);

      await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      navigate("/login", {
        state: {
          success:
            "Account created successfully. Please sign in.",
        },
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }

  function updateField(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <p>
          Join Meliora Hub and start your learning journey.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={updateField}
            required
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={updateField}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={updateField}
            required
          />

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
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

        <div className="login-footer">

          Already have an account?

          <Link to="/login">
            Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;