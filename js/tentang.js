const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");
const fiturToggle = document.getElementById("fiturToggle");
const fiturMenu = document.getElementById("fiturMenu");

menuToggle.onclick = () => {
  sideMenu.style.display =
    sideMenu.style.display === "block" ? "none" : "block";
};

fiturToggle.onclick = () => {
  fiturMenu.style.display =
    fiturMenu.style.display === "block" ? "none" : "block";
};
