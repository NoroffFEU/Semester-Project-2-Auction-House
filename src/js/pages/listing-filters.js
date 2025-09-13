// /src/js/pages/listing-filters.js
const mount = document.getElementById("filterMount");
const tmpl = document.getElementById("filtersTemplate");

if (mount && tmpl?.content?.firstElementChild) {
  // Clone template and attach
  const node = tmpl.content.firstElementChild.cloneNode(true);
  mount.appendChild(node);

  const form = mount.querySelector("#filtersForm");
  const btnClear = mount.querySelector("#filtersClear");

  function buildParamsFromForm() {
    const fd = new FormData(form);
    const params = {
      _sort: fd.get("_sort") || "created",
      _order: fd.get("_sort") === "endsAt" ? "asc" : "desc",
      _limit: 24,
      _bids: "true",
      _seller: "true",
    };

    const q = (fd.get("q") || "").trim();
    if (q) params.q = q;

    const tag = (fd.get("_tag") || "").trim();
    if (tag) params._tag = tag;

    if (fd.get("_active")) params._active = "true";

    return params;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const params = buildParamsFromForm();
    if (typeof window.__reloadListings === "function") {
      window.__reloadListings(params);
    } else {
      console.warn("__reloadListings is not available yet");
    }
  });

  btnClear.addEventListener("click", () => {
    form.reset();
    if (typeof window.__reloadListings === "function") {
      window.__reloadListings({ _sort: "created", _order: "desc", _limit: 24 });
    }
  });
}
