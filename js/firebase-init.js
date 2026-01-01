import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxVDqL7eDVnw7CCI-eOvQUf5gVIw8mMB8",
  authDomain: "auth-74799.firebaseapp.com",
  projectId: "auth-74799",
  storageBucket: "auth-74799.firebasestorage.app",
  messagingSenderId: "251437482078",
  appId: "1:251437482078:web:092dde5e86e8d9936334cf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

console.log("✅ Firebase INIT OK");
