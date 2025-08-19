// /js/door-visual.js v1.1 — design-only DOM wrappers + H1 insertion (no text edits except requested H1)
(function(){
  function isHeading(el, level){ return el && el.tagName === `H${level}`; }

  // Add H1 if missing (page-specific mapping)
  const FILE = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const H1_MAP = {
    "product_register.html": "商品登録・在庫更新マニュアル"
    // 他ページにも必要ならここに追加
    // "order_manual.html": "受注・出荷指示マニュアル",
    // "shipment_manual.html": "出荷・納品マニュアル",
  };

  function ensureH1(main){
    if (!main) return;
    if (main.querySelector("h1")) return; // already has H1
    const title = H1_MAP[FILE];
    if (!title) return;
    const h1 = document.createElement("h1");
    h1.className = "page-title";
    h1.textContent = title;
    const bc = main.querySelector(".breadcrumb");
    if (bc && bc.parentNode === main) {
      bc.insertAdjacentElement("afterend", h1);
    } else {
      main.insertAdjacentElement("afterbegin", h1);
    }
  }

  function groupByH2(main){
    if (!main) return;
    if (main.querySelector(".section-block")) return; // already grouped
    const children = Array.from(main.children);
    let i = 0;
    while (i < children.length) {
      const el = children[i];
      if (isHeading(el,2)) {
        const wrapper = document.createElement("section");
        wrapper.className = "section-block";
        el.classList.add("section-block__title");
        main.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        // move siblings until next H2 or end
        let j = i + 1;
        while (j < children.length && !isHeading(children[j],2)) {
          wrapper.appendChild(children[j]);
          children.splice(j,1);
        }
        i = children.indexOf(wrapper) + 1;
      } else {
        i++;
      }
    }
  }

  function columnsForH3(block){
    const h3s = Array.from(block.querySelectorAll(":scope > h3"));
    if (h3s.length < 2) return;
    const cols = document.createElement("div");
    cols.className = "cols-2";
    block.appendChild(cols);

    for (let k = 0; k < h3s.length; k++) {
      const h3 = h3s[k];
      const unit = document.createElement("article");
      unit.className = "unit";
      const head = h3.cloneNode(true);
      head.classList.add("unit-head");
      unit.appendChild(head);
      const body = document.createElement("div");
      body.className = "unit-body";
      unit.appendChild(body);
      // move content nodes from after original h3 until next h3 or end of block
      let n = h3.nextSibling;
      while (n && !(n.nodeType === 1 && n.tagName === "H3")) {
        const next = n.nextSibling;
        body.appendChild(n);
        n = next;
      }
      cols.appendChild(unit);
      h3.remove();
    }
  }

  function run(){
    const main = document.querySelector("main");
    if (!main) return;
    ensureH1(main);            // Add H1 if missing (per request)
    groupByH2(main);           // Group sections by H2
    const blocks = Array.from(main.querySelectorAll(".section-block"));
    blocks.forEach(columnsForH3); // Make H3 groups two-column
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
