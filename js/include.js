// /js/include.js (v3 - inject brand + manual theme CSS)
(function () {
  const VERSION = "20250818c"; // Update to bust cache
  const includes = document.querySelectorAll("[data-include]");
  const currentPath = location.pathname.split("/").pop() || "index.html";

  document.documentElement.classList.add("inc-loading");

  Promise.all(
    Array.from(includes).map(async (el) => {
      const file = el.getAttribute("data-include");
      if (!file) return;
      try {
        const res = await fetch(`${file}?v=${VERSION}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const html = await res.text();
        el.innerHTML = html;
      } catch (e) {
        console.error(`[include] ${file} の読み込みに失敗:`, e);
      }
    })
  ).then(() => {
    // Inject CSS once (header-footer.css + manual-theme.css)
    function ensureCss(href) {
      const exists = !!document.querySelector(`link[rel="stylesheet"][href^="${href}"]`);
      const inSheets = Array.from(document.styleSheets || []).some(s => s.href && s.href.indexOf(href) !== -1);
      if (!exists && !inSheets) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${href}?v=${VERSION}`;
        document.head.appendChild(link);
      }
    }
    ensureCss("css/header-footer.css");
    ensureCss("css/manual-theme.css");

    // Active nav
    try {
      const navLinks = document.querySelectorAll(".global-nav a[href]");
      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;
        const target = href.split("/").pop();
        if (target === currentPath) a.classList.add("is-active");
      });
    } catch (e) {
      console.warn("active nav error:", e);
    }

    // Mobile toggle
    try {
      const toggle = document.querySelector(".nav-toggle");
      const nav = document.querySelector(".global-nav");
      if (toggle && nav) {
        toggle.addEventListener("click", () => {
          const open = nav.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          const bars = toggle.querySelectorAll(".bar");
          if (bars.length === 3) {
            bars[0].style.top = open ? "19px" : "12px";
            bars[1].style.opacity = open ? "0" : "1";
            bars[2].style.top = open ? "19px" : "26px";
            bars[0].style.transform = open ? "rotate(45deg)" : "none";
            bars[2].style.transform = open ? "rotate(-45deg)" : "none";
          }
        });
      }
    } catch (e) {
      console.warn("toggle nav error:", e);
    } finally {
      document.documentElement.classList.remove("inc-loading");
    }
  });
})();
