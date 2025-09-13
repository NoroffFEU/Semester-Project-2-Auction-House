import { clearToken, clearProfileName } from "../../utils/storage.js";
export function setupLogout(id = "logoutBtn") {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("click", () => {
    clearToken();
    clearProfileName();
    location.href = "/src/pages/login.html";
  });
}
