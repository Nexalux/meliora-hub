import api from "./client";
import { JWT_API_URL } from "./config";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(username, password) {
  try {
    return await api.post(
      "/token",
      {
        username,
        password,
      },
      {
        auth: false,
        baseUrl: JWT_API_URL,
      }
    );
  } catch (error) {
    const message =
      (error.message || "")
        .replace(/<[^>]*>/g, "")
        .trim();

    if (
      message.toLowerCase().includes("incorrect") ||
      message.toLowerCase().includes("invalid")
    ) {

      throw new Error(
        "Invalid username or password."
      );

    }

    throw new Error(message || "Unable to sign in.");
  }
}

/*
|--------------------------------------------------------------------------
| Validate Session
|--------------------------------------------------------------------------
*/

export function validateToken(options = {}) {
  return api.post(
    "/token/validate",
    {},
    {
      ...options,
      baseUrl: JWT_API_URL,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export async function register({
  name,
  username,
  email,
  password,
}) {
  // done
  return api.post(
    "/register",
    {
        name,
        username,
        email,
        password,
    },
    {
      auth: false,
    }
  );
}
