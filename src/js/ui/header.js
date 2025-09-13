// src/js/ui/header.js
import { getToken, getProfileName } from "../utils/storage.js";
import { setupLogout } from "../pages/auth/logout.js";
import { startInactivityWatcher } from "../utils/session.js";
import "../utils/navigation-delay.js";

const headerEl = document.getElementById("siteHeader");

function loggedInNav(username = "User") {
  return `
  <nav class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-24 items-center">
      <div class="ml-4 flex lg:ml-0">
        <a href="/index.html">
          <img src="/src/assets/images/logoAuction.png" class="h-24 w-auto" alt="Auction Logo"/>
        </a>
      </div>
      <div class="ml-auto flex items-center">
        <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
          <a href="/index.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Auction</a>
          <a href="/src/pages/setting/auction.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">MyListing</a>
          <a href="/src/pages/setting/bidding.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Bidding</a>
          <a href="/src/pages/create.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Create Listing</a>
        </div>
        <div class="ml-6 flex items-center gap-4">
          <a href="/src/pages/profile.html" class="text-sm font-medium text-gray-600">Hi, ${username}</a>
          <button id="logoutBtn" class="text-sm font-medium text-gray-700 hover:text-amber-800">Logout</button>
        </div>
      </div>
    </div>
  </nav>`;
}

const loggedOutNav = `
  <nav class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-24 items-center">
      <div class="ml-4 flex lg:ml-0">
        <a href="/index.html">
          <img src="/src/assets/images/logoAuction.png" class="h-24 w-auto" alt="Auction Logo"/>
        </a>
      </div>
      <div class="ml-auto flex items-center">
        <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
          <a href="/index.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Auction</a>
          <a href="/src/pages/login.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Listing</a>
          <a href="/src/pages/login.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Bidding</a>
          <a href="/src/pages/login.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Create Listing</a>
        </div>
        <div class="ml-6 flow-root lg:ml-8  items-center gap-4">
          <a href="/src/pages/register.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Register</a>
          <a href="/src/pages/login.html" class="text-sm font-medium text-gray-700 hover:text-amber-800">Login</a>
        </div>
      </div>
    </div>
  </nav>
`;

(function renderHeader() {
  if (!headerEl) return;
  const token = getToken();
  if (token) {
    headerEl.innerHTML = loggedInNav(getProfileName() || "User");
    setupLogout("logoutBtn");
    startInactivityWatcher(30 * 60 * 1000);
  } else {
    headerEl.innerHTML = loggedOutNav;
  }
})();
