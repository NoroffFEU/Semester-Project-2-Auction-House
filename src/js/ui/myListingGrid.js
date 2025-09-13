// /src/js/ui/myListingGrid.js
import { listingCard } from "./cards.js";

export function renderMyListingGrid(container, items = []) {
  if (!container) return;
  if (!Array.isArray(items) || !items.length) {
    container.innerHTML = `<p class="text-sm text-gray-500">No listings yet.</p>`;
    return;
  }
  container.innerHTML = items.map(listingCard).join("");
}
