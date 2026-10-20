// Tab Switcher Script for Race Categories
    function switchCategory(cat) {
      document.querySelectorAll('.cat-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.cat-tab').forEach(el => {
        el.className = 'cat-tab bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-sm border border-slate-800 transition';
      });

      document.getElementById(`content-${cat}`).classList.remove('hidden');
      const activeTab = document.getElementById(`tab-${cat}`);
      activeTab.className = 'cat-tab bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition';
    }
 const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAzJi7L_Lg4ifAgRa4CzQdgMjUhyMfFjmTtDNhoTq8SOxSQmn-bRqUzl95eknm7gwY/exec";
    // Backend Lookup Script
    
    document.getElementById('publicSearchForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = document.getElementById('publicSearchInput').value.trim();
      const searchBtn = document.getElementById('publicSearchBtn');

      searchBtn.disabled = true;
      searchBtn.textContent = "Searching Database...";
      hidePortalStatus();

      try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=search&query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status === 'success' && data.runner) {
          const r = data.runner;
          document.getElementById('portalName').textContent = r.fullName;
          document.querySelector('#portalNickname span').textContent = r.nickname || "None";
          document.getElementById('portalCategory').textContent = `${r.category} Category`;
          document.getElementById('portalBib').textContent = r.bibNumber;
          document.getElementById('portalShirt').textContent = r.shirtSize;

          const paymentEl = document.getElementById('portalPayment');
          paymentEl.textContent = r.paymentStatus || "PENDING";
          paymentEl.className = r.paymentStatus === "VERIFIED" ? "font-bold text-blue-400" : "font-bold text-amber-400";

          const claimedEl = document.getElementById('portalClaimed');
          claimedEl.textContent = r.claimed ? "YES" : "NO";
          claimedEl.className = r.claimed ? "font-bold text-blue-400" : "font-bold text-slate-400";
          document.getElementById('portalClaimedLog').textContent = r.claimedTime || "N/A";

          document.getElementById('portalCard').classList.remove('hidden');
        } else {
          document.getElementById('portalCard').classList.add('hidden');
          showPortalStatus("No participant record found matching that Bib, Name, or Nickname.", "bg-slate-900 text-slate-300 border border-slate-800");
        }
      } catch (err) {
        showPortalStatus("Error querying database. Please try again later.", "bg-slate-900 text-slate-300 border border-slate-800");
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Lookup Registration";
      }
    });

    function showPortalStatus(msg, classes) {
      const el = document.getElementById('portalStatus');
      el.className = `text-center text-xs p-3 rounded-lg font-semibold ${classes}`;
      el.textContent = msg;
      el.classList.remove('hidden');
    }

    function hidePortalStatus() {
      document.getElementById('portalStatus').classList.add('hidden');
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });