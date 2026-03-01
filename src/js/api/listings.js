import { headers } from "../constants/header.js";
import {
  API_AUCTION_LISTING,
  API_AUCTION_LISTINGS_BASE,
  API_AUCTION_LISTING_BIDS,
} from "../constants/endpoints.js";

/**
 * Safely parses a fetch Response body as JSON.
 *
 * Reads the response as text first, then attempts JSON.parse.
 * If the body is empty, returns an empty object.
 * If parsing fails, returns an object containing the raw text.
 *
 * @param {Response} res - Fetch response object.
 * @returns {Promise<object>} Parsed JSON object, empty object, or `{ raw: string }` on parse failure.
 */
async function parseJSON(res) {
  const t = await res.text();
  try {
    return t ? JSON.parse(t) : {};
  } catch {
    return { raw: t };
  }
}

/**
 * Fetch a single auction listing by id, including seller and bids.
 *
 * Adds query params:
 * - `_bids=true` to include bids
 * - `_seller=true` to include seller info
 *
 * @param {string|number} id - Listing id.
 * @returns {Promise<object>} Listing data object.
 * @throws {Error} If the request fails or API returns an error message.
 */
export async function getListing(id) {
  const url = `${API_AUCTION_LISTING(id)}?_bids=true&_seller=true`;
  const res = await fetch(url, { headers: headers(false, true) });
  const json = await parseJSON(res);

  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.message || `Failed to fetch listing (${res.status})`
    );
  }

  return json.data;
}

/**
 * Fetch bids for a listing.
 *
 * Internally calls {@link getListing} and returns the `bids` array if present.
 *
 * @param {string|number} id - Listing id.
 * @returns {Promise<Array<object>>} Array of bid objects (empty array if none).
 * @throws {Error} If fetching the listing fails.
 */
export async function getListingBids(id) {
  const item = await getListing(id);
  return Array.isArray(item?.bids) ? item.bids : [];
}

/**
 * Place a bid on a listing.
 *
 * Sends a POST request with body `{ amount: number }`.
 * Ensures amount is converted to a number.
 *
 * @param {string|number} id - Listing id.
 * @param {number|string} amount - Bid amount (will be cast to Number).
 * @returns {Promise<object>} Bid result data from the API.
 * @throws {Error} If the bid fails or API returns an error message.
 */
export async function placeBid(id, amount) {
  const res = await fetch(API_AUCTION_LISTING_BIDS(id), {
    method: "POST",
    headers: headers(true, true),
    body: JSON.stringify({ amount: Number(amount) }),
  });

  const json = await parseJSON(res);

  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.message || `Bid failed (${res.status})`
    );
  }

  return json.data;
}

/**
 * Fetch multiple auction listings.
 *
 * By default includes:
 * - `_seller=true` to include seller info
 * - `_bids=true` to include bids
 *
 * You can override/extend with `params`, e.g. `{ limit: "20", sort: "created" }`.
 *
 * @param {Record<string, string>} [params={}] - Query params for the listings endpoint.
 * @returns {Promise<Array<object>>} Array of listing objects (empty array if API returns non-array data).
 * @throws {Error} If the request fails or API returns an error message.
 */
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

  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.message || `Failed to fetch listings (${res.status})`
    );
  }

  return Array.isArray(json.data) ? json.data : [];
}
