document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("ppList");
  if (!list) return;

  // Helper: escape text (biar aman kalau user ngetik simbol aneh)
  const esc = (str) =>
    String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m]));

  const makeCard = ({ nama, cerita, avatarSrc }) => {
    const card = document.createElement("article");
    card.className = "pp-card";
    card.setAttribute("role", "listitem");
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="pp-avatar" aria-hidden="true">
        <img src="${avatarSrc}" alt="" />
      </div>
      <div>
        <div class="pp-name">${esc(nama)}</div>
        <p class="pp-text">${esc(cerita)}</p>
      </div>
    `;
    return card;
  };

  // 1) Load latest user submission
  const raw = localStorage.getItem("skinlyst_pp_latest");
  if (raw) {
    try {
      const payload = JSON.parse(raw);
      list.appendChild(makeCard({
        nama: payload.nama,
        cerita: payload.cerita,
        avatarSrc: "../assets/image icon pp 1.png",
      }));
    } catch (_) {}
  }

  // 2) Mockup cards (contoh seperti desain)
  const samples = [
    {
      nama: "Irwan",
      cerita:
        "Saya merasa terbantu dengan alur penggunaan MySkinlyst yang praktis. Navigasinya mudah diikuti dan informasi yang diberikan cukup ringkas, sehingga saya bisa langsung tahu langkah perawatan yang sesuai.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
    {
      nama: "Fani",
      cerita:
        "MySkinlyst memberikan pengalaman yang menyenangkan dengan tampilan yang rapi dan mudah dipahami. Saya bisa menemukan informasi perawatan kulit tanpa merasa bingung.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
    {
      nama: "Via",
      cerita:
        "Alur penggunaan yang jelas membuat saya cepat memahami kondisi kulit saya. Rekomendasinya terasa praktis dan bisa langsung diterapkan.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
  ];

  samples.forEach((s) => list.appendChild(makeCard(s)));
});
