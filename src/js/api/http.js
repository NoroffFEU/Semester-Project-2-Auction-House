import { API_BASE } from "../endpoints.js";
/**
 * Returns headers for fetch requests.
 * @param {boolean} [authRequired=false] - Whether Authorization header is needed.
 * @returns {Object} Headers object
 */
export function headers(authRequired = false) {
  const baseHeaders = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (authRequired) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }
  }

  return baseHeaders;
}
