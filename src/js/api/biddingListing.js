import { API_AUCTION_LISTING } from "../constants/endpoints.js";
import { headers } from "../constants/header.js";

function urlListing(id) {
  return `${API_AUCTION_LISTING}`;
}

export async function placeBid(id, amount) {
  const res = await fetch(urlListingBids(id), {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ amount: Number(amount) }),
  });
  return toJson(res, "Bid failed");
}
