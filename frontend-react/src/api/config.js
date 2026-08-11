const configuredRestUrl =
  import.meta.env.VITE_WP_REST_URL?.trim();

const defaultRestUrl = import.meta.env.DEV
  ? "http://localhost:8080/meliorahub/wp-json"
  : `${globalThis.location.origin}/wp-json`;

export const WP_REST_URL = (
  configuredRestUrl || defaultRestUrl
).replace(/\/+$/, "");

export const API_URL = `${WP_REST_URL}/meliora/v1`;
export const JWT_API_URL = `${WP_REST_URL}/jwt-auth/v1`;
