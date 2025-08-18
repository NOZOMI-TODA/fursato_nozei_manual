// /js/include.js
(function () {
  const VERSION = "20250818"; // 変更時に更新（キャッシュ対策）
  const includes = document.querySelectorAll("[data-include]");
  const currentPath = location.pathname.split("/").pop() || "index.html";

  // FOUC対策：読み込み完了後に表示
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
    // アクティブメニュー付与（ヘッダー読み込み後）
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
    } finally {
      document.documentElement.classList.remove("inc-loading");
    }
  });
})();
