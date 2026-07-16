const API_URL = "http://localhost:8080/meliorahub/wp-json";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(username, password) {
  const response = await fetch(
    `${API_URL}/jwt-auth/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

  return data;
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
  const response = await fetch(
    "http://localhost:8080/meliorahub/wp-json/meliora/v1/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed."
    );
  }

  return data;
}