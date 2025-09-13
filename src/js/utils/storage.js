const TOKEN_KEY = "accessToken";
const NAME_KEY = "profileName";
const ACTIVITY_KEY = "lastActivityAt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getProfileName() {
  return localStorage.getItem(NAME_KEY);
}
export function setProfileName(name) {
  localStorage.setItem(NAME_KEY, name);
}
export function clearProfileName() {
  localStorage.removeItem(NAME_KEY);
}

// Inactivity helpers
export const touchActivity = () =>
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
export const lastActivityAt = () =>
  Number(localStorage.getItem(ACTIVITY_KEY) || 0);
export const isInactive = (maxMs = 30 * 60 * 1000) =>
  Date.now() - lastActivityAt() > maxMs;
export const clearActivity = () => localStorage.removeItem(ACTIVITY_KEY);
