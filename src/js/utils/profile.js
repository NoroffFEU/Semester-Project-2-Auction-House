// Helpers to format payloads safely
export function buildUpdatePayload({
  bio,
  avatarUrl,
  avatarAlt,
  bannerUrl,
  bannerAlt,
}) {
  return {
    bio: (bio ?? "").trim(),
    avatar: {
      url: (avatarUrl ?? "").trim(),
      alt: (avatarAlt ?? "").trim(),
    },
    banner: {
      url: (bannerUrl ?? "").trim(),
      alt: (bannerAlt ?? "").trim(),
    },
  };
}

export function applyProfileToUI(data) {
  const displayNameEl = document.getElementById("displayName");
  const bioTextEl = document.getElementById("bioText");
  const avatarImgEl = document.getElementById("avatarImg");
  const bannerImgEl = document.getElementById("bannerImg");

  if (displayNameEl)
    displayNameEl.textContent = data?.name || displayNameEl.textContent || "";
  if (bioTextEl) bioTextEl.textContent = data?.bio || "No bio yet.";

  if (avatarImgEl && data?.avatar?.url) {
    avatarImgEl.src = data.avatar.url;
    avatarImgEl.alt = data.avatar.alt || "Avatar";
  }
  if (bannerImgEl && data?.banner?.url) {
    bannerImgEl.src = data.banner.url;
    bannerImgEl.alt = data.banner.alt || "Banner";
  }
}

export function prefillFormFromUI() {
  const bioTextEl = document.getElementById("bioText");
  const avatarImgEl = document.getElementById("avatarImg");
  const bannerImgEl = document.getElementById("bannerImg");

  const bioInput = document.getElementById("bio");
  const avatarUrlInput = document.getElementById("avatar-url");
  const avatarAltInput = document.getElementById("avatar-alt");
  const bannerUrlInput = document.getElementById("banner-url");
  const bannerAltInput = document.getElementById("banner-alt");

  if (bioInput && bioTextEl) {
    const current = bioTextEl.textContent?.trim();
    bioInput.value = current === "No bio yet." ? "" : current || "";
  }
  if (avatarImgEl) {
    if (avatarUrlInput)
      avatarUrlInput.value = avatarImgEl.getAttribute("src") || "";
    if (avatarAltInput)
      avatarAltInput.value = avatarImgEl.getAttribute("alt") || "";
  }
  if (bannerImgEl) {
    if (bannerUrlInput)
      bannerUrlInput.value = bannerImgEl.getAttribute("src") || "";
    if (bannerAltInput)
      bannerAltInput.value = bannerImgEl.getAttribute("alt") || "";
  }
}
