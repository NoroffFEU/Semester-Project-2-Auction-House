import {
  getToken,
  getProfileName,
  isInactive,
  clearToken,
  clearProfileName,
  clearActivity,
} from "../utils/storage.js";

export function requireAuth({
  redirectTo = "/src/pages/login.html",
  maxIdleMs = 30 * 60 * 1000,
} = {}) {
  const token = getToken();
  const name = getProfileName();
  if (!token || !name || isInactive(maxIdleMs)) {
    clearToken();
    clearProfileName();
    clearActivity();
    window.location.href = redirectTo;
    throw new Error("Not authenticated");
  }
  return { name, token };
}
