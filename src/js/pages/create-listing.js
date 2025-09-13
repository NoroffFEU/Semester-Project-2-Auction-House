// /src/js/pages/create-listing.js
import { requireAuth } from "../guards/requireAuth.js";
import { createListing } from "../api/createListing.js"; // or "../api/listings.js" if you exported there

const form = document.getElementById("listingForm");
const mediaList = document.getElementById("mediaList");
const addMediaBtn = document.getElementById("addMedia");
const statusEl = document.getElementById("createStatus");
const tmpl = document.getElementById("mediaRowTemplate");

const FALLBACK_IMG = "https://picsum.photos/seed/auction/200/200";

/* utils */
const setStatus = (m) => {
  if (statusEl) statusEl.textContent = m || "";
};
function validImageUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
function mustFutureISO(localValue) {
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid end date/time.");
  if (d.getTime() <= Date.now())
    throw new Error("End time must be in the future.");
  return d.toISOString();
}
function parseTags(s) {
  return (s || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 15);
}

/* media rows via <template> */
function addMediaRow(url = "", alt = "") {
  if (!tmpl?.content?.firstElementChild) return;
  const row = tmpl.content.firstElementChild.cloneNode(true);

  const img = row.querySelector("img");
  const urlInput = row.querySelector('input[name="mediaUrl"]');
  const altInput = row.querySelector('input[name="mediaAlt"]');
  const removeBtn = row.querySelector("button");

  img.src = url || FALLBACK_IMG;
  img.onerror = () => {
    img.onerror = null;
    img.src = FALLBACK_IMG;
  };

  urlInput.value = url;
  altInput.value = alt;

  urlInput.addEventListener("input", () => {
    const v = urlInput.value.trim();
    img.src = validImageUrl(v) ? v : FALLBACK_IMG;
  });
  removeBtn.addEventListener("click", () => row.remove());

  mediaList.appendChild(row);
}

function parseMedia() {
  const rows = [...mediaList.querySelectorAll('[data-row="media"]')];
  const out = [];
  for (const r of rows) {
    const url = r.querySelector('input[name="mediaUrl"]')?.value?.trim();
    const alt = r.querySelector('input[name="mediaAlt"]')?.value?.trim() || "";
    if (!url) continue;
    if (!validImageUrl(url))
      throw new Error(`Invalid image URL: ${url}\nUse a public https:// URL.`);
    out.push({ url, alt });
  }
  return out.slice(0, 10);
}

/* init */
(function init() {
  if (!requireAuth()) return; // ensure logged in

  // ensure at least one row
  if (mediaList && !mediaList.children.length) addMediaRow();
  addMediaBtn?.addEventListener("click", () => addMediaRow());

  // endsAt min = now +10 min
  const ends = document.getElementById("endsAt");
  if (ends) {
    const now = new Date(Date.now() + 10 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    ends.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
})();

/* submit */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Creating…");

  const title = form.title?.value?.trim();
  const description = form.description?.value?.trim();
  const tags = parseTags(form.tags?.value);
  if (!title || title.length < 3)
    return setStatus("Title must be at least 3 characters.");

  let endsAtISO;
  try {
    endsAtISO = mustFutureISO(form.endsAt?.value);
  } catch (err) {
    return setStatus(err.message);
  }

  let media = [];
  try {
    media = parseMedia();
  } catch (err) {
    return setStatus(err.message);
  }

  const payload = { title, description, tags, media, endsAt: endsAtISO };

  try {
    const created = await createListing(payload); // must return json.data
    if (created?.id) {
      setStatus("Created! Redirecting…");
      window.location.href = `/src/pages/single-listing.html?id=${encodeURIComponent(
        created.id
      )}`;
    } else {
      setStatus("Created, but the server didn’t return an id.");
    }
  } catch (err) {
    console.error("[create] error", err);
    setStatus(err?.message || "Could not create listing.");
  }
});
