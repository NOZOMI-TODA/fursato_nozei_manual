// /js/include.js (v3.3) — minimal: header/footer includes only (no CSS injection, no DOM mutation)
(function () {
  const VERSION = "20250819b";
  const includes = document.querySelectorAll("[data-include]");
  Promise.all(Array.from(includes).map(async (el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;
    try {
      const res = await fetch(`${file}?v=${VERSION}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error(`[include] ${file} の読み込みに失敗:`, e);
    }
  }));
})();