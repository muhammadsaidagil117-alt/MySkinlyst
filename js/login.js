import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase-init.js";

// LOGIN EMAIL
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "homepage.html";
    } catch (err) {
      alert("Login gagal: " + err.message);
    }
  });
}

// LOGIN GOOGLE
const btnGoogle = document.getElementById("btnGoogleLogin");
if (btnGoogle) {
  btnGoogle.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "homepage.html";
    } catch (err) {
      alert("Login Google gagal: " + err.message);
    }
  });
}

// LOGIN TAMU (TANPA FIREBASE)
const btnGuest = document.getElementById("btnGuestLogin");
if (btnGuest) {
  btnGuest.addEventListener("click", () => {
    localStorage.setItem("guest", "true");
    window.location.href = "homepage.html";
  });
}
