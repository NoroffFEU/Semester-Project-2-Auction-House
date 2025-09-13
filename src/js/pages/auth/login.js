import { loginUser } from "../../api/auth/login.js";
import {
  setToken,
  setProfileName,
  touchActivity,
} from "../../utils/storage.js";

const form = document.querySelector("#loginForm");
const errorBox = document.querySelector("#formError");

function showError(msg) {
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}
function clearError() {
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const email = form.email?.value?.trim();
  const password = form.password?.value || "";

  // client checks
  if (!/@stud\.noroff\.no$/i.test(email)) {
    return showError("Use your @stud.noroff.no email.");
  }
  if (password.length < 8) {
    return showError("Password must be at least 8 characters.");
  }

  const userInfo = { email, password };
  try {
    const data = await loginUser(userInfo);
    setToken(data.accessToken);
    if (data?.name) setProfileName(data.name);
    touchActivity();

    window.location.href = "./profile.html";
  } catch (err) {
    showError(err?.message || "Login failed.");
  }
});
