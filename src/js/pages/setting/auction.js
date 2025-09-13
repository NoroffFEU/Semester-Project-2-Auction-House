// /src/js/pages/setting/auction.js
import { requireAuth } from "../../guards/requireAuth.js";
import { getProfileListings } from "../../api/profile.js";
import { deleteListing } from "../../api/deleteListing.js";
import { getProfileName } from "../../utils/storage.js";

const grid = document.getElementById("settingGrid");
const statusEl = document.getElementById("settingStatus");
const tmpl = document.getElementById("myListingCardTemplate");

const FALLBACK = "https://picsum.photos/seed/auction/400/300";

function setStatus(m) {
  if (statusEl) statusEl.textContent = m || "";
}

function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (!Number.isFinite(s)) return "";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secs] of units) {
    const v = Math.floor(s / secs);
    if (v >= 1) return `${v} ${label}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function buildCard(item) {
  if (!tmpl?.content?.firstElementChild) return null;
  const node = tmpl.content.firstElementChild.cloneNode(true);

  const imgEl = node.querySelector("img");
  const titleEl = node.querySelector("h3");
  const bidsEl = node.querySelectorAll("p")[0];
  const timeEl = node.querySelectorAll("p")[1];
  const actions = node.querySelectorAll("a, button");

  const viewA = actions[0];
  const editA = actions[1];
  const delBtn = actions[2];

  const firstMedia =
    Array.isArray(item?.media) && item.media[0] ? item.media[0] : {};
  imgEl.src = firstMedia.url || FALLBACK;
  imgEl.alt = firstMedia.alt || item?.title || "image";
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = FALLBACK;
  };

  titleEl.textContent = item?.title ?? "Untitled";
  bidsEl.textContent = `Bids: ${item?._count?.bids ?? 0}`;
  timeEl.textContent = item?.created ? `Created ${timeAgo(item.created)}` : "";

  const id = item?.id;
  viewA.href = id
    ? `/src/pages/single-listing.html?id=${encodeURIComponent(id)}`
    : "#";
  editA.href = id ? `/src/pages/update.html?id=${encodeURIComponent(id)}` : "#";

  delBtn.addEventListener("click", async () => {
    if (!id) return;
    if (!confirm("Delete this listing?")) return;
    delBtn.disabled = true;
    try {
      await deleteListing(id);
      node.remove();
    } catch (e) {
      alert(e?.message || "Delete failed");
    } finally {
      delBtn.disabled = false;
    }
  });

  return node;
}

function showEmpty() {
  const p = document.createElement("p");
  p.className = "text-sm text-gray-500";
  p.textContent = "You have no listings yet.";
  grid.appendChild(p);
}

(async function boot() {
  if (!requireAuth()) return;
  const name = getProfileName();
  setStatus("Loading…");
  grid.innerHTML = "";

  try {
    const items = await getProfileListings(name); // public endpoint, data[] of listings
    if (!Array.isArray(items) || !items.length) {
      setStatus("");
      return showEmpty();
    }

    const frag = document.createDocumentFragment();
    for (const item of items) {
      const node = buildCard(item);
      if (node) frag.appendChild(node);
    }
    grid.appendChild(frag);
    setStatus("");
  } catch (e) {
    console.error(e);
    setStatus(e?.message || "Couldn't load your listings.");
  }
})();
