import { signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

/* =========================
   NAVBAR MENU
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const fiturToggle = document.getElementById("fiturToggle");
  const fiturMenu = document.getElementById("fiturMenu");

  if (!menuToggle || !sideMenu) return;

  const closeMenu = () => {
    sideMenu.classList.remove("show");
    if (fiturMenu) fiturMenu.classList.remove("show");
  };

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sideMenu.classList.toggle("show");
  });

  if (fiturToggle && fiturMenu) {
    fiturToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      fiturMenu.classList.toggle("show");
    });
  }

  document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
/* =========================
   TAMPILKAN NAMA PENGGUNA
========================= */
onAuthStateChanged(auth, (user) => {
  const userProfile = document.getElementById("userProfile");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("btnLogout");

  if (!userProfile) return;

  const isGuest = localStorage.getItem("guest");

  if (user) {
    // User login dengan Firebase
    userProfile.style.display = "block";
    userName.textContent = user.displayName || "Pengguna";
    userEmail.textContent = user.email || "";
    if (logoutBtn) logoutBtn.style.display = "block";
  } else if (isGuest) {
    // User login sebagai tamu
    userProfile.style.display = "block";
    userName.textContent = "Tamu";
    userEmail.textContent = "Mode Tamu";
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    // Belum login
    userProfile.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});
/* =========================
   LOGOUT
========================= */
const logoutBtn = document.getElementById("btnLogout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // kalau bukan login tamu → logout Firebase
      if (!localStorage.getItem("guest")) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn("Logout Firebase error (diabaikan):", err);
    }

    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  });
}

/* =========================
   SHOW / HIDE LOGOUT
========================= */
onAuthStateChanged(auth, (user) => {
  if (!logoutBtn) return;

  if (user || localStorage.getItem("guest")) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
});
