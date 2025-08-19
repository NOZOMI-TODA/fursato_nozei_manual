// /js/include.js (v3.2) — safe loader: header/footer includes + CSS ensure only
(function () {
  const VERSION = "20250819a"; // cache buster
  const includes = document.querySelectorAll("[data-include]");
  const currentPath = location.pathname.split("/").pop() || "index.html";

  // Inject CSS (idempotent)
  function ensureCss(href) {
    if (document.querySelector(`link[rel="stylesheet"][href*="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${href}?v=${VERSION}`;
    document.head.appendChild(link);
  }
  ensureCss("css/header-footer.css");
  ensureCss("css/manual-theme.css");
  ensureCss("css/door-hotfix.css");

  // Load includes
  Promise.all(Array.from(includes).map(async (el) => {
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
  })).then(() => {
    // Mark active nav
    try {
      const navLinks = document.querySelectorAll(".global-nav a[href]");
      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;
        const target = href.split("/").pop();
        if (target === currentPath) a.classList.add("is-active");
      });
    } catch (e) {}
  });
})();