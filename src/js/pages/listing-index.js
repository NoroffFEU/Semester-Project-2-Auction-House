// /src/js/pages/listing-index.js
import { getListings } from "../api/listings.js";
import { renderGrid } from "../ui/cards.js";

const grid = document.getElementById("listingGrid");
const statusEl = document.getElementById("listingStatus");

async function loadListings(
  params = { _sort: "created", _order: "desc", _limit: 24 }
) {
  if (statusEl) statusEl.textContent = "Loading…";
  if (grid) grid.innerHTML = "";

  try {
    const items = await getListings(params);
    if (!Array.isArray(items) || items.length === 0) {
      if (statusEl) statusEl.textContent = "No listings found.";
      if (grid) grid.innerHTML = "";
      return;
    }
    renderGrid(grid, items);
    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    console.error("loadListings failed:", err);
    if (statusEl)
      statusEl.textContent = err?.message || "Couldn’t load listings.";
  }
}

// Kick off once
loadListings();

// Expose a simple API the filters can call
window.__reloadListings = loadListings;
