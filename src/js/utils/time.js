export function timeAgo(dateLike) {
  const d = new Date(dateLike);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export function isActive(endsAt) {
  if (!endsAt) return true;
  return new Date(endsAt).getTime() > Date.now();
}
