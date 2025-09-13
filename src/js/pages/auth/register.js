import { registerUser } from "../../api/auth/register.js";
import { setProfileName } from "../../utils/storage.js";

const form = document.querySelector("#registerForm");
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

  const name = form.name?.value?.trim();
  const email = form.email?.value?.trim();
  const password = form.password?.value;

  if (!/@stud\.noroff\.no$/i.test(email))
    return showError("Use your @stud.noroff.no email.");
  if ((password || "").length < 8)
    return showError("Password must be at least 8 characters.");
  if (!/^[A-Za-z0-9_]{3,}$/.test(name))
    return showError("Use letters, numbers, underscore; min 3.");

  try {
    const data = await registerUser({ name, email, password });

    if (data?.name) setProfileName(data.name);
    window.location.href = "/src/pages/login.html";
  } catch (err) {
    showError(err.message || "Registration failed.");
  }
});
