import {
  getToken,
  touchActivity,
  isInactive,
  clearToken,
  clearProfileName,
  clearActivity,
} from "./storage.js";

// Start watching for user activity and auto-logout after maxIdleMs (default 30 min)
export function startInactivityWatcher(maxIdleMs = 30 * 60 * 1000) {
  // bump activity now
  touchActivity();

  // events that count as activity
  const EVENTS = ["click", "mousemove", "keydown", "scroll", "touchstart"];
  const onActivity = () => touchActivity();
  EVENTS.forEach((evt) =>
    window.addEventListener(evt, onActivity, { passive: true })
  );

  // periodic check
  const check = () => {
    if (!getToken()) return; // not logged in
    if (isInactive(maxIdleMs)) {
      // auto logout
      clearToken();
      clearProfileName();
      clearActivity();
      window.location.href = "/src/pages/login.html";
    }
  };
  const timer = setInterval(check, 30 * 1000); // check every 30s

  // return a cleanup if needed
  return () => {
    clearInterval(timer);
    EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
  };
}
