import { API_AUCTION_LISTING } from "../constants/endpoints.js";
import { headers } from "../constants/header.js";

const urlListing = (id) => API_AUCTION_LISTING(id);

export async function deleteListing(id) {
  const res = await fetch(urlListing(id), {
    method: "DELETE",
    headers: headers(true, true),
  });
  if (res.status === 204) return true;
  if (res.ok) return true;
  const json = await res.json().catch(() => ({}));
  throw new Error(json?.errors?.[0]?.message || "Delete failed");
}
