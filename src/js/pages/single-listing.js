import { getListing, getListingBids, placeBid } from "../api/listings.js";
import {
  renderGallery,
  renderTitle,
  renderEndsAt,
  renderDescription,
  renderTags,
  renderBids,
} from "../ui/listingView.js";
import { getProfileName, getToken } from "../utils/storage.js";

/* ============ tiny utils ============ */
const $ = (id) => document.getElementById(id);
const text = (el, s = "") => el && (el.textContent = s || "");
const cloneTpl = (id) => document.getElementById(id)?.content.cloneNode(true);
const DEV_HOST = /^(localhost|127\.0\.0\.1|192\.168\.)$/i.test(
  location.hostname
);

const extractListingId = () => new URLSearchParams(location.search).get("id");
const isBadId = (id) => !id || id === "undefined" || id === "null";

function recoverIdIfDev() {
  if (!DEV_HOST) return null;

  const last = sessionStorage.getItem("lastListingId");
  if (last && !isBadId(last)) return last;

  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    const rid = ref?.searchParams?.get("id");
    if (rid && !isBadId(rid)) return rid;

    if (ref) {
      const parts = ref.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) =>
        /^(single-listing(?:\.html)?)$/i.test(p)
      );
      if (idx !== -1 && parts[idx + 1] && !isBadId(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

function patchUrlWithId(id) {
  const url = new URL(location.href);
  url.searchParams.set("id", id);
  history.replaceState(null, "", url.toString());
}

/* ============ status & fallbacks ============ */
function showStatus(msg) {
  text($("listingStatus"), msg);
}
function showMissingId() {
  const host = $("listingRoot") || document.body;
  const frag = cloneTpl("tpl-missing-id");
  if (host && frag) host.replaceChildren(frag);
  else text($("listingStatus"), "Missing listing id.");
}
function showError(message) {
  const host = $("listingRoot") || document.body;
  const frag = cloneTpl("tpl-error");
  if (host && frag) {
    const span = frag.querySelector("[data-error-msg]");
    if (span) span.textContent = message || "Unknown error";
    host.replaceChildren(frag);
  } else {
    text($("listingStatus"), message || "Failed to load listing.");
  }
}

/* ============ render ============ */
function renderListing(data, bids, me) {
  renderGallery($("listingGallery"), data?.media);
  renderTitle($("listingTitle"), data?.title);
  renderEndsAt($("listingEndsAt"), data?.endsAt);
  renderDescription($("listingDescription"), data?.description);
  renderTags($("listingTags"), data?.tags);
  renderBids($("bidList"), $("bidCount"), bids, { currentUser: me });
}

/* ============ bidding (minimal) ============ */
function setupBidForm({ ended, isOwner, id, me, initialBids }) {
  const form = $("bidForm");
  const amountInput = form?.elements?.amount;
  const err = $("bidError");
  const showErr = (m) => {
    if (!err) return alert(m);
    err.textContent = m;
    err.classList.remove("hidden");
  };
  const clearErr = () => {
    if (err) {
      err.textContent = "";
      err.classList.add("hidden");
    }
  };

  if (!form) return;

  if (!getToken()) {
    form.classList.add("opacity-60", "pointer-events-none");
    showErr("Login to place a bid.");
    return;
  }
  if (ended) {
    form.classList.add("opacity-60", "pointer-events-none");
    showErr("This auction has ended.");
    return;
  }
  if (isOwner) {
    form.classList.add("opacity-60", "pointer-events-none");
    showErr("You cannot bid on your own listing.");
    return;
  }

  let bids = Array.isArray(initialBids) ? initialBids : [];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErr();

    const amount = Number((amountInput?.value || "").trim());
    if (!Number.isFinite(amount) || amount <= 0) {
      showErr("Bid must be a positive number.");
      return;
    }

    try {
      await placeBid(id, amount);
      bids = await getListingBids(id); // refresh
      renderBids($("bidList"), $("bidCount"), bids, { currentUser: me });
      if (amountInput) amountInput.value = "";
    } catch (e2) {
      showErr(e2?.message || "Bid failed.");
    }
  });
}

/* ============ boot (top-level await) ============ */
let id = extractListingId();

if (isBadId(id)) {
  const recovered = recoverIdIfDev();
  if (recovered) {
    patchUrlWithId(recovered);
    id = recovered;
  }
}

if (isBadId(id)) {
  showMissingId();
} else {
  try {
    showStatus("Loading…");
    const data = await getListing(String(id));
    if (!data || (data.errors && data.errors.length)) {
      throw new Error(data?.errors?.[0]?.message || "Failed to load listing");
    }

    const bids = Array.isArray(data?.bids) ? data.bids : [];
    const me = getProfileName() || "";
    const ends = data?.endsAt ? new Date(data.endsAt).getTime() : NaN;
    const ended = Number.isFinite(ends) ? ends <= Date.now() : false;
    const isOwner = (data?.seller?.name || "") === me;

    renderListing(data, bids, me);
    setupBidForm({ ended, isOwner, id, me, initialBids: bids });
    showStatus("");
  } catch (err) {
    console.error("single-listing: load failed:", err);
    showError(err?.message);
    showStatus("");
  }
}
