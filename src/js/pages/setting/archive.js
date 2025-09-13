// /src/js/pages/setting/archive.js
import { requireAuth } from "../../guards/requireAuth.js";
import { getProfileName } from "../../utils/storage.js";
import { getProfileBids, getProfileWins } from "../../api/profile.js";

const grid = document.getElementById("settingGrid");
const statusEl = document.getElementById("settingStatus");
const tmpl = document.getElementById("archiveCardTemplate");

function setStatus(m) {
  if (statusEl) statusEl.textContent = m || "";
}

function isEnded(iso) {
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) && d.getTime() <= Date.now();
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

function buildCard({ type, item }) {
  if (!tmpl?.content?.firstElementChild) return null;
  const node = tmpl.content.firstElementChild.cloneNode(true);

  // Resolve common fields
  const isWin = type === "win";
  const id = isWin ? item?.id : item?.listing?.id;
  const title = isWin ? item?.title : item?.listing?.title || "Untitled";
  const endedISO = isWin ? item?.endsAt : item?.listing?.endsAt;

  // Fill template parts
  const a = node;
  const typeEl = node.children[0];
  const titleEl = node.children[1];
  const endedEl = node.children[2];

  a.href = id
    ? `/src/pages/single-listing.html?id=${encodeURIComponent(id)}`
    : "#";
  typeEl.textContent = isWin ? "Win" : "Ended bid";
  titleEl.textContent = title || "Untitled";
  endedEl.textContent = `Ended: ${new Date(
    endedISO
  ).toLocaleString()} • ${timeAgo(endedISO)}`;

  return node;
}

function showEmptyMessage() {
  // Create a friendly empty-state without innerHTML
  const p = document.createElement("p");
  p.className = "text-sm text-gray-500";
  p.textContent = "Nothing archived yet.";
  grid.appendChild(p);
}

(async function init() {
  if (!requireAuth()) return;
  const name = getProfileName();
  setStatus("Loading your archive…");

  try {
    const [wins, myBids] = await Promise.all([
      getProfileWins(name), // array of listings you've won
      getProfileBids(name), // array of bids you've placed
    ]);

    // Keep only bids from ended listings (these are not necessarily wins)
    const endedBids = (myBids || []).filter((b) => isEnded(b?.listing?.endsAt));

    // Build a combined list: wins first, then ended bids
    const cards = [];
    if (Array.isArray(wins)) {
      for (const w of wins) cards.push({ type: "win", item: w });
    }
    if (Array.isArray(endedBids)) {
      for (const b of endedBids) cards.push({ type: "endedBid", item: b });
    }

    // Render
    grid.innerHTML = ""; // clear safely once
    if (!cards.length) {
      showEmptyMessage();
      return setStatus("");
    }

    const frag = document.createDocumentFragment();
    for (const c of cards) {
      const node = buildCard(c);
      if (node) frag.appendChild(node);
    }
    grid.appendChild(frag);
    setStatus("");
  } catch (e) {
    console.error(e);
    setStatus("Couldn’t load your archive.");
  }
})();
