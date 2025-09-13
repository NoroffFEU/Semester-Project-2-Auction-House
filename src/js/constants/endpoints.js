// ---(Noroff v2) ---
export const API_BASE = "https://v2.api.noroff.dev";

export const API_KEY = "8afc107e-9a93-42ec-82df-220bb87fdf84";

// --- Auth ---

export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;

// --- Auction: Profiles ---

export const API_AUCTION_PROFILES_BASE = `${API_BASE}/auction/profiles`;
export const API_AUCTION_PROFILE = (name) =>
  `${API_AUCTION_PROFILES_BASE}/${encodeURIComponent(name)}`;
export const API_AUCTION_PROFILE_LISTINGS = (name) =>
  `${API_AUCTION_PROFILE(name)}/listings`;
export const API_AUCTION_PROFILE_BIDS = (name) =>
  `${API_AUCTION_PROFILE(name)}/bids`;
export const API_AUCTION_PROFILE_WINS = (name) =>
  `${API_AUCTION_PROFILE(name)}/wins`;
export const API_AUCTION_PROFILES_SEARCH = (q) =>
  `${API_AUCTION_PROFILES_BASE}/search?q=${encodeURIComponent(q)}`;

// --- Auction: Listings ---

export const API_AUCTION_LISTINGS_BASE = `${API_BASE}/auction/listings`;
export const API_AUCTION_LISTINGS = (params = "") =>
  params ? `${API_AUCTION_LISTINGS_BASE}?${params}` : API_AUCTION_LISTINGS_BASE;
export const API_AUCTION_LISTING = (id) =>
  `${API_AUCTION_LISTINGS_BASE}/${encodeURIComponent(id)}`;
export const API_AUCTION_LISTING_BIDS = (id) =>
  `${API_AUCTION_LISTINGS_BASE}/${encodeURIComponent(id)}/bids`;
export const API_AUCTION_LISTINGS_SEARCH = (q) =>
  `${API_AUCTION_LISTINGS_BASE}/search?q=${encodeURIComponent(q)}`;
export const API_AUCTION_LISTINGS_TAG_ACTIVE = (tag) =>
  `${API_AUCTION_LISTINGS_BASE}?_tag=${encodeURIComponent(tag)}&_active=true`;

// ---  query params ---
export const withIncludes = (include = {}, extra = {}) => {
  const m = new Map();
  if (include.seller) m.set("_seller", "true");
  if (include.bids) m.set("_bids", "true");
  if (include.tags) m.set("_tags", "true");
  if (include.media) m.set("_media", "true");

  Object.entries(extra).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") m.set(k, String(v));
  });

  return Object.fromEntries(m);
};

export const QUERY_RECENT = withIncludes(
  { seller: true, bids: true },
  { _sort: "created", _order: "desc" }
);
export const QUERY_POPULAR = withIncludes(
  { seller: true, bids: true },
  { _sort: "endsAt", _order: "asc" }
);

// --- Bidding ---

export const API_PLACE_BID = (id) => `${API_AUCTION_LISTING(id)}/bids`;

// --- Utilities ---

export const buildQuery = (base, params = {}) => {
  const u = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  return u.toString();
};
