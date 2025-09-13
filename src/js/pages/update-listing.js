// /src/js/pages/update-listing.js
import { requireAuth } from "../guards/requireAuth.js";
import { headers } from "../constants/header.js";
import { API_AUCTION_LISTING } from "../constants/endpoints.js";
import { getListing } from "../api/listings.js"; // your existing getter

const form = document.getElementById("listingForm");
const errBox = document.getElementById("formError");

function setErr(m) {
  if (!errBox) return;
  errBox.textContent = m || "";
  errBox.style.display = m ? "block" : "none";
}

const id = new URLSearchParams(location.search).get("id");
(async function boot() {
  const auth = requireAuth();
  if (!auth) return;
  if (!id) return setErr("Missing listing id.");

  try {
    const data = await getListing(id); // has title, description, tags, media, endsAt
    form.title.value = data?.title || "";
    form.description.value = data?.description || "";
    form.tags.value = (data?.tags || []).join(", ");
    // endsAt in local format
    if (data?.endsAt) {
      const d = new Date(data.endsAt);
      const pad = (n) => String(n).padStart(2, "0");
      form.endsAt.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    // simple media UI: reuse your create dynamic rows code if you want
  } catch (e) {
    setErr(e?.message || "Couldn’t load listing.");
  }
})();

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setErr("");

  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const tags = form.tags.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // endsAt is optional on update; only include if filled
  let endsAt;
  if (form.endsAt.value) endsAt = new Date(form.endsAt.value).toISOString();

  // If you want media editing here, collect it like on create and include as [{url,alt}]
  const body = { title, description, tags };
  if (endsAt) body.endsAt = endsAt;

  try {
    const res = await fetch(API_AUCTION_LISTING(id), {
      method: "PUT",
      headers: headers(true, true), // Bearer + API key
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(
        json?.errors?.[0]?.message || `Update failed (${res.status})`
      );

    // Go back to detail or "My Auction"
    window.location.href = `/src/pages/single-listing.html?id=${encodeURIComponent(
      id
    )}`;
  } catch (e) {
    setErr(e?.message || "Update failed.");
  }
});
