// Hasil Kulit pages (dry / normal / oily)
// - Navbar/side-menu behavior is handled by navbar-footer.js
// - This file only handles tab switching

document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".tabcontent"));

  if (!tabs.length || !panels.length) return;

  const showPanel = (id) => {
    panels.forEach((p) => {
      p.style.display = (p.id === id) ? "block" : "none";
    });
  };

  // Initial state: show the active tab's panel (or fallback to first)
  const activeTab = tabs.find((t) => t.classList.contains("active")) || tabs[0];
  tabs.forEach((t) => t.classList.remove("active"));
  activeTab.classList.add("active");
  showPanel(activeTab.dataset.tab);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showPanel(tab.dataset.tab);
    });
  });
});
