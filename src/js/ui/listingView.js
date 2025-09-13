import { timeAgo } from "../utils/time.js";

const FALLBACK_IMG = "https://picsum.photos/seed/auction/600/400";

/* ============ GALLERY ============ */
export function renderGallery(el, media = []) {
  if (!el) return;

  const candidate =
    Array.isArray(media) && media.length
      ? media[0]
      : { url: FALLBACK_IMG, alt: "image" };

  const img = document.createElement("img");
  img.src = candidate.url || FALLBACK_IMG;
  img.alt = candidate.alt || "image";
  img.referrerPolicy = "no-referrer";
  img.loading = "lazy";
  img.className = "w-full h-full object-cover";
  img.addEventListener("error", () => {
    img.src = FALLBACK_IMG;
  });

  el.replaceChildren(img);
}

/* ============ SIMPLE FIELDS ============ */
export function renderTitle(el, title = "") {
  if (!el) return;
  el.textContent = title || "Untitled";
}

export function renderEndsAt(el, iso) {
  if (!el) return;
  if (!iso) {
    el.replaceChildren();
    return;
  }
  const d = new Date(iso);
  el.textContent = Number.isFinite(d.getTime())
    ? `Ends: ${d.toLocaleString()}`
    : "";
}

export function renderDescription(el, desc = "") {
  if (!el) return;
  el.textContent = desc || "";
}

/* ============ TAGS ============ */
export function renderTags(el, tags = []) {
  if (!el) return;
  const arr = Array.isArray(tags) ? tags : [];
  const frag = document.createDocumentFragment();

  const tpl = document.getElementById("tpl-tag"); // optional template
  for (const t of arr) {
    let node;
    if (tpl?.content?.firstElementChild) {
      node = tpl.content.firstElementChild.cloneNode(true);
      node.textContent = t;
    } else {
      const span = document.createElement("span");
      span.className =
        "inline-block text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200 mr-1 mb-1";
      span.textContent = t;
      node = span;
    }
    frag.appendChild(node);
  }
  el.replaceChildren(frag);
}

/* ============ BIDS ============ */
export function renderBids(container, countEl, bids = [], { currentUser }) {
  if (!container) return;

  const list = Array.isArray(bids) ? bids : [];
  const frag = document.createDocumentFragment();
  const tpl = document.getElementById("tpl-bid-row"); // optional template

  for (const bid of list) {
    const name = bid?.bidder?.name ?? "Unknown";
    const amount = bid?.amount ?? 0;
    const created = bid?.created ? timeAgo(bid.created) : "";
    const avatar = bid?.bidder?.avatar?.url || "https://placehold.co/40";
    const isMe = name === currentUser;

    let row;
    if (tpl?.content?.firstElementChild) {
      row = tpl.content.firstElementChild.cloneNode(true);
      const nameEl = row.querySelector("[data-name]");
      const createdEl = row.querySelector("[data-created]");
      const amountEl = row.querySelector("[data-amount]");
      const img = row.querySelector("[data-avatar]");

      if (nameEl) nameEl.textContent = name;
      if (createdEl) createdEl.textContent = created;
      if (amountEl) amountEl.textContent = String(amount);
      if (img) {
        img.src = avatar;
        img.alt = name;
        img.addEventListener(
          "error",
          () => (img.src = "https://placehold.co/40")
        );
      }
      if (isMe) row.classList.add("bg-yellow-50");
    } else {
      // programmatic fallback (no template)
      row = document.createElement("div");
      row.className = `flex items-center gap-3 px-4 py-2${
        isMe ? " bg-yellow-50" : ""
      }`;

      const img = document.createElement("img");
      img.className = "w-8 h-8 rounded-full object-cover";
      img.src = avatar;
      img.alt = name;
      img.addEventListener(
        "error",
        () => (img.src = "https://placehold.co/40")
      );

      const info = document.createElement("div");
      info.className = "flex-1";

      const nameEl = document.createElement("p");
      nameEl.className = "font-medium";
      nameEl.textContent = name;

      const createdEl = document.createElement("p");
      createdEl.className = "text-xs text-gray-500";
      createdEl.textContent = created;

      info.append(nameEl, createdEl);

      const amt = document.createElement("div");
      amt.className = "text-sm font-semibold text-gray-800";
      amt.textContent = String(amount);

      row.append(img, info, amt);
    }

    frag.appendChild(row);
  }

  container.replaceChildren(frag);

  if (countEl) {
    const n = list.length;
    countEl.textContent = `${n} bid${n === 1 ? "" : "s"}`;
  }
}
