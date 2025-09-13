import { headers } from "../constants/header.js";
import {
  API_AUCTION_LISTING,
  API_AUCTION_LISTINGS_BASE,
  API_AUCTION_LISTING_BIDS,
} from "../constants/endpoints.js";

async function parseJSON(res) {
  const t = await res.text();
  try {
    return t ? JSON.parse(t) : {};
  } catch {
    return { raw: t };
  }
}

export async function getListing(id) {
  const url = `${API_AUCTION_LISTING(id)}?_bids=true&_seller=true`;
  const res = await fetch(url, { headers: headers(false, true) });
  const json = await parseJSON(res);
  if (!res.ok)
    throw new Error(
      json?.errors?.[0]?.message || `Failed to fetch listing (${res.status})`
    );
  return json.data;
}

export async function getListingBids(id) {
  const item = await getListing(id);
  return Array.isArray(item?.bids) ? item.bids : [];
}

// Place a bid
export async function placeBid(id, amount) {
  const res = await fetch(API_AUCTION_LISTING_BIDS(id), {
    method: "POST",
    headers: headers(true, true),
    body: JSON.stringify({ amount: Number(amount) }),
  });
  const json = await parseJSON(res);
  if (!res.ok)
    throw new Error(json?.errors?.[0]?.message || `Bid failed (${res.status})`);
  return json.data;
}

export async function getListings(params = {}) {
  const usp = new URLSearchParams({
    _seller: "true",
    _bids: "true",
    ...params,
  });
  const res = await fetch(`${API_AUCTION_LISTINGS_BASE}?${usp.toString()}`, {
    headers: headers(false, true),
  });
  const json = await parseJSON(res);
  if (!res.ok)
    throw new Error(
      json?.errors?.[0]?.message || `Failed to fetch listings (${res.status})`
    );
  return Array.isArray(json.data) ? json.data : [];
}
