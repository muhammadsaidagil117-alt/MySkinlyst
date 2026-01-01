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
      nama: "Lia, 27 tahun",
      cerita:
        "Skinlyst membantu saya memahami kondisi kulit dengan lebih jelas. Informasi yang ditampilkan mudah dipahami dan rekomendasinya sesuai kebutuhan kulit saya. Penggunaannya juga sederhana dan nyaman.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
    {
      nama: "Irwan, 32 tahun",
      cerita:
        "Saya merasa terbantu dengan alur penggunaan Skinlyst yang praktis. Navigasinya mudah diikuti dan informasi yang diberikan cukup ringkas, sehingga saya bisa langsung tahu langkah perawatan yang sesuai.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
    {
      nama: "Fani, 24 tahun",
      cerita:
        "Skinlyst memberikan pengalaman yang menyenangkan dengan tampilan yang rapi dan mudah dipahami. Saya bisa menemukan informasi perawatan kulit tanpa merasa bingung.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
    {
      nama: "Via, 21 tahun",
      cerita:
        "Alur penggunaan yang jelas membuat saya cepat memahami kondisi kulit saya. Rekomendasinya terasa praktis dan bisa langsung diterapkan.",
      avatarSrc: "../assets/image icon pp 1.png",
    },
  ];

  samples.forEach((s) => list.appendChild(makeCard(s)));
});
