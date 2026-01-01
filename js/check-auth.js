import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

// Fungsi untuk check apakah user sudah login
export function checkAuthAndRedirect(targetPage) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      const isGuest = localStorage.getItem("guest");

      if (user || isGuest) {
        // Sudah login, redirect ke target page
        window.location.href = targetPage;
        resolve(true);
      } else {
        // Belum login, redirect ke login
        window.location.href = "login.html";
        resolve(false);
      }
    });
  });
}

// Fungsi untuk check auth tanpa redirect (return boolean)
export function isUserLoggedIn() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      const isGuest = localStorage.getItem("guest");
      resolve(!!(user || isGuest));
    });
  });
}