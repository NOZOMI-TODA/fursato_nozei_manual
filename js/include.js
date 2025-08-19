// js/include.js — minimal: header/footer include + active-nav only
(function(){
  const VERSION = "20250819f";
  const includes = document.querySelectorAll("[data-include]");
  Promise.all(Array.from(includes).map(async el => {
    const file = el.getAttribute("data-include");
    if(!file) return;
    try{
      const res = await fetch(`${file}?v=${VERSION}`, {cache:"no-store"});
      el.innerHTML = await res.text();
    }catch(e){ console.error("[include]", file, e); }
  })).then(()=>{
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".global-nav a[href]").forEach(a => {
      const target = a.getAttribute("href").split("/").pop();
      if(target === current) a.classList.add("is-active");
    });
  });
})();
