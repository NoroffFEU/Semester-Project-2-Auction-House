// /src/js/pages/profile.js
import { requireAuth } from "../guards/requireAuth.js";
import { getProfileName } from "../utils/storage.js";
import { getProfile, updateProfile } from "../api/profile.js";

const $ = (sel) => document.querySelector(sel);

// UI elements
const displayNameEl = $("#displayName");
const bioEl = $("#bioText");
const creditEl = $("#credit");
const avatarImg = $("#avatarImg");
const bannerImg = $("#bannerImg");

const editBtn = $("#editProfileBtn");
const cancelBtn = $("#cancelEditBtn");
const form = $("#updateProfileForm");
const updateStatus = $("#updateStatus");

// form inputs
const bioInput = $("#bio");
const avatarUrlInput = $("#avatar-url");
const avatarAltInput = $("#avatar-alt");
const bannerUrlInput = $("#banner-url");
const bannerAltInput = $("#banner-alt");

function showForm(show) {
  if (!form) return;
  form.classList.toggle("hidden", !show);
  form.setAttribute("aria-hidden", show ? "false" : "true");
  editBtn?.setAttribute("aria-expanded", show ? "true" : "false");
}

function setStatus(msg) {
  if (!updateStatus) return;
  updateStatus.textContent = msg || "";
}

function fillProfile(p) {
  const name = p?.name || "Your name";
  const bio = p?.bio || "No bio yet.";
  const credits = Number(p?.credits ?? 0);

  const avatarUrl = p?.avatar?.url || "/src/assets/images/myAvatar.png";
  const avatarAlt = p?.avatar?.alt || `${name} avatar`;

  const bannerUrl = p?.banner?.url || "/src/assets/images/backGround.png";
  const bannerAlt = p?.banner?.alt || `${name} banner`;

  if (displayNameEl) displayNameEl.textContent = name;
  if (bioEl) bioEl.textContent = bio;
  if (creditEl)
    creditEl.innerHTML = `<span class="font-medium">Credit:</span> ${credits}`;

  if (avatarImg) {
    avatarImg.src = avatarUrl;
    avatarImg.alt = avatarAlt;
  }
  if (bannerImg) {
    bannerImg.src = bannerUrl;
    bannerImg.alt = bannerAlt;
  }

  // prefill form
  if (bioInput) bioInput.value = p?.bio || "";
  if (avatarUrlInput) avatarUrlInput.value = p?.avatar?.url || "";
  if (avatarAltInput) avatarAltInput.value = p?.avatar?.alt || "";
  if (bannerUrlInput) bannerUrlInput.value = p?.banner?.url || "";
  if (bannerAltInput) bannerAltInput.value = p?.banner?.alt || "";
}

function buildPayloadFromForm() {
  const payload = {};
  const bioVal = bioInput?.value?.trim();
  const aUrl = avatarUrlInput?.value?.trim();
  const aAlt = avatarAltInput?.value?.trim();
  const bUrl = bannerUrlInput?.value?.trim();
  const bAlt = bannerAltInput?.value?.trim();

  if (bioVal !== undefined) payload.bio = bioVal;

  if (aUrl || aAlt) {
    payload.avatar = { url: aUrl || "", alt: aAlt || "" };
  }
  if (bUrl || bAlt) {
    payload.banner = { url: bUrl || "", alt: bAlt || "" };
  }
  return payload;
}

(async function init() {
  requireAuth();

  const name = getProfileName(); // must be set on login
  if (!name) {
    setStatus("Missing profile name (please login again).");
    return;
  }

  try {
    setStatus("Loading profile…");
    const prof = await getProfile(name);
    fillProfile(prof);
    setStatus("");
  } catch (e) {
    console.error(e);
    setStatus(e.message || "Could not load profile.");
  }

  editBtn?.addEventListener("click", () => showForm(true));
  cancelBtn?.addEventListener("click", () => showForm(false));

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = getProfileName();
    if (!name) return setStatus("Missing profile name.");

    const payload = buildPayloadFromForm();

    try {
      setStatus("Updating…");
      const updated = await updateProfile(name, payload);
      fillProfile(updated); // reflect changes instantly
      showForm(false);
      setStatus("Profile updated.");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Update failed.");
    }
  });
})();
