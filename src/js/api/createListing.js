import { API_AUCTION_LISTINGS_BASE } from "../constants/endpoints.js";
import { headers } from "../constants/header.js"; // uses localStorage token + apiKey

async function parseJSON(res) {
  const t = await res.text();
  try {
    return t ? JSON.parse(t) : {};
  } catch {
    return { raw: t };
  }
}

export async function createListing({
  title,
  description = "",
  tags = [],
  media = [],
  endsAt,
}) {
  if (!title?.trim()) throw new Error("Title is required.");
  if (!endsAt) throw new Error("endsAt is required.");

  const body = { title: title.trim(), description, tags, media, endsAt };

  const res = await fetch(API_AUCTION_LISTINGS_BASE, {
    method: "POST",
    headers: headers(true, true), //
    body: JSON.stringify(body),
  });

  const json = await parseJSON(res);
  if (!res.ok)
    throw new Error(
      json?.errors?.[0]?.message || `Create failed (${res.status})`
    );
  return json.data;
}
