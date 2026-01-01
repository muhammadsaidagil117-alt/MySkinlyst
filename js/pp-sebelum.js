document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ppForm");
  const hint = document.getElementById("ppHint");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("ppNama").value.trim();
    const cerita = document.getElementById("ppCerita").value.trim();

    if (!nama || !cerita) {
      if (hint) hint.textContent = "Mohon isi nama dan cerita terlebih dulu ya 🙂";
      return;
    }

    const payload = {
      nama,
      cerita,
      createdAt: new Date().toISOString(),
    };

    // ✅ Simpan ke localStorage (paling simpel untuk HTML project)
    localStorage.setItem("skinlyst_pp_latest", JSON.stringify(payload));

    // redirect ke halaman setelah
    window.location.href = "pp-sesudah.html";
  });
});
