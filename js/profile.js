import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

// Sample history data (nanti bisa diganti dengan data dari Firebase/localStorage)
const sampleHistory = [
  { date: "12 Desember 2025", type: "Berminyak", icon: "🔍" },
  { date: "11 Desember 2025", type: "Kering", icon: "🔍" },
  { date: "10 Desember 2025", type: "Sensitif", icon: "🔍" }
];

onAuthStateChanged(auth, (user) => {
  const isGuest = localStorage.getItem("guest");

  if (!user && !isGuest) {
    window.location.href = "login.html";
    return;
  }

  // Update profile information
  updateProfileInfo(user, isGuest);
  
  // Load history
  loadHistory();
});

function updateProfileInfo(user, isGuest) {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileAvatar = document.getElementById("profileAvatar");
  const accountStatus = document.getElementById("accountStatus");
  const totalScans = document.getElementById("totalScans");
  const joinDate = document.getElementById("joinDate");

  if (user) {
    // User login dengan Firebase
    const displayName = user.displayName || "Pengguna";
    const email = user.email || "";
    
    profileName.textContent = displayName;
    profileEmail.textContent = email;
    profileAvatar.textContent = displayName.charAt(0).toUpperCase();
    accountStatus.textContent = "Akun Terverifikasi";
    
    // Format join date
    if (user.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      joinDate.textContent = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  } else if (isGuest) {
    // User login sebagai tamu
    profileName.textContent = "Pengguna Tamu";
    profileEmail.textContent = "Mode Tamu - Data tidak tersimpan permanen";
    profileAvatar.textContent = "T";
    accountStatus.textContent = "Mode Tamu";
    joinDate.textContent = "Sesi Saat Ini";
  }

  // Get scan count from localStorage
  const scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
  totalScans.textContent = scanHistory.length;
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  
  // Get history from localStorage
  let history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
  
  // Jika tidak ada history, gunakan sample data
  if (history.length === 0) {
    history = sampleHistory;
  }

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        <p>Belum ada riwayat analisis</p>
        <button class="btn-primary" onclick="window.location.href='scan.html'">
          Mulai Analisis Pertama
        </button>
      </div>
    `;
    return;
  }

  historyList.innerHTML = history.map((item, index) => `
    <div class="history-item" onclick="viewHistoryDetail(${index})">
      <div class="history-icon">${item.icon || "🔍"}</div>
      <div class="history-info">
        <div class="history-date">${item.date}</div>
        <div class="history-type">Jenis Kulit: ${item.type}</div>
      </div>
    </div>
  `).join("");
}

// Function to view history detail (bisa dikembangkan lebih lanjut)
window.viewHistoryDetail = function(index) {
  const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
  const item = history[index] || sampleHistory[index];
  
  if (item) {
    // Redirect ke halaman hasil berdasarkan tipe kulit
    const skinType = item.type.toLowerCase();
    let resultPage = "results-normal.html";
    
    if (skinType.includes("berminyak") || skinType.includes("oily")) {
      resultPage = "results-oily.html";
    } else if (skinType.includes("kering") || skinType.includes("dry")) {
      resultPage = "results-dry.html";
    } else if (skinType.includes("normal")) {
      resultPage = "results-normal.html";
    }
    
    window.location.href = resultPage;
  }
};

console.log("✅ Profile.js loaded");