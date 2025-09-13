import { requireAuth } from "../guards/requireAuth.js";
import { deleteListing } from "../api/deleteListing.js";

const deleteBtn = document.getElementById("deleteBtn");
const status = document.getElementById("deleteStatus");

const params = new URLSearchParams(location.search);
const id = params.get("id");

deleteBtn?.addEventListener("click", async () => {
  requireAuth();
  if (!id) {
    status.textContent = "Missing listing id.";
    return;
  }
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    status.textContent = "Deleting…";
    await deleteListing(id);
    status.textContent = "Deleted. Redirecting…";

    setTimeout(() => {
      window.location.href = "/src/pages/setting/auction.html";
    }, 1200);
  } catch (e) {
    console.error(e);
    status.textContent = e.message || "Could not delete listing.";
  }
}); //
