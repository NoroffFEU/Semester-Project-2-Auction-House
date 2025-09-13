const SINGLE_VIEW_PATH = "/src/pages/single-listing.html";
export const FALLBACK_IMG = "https://picsum.photos/seed/auction/400/300";

function singleUrl(id) {
  const u = new URL(SINGLE_VIEW_PATH, location.origin);
  u.searchParams.set("id", id);
  return u.href; // stays on current host/port; works on Netlify too
}

export function listingCard(item = {}) {
  const id = item?.id ?? "";
  const title = item?.title ?? "Untitled";
  const media = Array.isArray(item?.media) ? item.media : [];
  const img = media.length ? media[0] : {};
  const imgUrl = img?.url || FALLBACK_IMG;
  const alt = img?.alt || title;
  const bidsCount = item?._count?.bids ?? 0;
  const seller = item?.seller?.name ?? "Unknown";

  const href = id ? singleUrl(id) : "#";

  return `
    <a href="${href}" data-id="${id}"
       class="block rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div class="w-full h-40 bg-gray-100">
        <img src="${imgUrl}" alt="${alt}" class="w-full h-full object-cover"
             onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" />
      </div>
      <div class="p-3 space-y-1">
        <h3 class="text-sm font-semibold truncate">${title}</h3>
        <p class="text-xs text-gray-500">Bids: ${bidsCount}</p>
        <p class="text-xs text-gray-400">Seller: ${seller}</p>
      </div>
    </a>
  `;
}

export function renderGrid(container, items = []) {
  if (!container) return;
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No listings available.</p>`;
    return;
  }

  container.innerHTML = items.map(listingCard).join("");

  // Dev QoL: remember last clicked id so single page can recover if URL lacks ?id=
  container.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-id]");
    if (!a) return;
    const id = a.getAttribute("data-id");
    if (id) sessionStorage.setItem("lastListingId", id);
  });
}
