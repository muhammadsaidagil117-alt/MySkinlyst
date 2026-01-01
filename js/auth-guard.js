import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

onAuthStateChanged(auth, (user) => {
  const isGuest = localStorage.getItem("guest");

  if (!user && !isGuest) {
    window.location.replace("login.html");
  }
});
