import * as endpoints from "./endpoints.js";

const STATIC_API_KEY = endpoints.API_KEY || "#";

function getApiKey() {
  const fromStorage = localStorage.getItem("apiKey");
  return fromStorage || STATIC_API_KEY || "@#";
}

/**
 * Build headers for API requests.
 * @param {boolean} authRequired   Authorization: Bearer <token>
 * @param {boolean} useApiKey      X-Noroff-API-Key
 */
export function headers(authRequired = false, useApiKey = true) {
  const h = { "Content-Type": "application/json" };

  if (useApiKey) {
    const key = getApiKey();
    if (key) h["X-Noroff-API-Key"] = key;
  }

  if (authRequired) {
    const token = localStorage.getItem("accessToken");
    if (token) h["Authorization"] = `Bearer ${token}`;
  }

  return h;
}
