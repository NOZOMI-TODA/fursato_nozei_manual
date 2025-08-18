// /js/include.js (with CSS injection & mobile toggle)
(function () {
  const VERSION = "20250818"; // 変更時に更新（キャッシュ対策）
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
    // inject header-footer.css once
    (function ensureBrandCSS(){
      const href = "css/header-footer.css";
      const exists = !!document.querySelector(`link[rel="stylesheet"][href^="${href}"]`);
      const inSheets = Array.from(document.styleSheets || []).some(s => s.href && s.href.indexOf(href) !== -1);
      if (!exists && !inSheets) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${href}?v=${VERSION}`;
        document.head.appendChild(link);
      }
    })();

    // active nav
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

    // mobile toggle
    try {
      const toggle = document.querySelector(".nav-toggle");
      const nav = document.querySelector(".global-nav");
      if (toggle && nav) {
        toggle.addEventListener("click", () => {
          const open = nav.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          // animate icon
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
