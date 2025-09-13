import {
  API_AUCTION_PROFILE,
  API_AUCTION_PROFILE_LISTINGS,
  API_AUCTION_PROFILE_BIDS,
  API_AUCTION_PROFILE_WINS,
} from "../constants/endpoints.js";
import { headers } from "../constants/header.js";

async function toJson(res, fallbackMsg) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.message || fallbackMsg || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json?.data ?? json;
}

//GET  profiles name
export async function getProfile(name) {
  const r = await fetch(API_AUCTION_PROFILE(name), {
    headers: headers(true, true), // Bearer + API key
    cache: "no-store",
  });
  return toJson(r, "Profile failed");
}

// PUT /auction/profiles/:name

export async function updateProfile(name, payload) {
  const r = await fetch(API_AUCTION_PROFILE(name), {
    method: "PUT",
    headers: headers(true, true),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return toJson(r, "Update profile failed");
}

// GET /auction/profiles/:name/listings

export async function getProfileListings(name) {
  const url = new URL(API_AUCTION_PROFILE_LISTINGS(name));
  url.searchParams.set("_ts", Date.now()); // bust cache
  const r = await fetch(url.toString(), {
    headers: headers(true, true),
    cache: "no-store",
  });
  return toJson(r, "Listings failed");
}

// GET /auction/profiles/:name/bids

export async function getProfileBids(name) {
  const r = await fetch(API_AUCTION_PROFILE_BIDS(name), {
    headers: headers(true, true),
    cache: "no-store",
  });
  return toJson(r, "Bids failed");
}

// GET /auction/profiles/:name/wins

export async function getProfileWins(name) {
  const r = await fetch(API_AUCTION_PROFILE_WINS(name), {
    headers: headers(true, true),
    cache: "no-store",
  });
  return toJson(r, "Wins failed");
}
