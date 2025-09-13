import { applyProfileToUI, prefillFormFromUI } from "../../utils/profile.js";

export function initProfileUI({ onEdit, onCancel, onSubmit }) {
  const editBtn = document.getElementById("editProfileBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const form = document.getElementById("updateProfileForm");

  editBtn?.addEventListener("click", async () => {
    await onEdit?.(); // fetch fresh data, if you want
    prefillFormFromUI(); // prefill inputs from current UI
    showForm();
  });

  cancelBtn?.addEventListener("click", () => {
    hideForm();
    onCancel?.();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(new FormData(form));
      showStatus("Profile updated!", true);
      setTimeout(hideForm, 300);
    } catch (err) {
      showStatus(err.message || "Something went wrong.", false);
    } finally {
      setLoading(false);
    }
  });
}

export function showForm() {
  document.getElementById("updateProfileForm")?.classList.remove("hidden");
  document.getElementById("updateStatus").textContent = "";
}
export function hideForm() {
  const form = document.getElementById("updateProfileForm");
  if (form) {
    form.classList.add("hidden");
    form.reset();
  }
  document.getElementById("updateStatus").textContent = "";
}
export function setLoading(isLoading) {
  const btn = document.getElementById("updateBtn");
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Updating..." : "Update Profile";
}
export function showStatus(text, ok) {
  const el = document.getElementById("updateStatus");
  if (!el) return;
  el.textContent = text;
  el.className = `text-sm ${ok ? "text-green-600" : "text-red-600"}`;
}

export function renderProfileHeader(data) {
  applyProfileToUI(data); // name, bio, avatar, banner
}
