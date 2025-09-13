// /src/js/ui/settingRenderers.js
import { renderGrid } from "./cards.js";
import { timeAgo } from "../utils/time.js";

const single = "/src/pages/single-listing.html";
const FALLBACK_IMG = "https://picsum.photos/seed/auction/400/300";

export function renderMyWins(container, wins = []) {
  if (!container) return;
  if (!wins.length) {
    container.innerHTML = `<p class="text-sm text-gray-500">No wins yet.</p>`;
    return;
  }
  container.innerHTML = wins
    .map((w) => {
      const id = w?.id;
      const href = id ? `${single}?id=${encodeURIComponent(id)}` : "#";
      const title = w?.title || "Untitled";
      const ended = w?.endsAt ? new Date(w.endsAt).toLocaleString() : "";
      return `
      <a href="${href}" class="block rounded border p-3 hover:bg-gray-50">
        <div class="font-medium">${title}</div>
        <div class="text-xs text-gray-600">Ended: ${ended}</div>
      </a>`;
    })
    .join("");
}

export function renderMyListings(container, items = []) {
  if (!container) return;
  if (!items?.length) {
    container.innerHTML = `<p class="text-sm text-gray-500">No listings yet.</p>`;
    return;
  }
  renderGrid(container, items);
}

export function renderMyBids(container, bids = []) {
  if (!container) return;
  if (!bids?.length) {
    container.innerHTML = `<p class="text-sm text-gray-500">You haven’t placed any bids yet.</p>`;
    return;
  }
  container.innerHTML = bids
    .map((b) => {
      const listing = b?.listing ?? {};
      const id = listing?.id ?? "";
      const title = listing?.title ?? "Listing";
      const img = listing?.media?.[0]?.url || FALLBACK_IMG;
      const href = id ? `${single}?id=${encodeURIComponent(id)}` : "#";
      return `
      <a href="${href}"
         class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition">
        <img src="${img}" class="w-16 h-16 rounded object-cover"
             onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" alt="${title}" />
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate">${title}</div>
          <div class="text-xs text-gray-500">Bid ${timeAgo(b?.created)}</div>
        </div>
        <div class="font-semibold whitespace-nowrap">Bid: ${
          b?.amount ?? "-"
        }</div>
      </a>
    `;
    })
    .join("");
}
