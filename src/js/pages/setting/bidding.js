import { requireAuth } from "../../guards/requireAuth.js";
import { getProfileName } from "../../utils/storage.js";
import { getProfileBids } from "../../api/profile.js";

const listEl = document.getElementById("settingList");
const statusEl = document.getElementById("settingStatus");
const template = document.getElementById("bidRowTemplate");
const singlePath = "/src/pages/single-listing.html";

const FALLBACK_IMG = "https://picsum.photos/seed/auction/100/100";

const setStatus = (m) => {
  if (statusEl) statusEl.textContent = m || "";
};

function renderRow(bid) {
  const clone = template.content.cloneNode(true);

  const title = bid?.listing?.title || "Untitled";
  const amount = Number(bid?.amount || 0);
  const when = bid?.created ? new Date(bid.created).toLocaleString() : "";
  const listingId = bid?.listing?.id;

  const media = Array.isArray(bid?.listing?.media) ? bid.listing.media : [];
  const img = media[0] || {};
  const imgUrl = img.url || FALLBACK_IMG;
  const alt = img.alt || title;

  const anchor = clone.querySelector("a");
  anchor.href = listingId
    ? `${singlePath}?id=${encodeURIComponent(listingId)}`
    : "#";

  const imgEl = clone.querySelector("img");
  imgEl.src = imgUrl;
  imgEl.alt = alt;
  imgEl.onerror = () => (imgEl.src = FALLBACK_IMG);

  clone.querySelector("[data-title]").textContent = title;
  clone.querySelector("[data-when]").textContent = when;
  clone.querySelector("[data-amount]").textContent = amount;

  return clone;
}

(async function init() {
  requireAuth();
  const name = getProfileName();
  setStatus("Loading your bids…");

  try {
    const bids = await getProfileBids(name);
    listEl.innerHTML = ""; // clear old

    if (!Array.isArray(bids) || !bids.length) {
      setStatus("No bids yet.");
      return;
    }

    const fragment = document.createDocumentFragment();
    bids.forEach((b) => fragment.appendChild(renderRow(b)));
    listEl.appendChild(fragment);

    setStatus("");
  } catch (e) {
    console.error(e);
    setStatus(e.message || "Couldn’t load bids.");
  }
})();
