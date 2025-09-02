// Base API URL (Noroff v2)
export const API_BASE = "https://v2.api.noroff.dev";

// Noroff API Key
export const API_KEY = "8afc107e-9a93-42ec-82df-220bb87fdf84";

// Acess token for aithorization
export const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU09DQU5JQ09ERSIsImVtYWlsIjoiYXplc2FtMDI3NDVAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3NTY3NjI2NTd9.e-Xdryh6On3j7r-HXgYjvya_118FXaVoZxs_pGCREx8";

// AuHt endpoints
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`; // POST login
export const API_AUTH_REGISTER = `${API_AUTH}/register`; // POST register

/**
 * Auction House — Profiles
 * Docs show /auction/profiles with subroutes for listings/bids/wins/search.
 * https://docs.noroff.dev/docs/v2/auction-house/profiles
 */

export const API_AUCTION_PROFILES_BASE = "${API_BASE}/auction/profiles";

// Dynamic  profile path
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

/**
 * Auction House — Listings
 * https://docs.noroff.dev/docs/v2/auction-house/listings
 */

export const API_BASE_AUCTION_LISTINGS = "${API_BASE}/auction/listings";

// Dynamic  profile path
export const API_AUCTION_LISTINGS = () => API_AUCTION_LISTINGS_BASE;

export const API_AUCTION_LISTING = (id) =>
  `${API_AUCTION_LISTINGS_BASE}/${encodeURIComponent(id)}`;

export const API_AUCTION_LISTING_BIDS = (id) =>
  `${API_AUCTION_LISTINGS_BASE}/${encodeURIComponent(id)}/bids`;

export const API_AUCTION_LISTINGS_SEARCH = (q) =>
  `${API_AUCTION_LISTINGS_BASE}/search?q=${encodeURIComponent(q)}`;

// Helper for tag + active filter: GET /auction/listings?_tag=my_tag&_active=true
export const API_AUCTION_LISTINGS_TAG_ACTIVE = (tag) =>
  `${API_AUCTION_LISTINGS_BASE}?_tag=${encodeURIComponent(tag)}&_active=true`;
