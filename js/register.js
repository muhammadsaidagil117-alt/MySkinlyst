import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase-init.js";

// REGISTER DENGAN EMAIL & PASSWORD
const form = document.getElementById("registerForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    if (password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      alert("Akun berhasil dibuat! Selamat datang, " + name);
      
      // ✅ PERBAIKAN: Redirect ke root (/) agar tidak 404
      window.location.href = "/";
      
    } catch (err) {
      console.error("Error register:", err);
      // ... error handling tetap sama ...
      alert("Pendaftaran gagal: " + err.message);
    }
  });
}

// REGISTER DENGAN GOOGLE
const btnGoogle = document.getElementById("btnGoogleRegister");
if (btnGoogle) {
  btnGoogle.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      alert("Berhasil daftar dengan Google!");
      
      // ✅ PERBAIKAN: Redirect ke root (/)
      window.location.href = "/";
      
    } catch (err) {
      console.error("Error Google register:", err);
      alert("Pendaftaran dengan Google gagal: " + err.message);
    }
  });
}

console.log("✅ Register JS loaded");
