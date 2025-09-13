// Delay
const DELAY = 1_000;

// Optional overlay while waiting
function showOverlay() {
  if (document.getElementById("navDelayOverlay")) return;
  const el = document.createElement("div");
  el.id = "navDelayOverlay";
  el.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.4);
    display:flex;align-items:center;justify-content:center;
    color:#fff;z-index:999999;font:600 16px system-ui,Segoe UI,Roboto
  `;
  el.innerHTML = `<div>Loading…</div>`;
  document.body.appendChild(el);
}

function clearOverlay() {
  const el = document.getElementById("navDelayOverlay");
  if (el) el.remove();
}

export function installDelayedNavigation() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;

    // don’t interfere with new-tab or external links
    if (
      a.target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const url = new (a.href, location.href)();
    if (url.origin !== location.origin) return;

    e.preventDefault();
    setTimeout(() => {
      window.location.href = a.href;
    }, 80);
  });
}

installDelayedNavigation();
