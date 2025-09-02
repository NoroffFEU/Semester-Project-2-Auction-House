import { API_AUTH_LOGIN } from "../endpoints.js";

import { headers } from "../headers.js";

/**
 * Sends a login request to the API.
 * @param {Object} userInfo - Contains email and password.
 * @returns {Promise<Object>} Parsed JSON response.
 */
export async function loginUser(userInfo) {
  const res = await fetch(API_AUTH_LOGIN, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(userInfo),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.errors?.[0]?.message || "Login failed");
  }

  return result;
}
