export function singleUrl(id) {
  const u = new URL("/src/pages/single-listing.html", location.origin);
  u.searchParams.set("id", id);
  return u.href;
}
