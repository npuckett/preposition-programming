export function initShell() {
  const toggle = document.querySelector(".mobile-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("is-open");
      overlay?.classList.toggle("is-visible");
      toggle.setAttribute(
        "aria-expanded",
        sidebar.classList.contains("is-open")
      );
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      toggle?.setAttribute("aria-expanded", "false");
    });
  }

  highlightActiveLink();
}

function highlightActiveLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu-item").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop();
    link.classList.toggle("active", linkPath === path);
  });
}

document.addEventListener("DOMContentLoaded", initShell);
