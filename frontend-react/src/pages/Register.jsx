import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
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

  const [showPassword, setShowPassword] =
  useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

  function updateField(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }

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

  return (

    <main className="login-page">

      <div className="login-background"></div>

      <section className="login-card">

        <div className="login-header">

          <div className="login-badge">
            MELIORA HUB
          </div>

          <h1>Create Account</h1>

          <p>
            Join Meliora Hub and start your learning journey.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={updateField}
              autoComplete="username"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />

          </div>

          <div className="form-group">

  <label htmlFor="password">
    Password
  </label>

  <div className="password-input">

    <input
      id="password"
      type={
        showPassword
          ? "text"
          : "password"
      }
      name="password"
      placeholder="Create a password"
      value={form.password}
      onChange={updateField}
      autoComplete="new-password"
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowPassword(!showPassword)
      }
      aria-label={
        showPassword
          ? "Hide password"
          : "Show password"
      }
    >
      {showPassword
        ? <FiEyeOff />
        : <FiEye />}
    </button>

  </div>

</div>

          <div className="form-group">

  <label htmlFor="confirmPassword">
    Confirm Password
  </label>

  <div className="password-input">

    <input
      id="confirmPassword"
      type={
        showConfirmPassword
          ? "text"
          : "password"
      }
      name="confirmPassword"
      placeholder="Confirm your password"
      value={form.confirmPassword}
      onChange={updateField}
      autoComplete="new-password"
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowConfirmPassword(
          !showConfirmPassword
        )
      }
      aria-label={
        showConfirmPassword
          ? "Hide password"
          : "Show password"
      }
    >
      {showConfirmPassword
        ? <FiEyeOff />
        : <FiEye />}
    </button>

  </div>

</div>

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
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <footer className="login-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign In
          </Link>

        </footer>

      </section>

    </main>

  );

}

export default Register;
