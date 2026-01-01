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

    // Validasi password
    if (password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      // Buat user baru di Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile dengan nama
      await updateProfile(userCredential.user, {
        displayName: name
      });

      alert("Akun berhasil dibuat! Selamat datang, " + name);
      window.location.href = "homepage.html";
      
    } catch (err) {
      console.error("Error register:", err);
      
      // Handle error messages
      if (err.code === "auth/email-already-in-use") {
        alert("Email sudah terdaftar! Silakan login atau gunakan email lain.");
      } else if (err.code === "auth/invalid-email") {
        alert("Format email tidak valid!");
      } else if (err.code === "auth/weak-password") {
        alert("Password terlalu lemah! Gunakan minimal 6 karakter.");
      } else {
        alert("Pendaftaran gagal: " + err.message);
      }
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
      window.location.href = "homepage.html";
      
    } catch (err) {
      console.error("Error Google register:", err);
      alert("Pendaftaran dengan Google gagal: " + err.message);
    }
  });
}

console.log("✅ Register JS loaded");