// /js/door-visual.js — design-only DOM wrappers (no text edits)
(function(){
  function isHeading(el, level){ return el && el.tagName === `H${level}`; }

  function groupByH2(main){
    if (!main) return;
    if (main.querySelector(".section-block")) return; // already grouped
    const blocks = [];
    const children = Array.from(main.children);
    let i = 0;

    while (i < children.length) {
      const el = children[i];
      if (isHeading(el,2)) {
        const wrapper = document.createElement("section");
        wrapper.className = "section-block";
        // title
        el.classList.add("section-block__title");
        main.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        // move siblings until next H2 or end
        let j = i + 1;
        while (j < children.length && !isHeading(children[j],2)) {
          wrapper.appendChild(children[j]);
          children.splice(j,1); // removed from list
        }
        blocks.push(wrapper);
        // after moving, the next child at index i is the wrapper; advance
        i = children.indexOf(wrapper) + 1;
      } else {
        i++;
      }
    }
    return blocks;
  }

  function columnsForH3(block){
    // Convert multiple H3 sections into 2-column units
    const h3s = Array.from(block.querySelectorAll(":scope > h3"));
    if (h3s.length < 2) return; // only when there are 2+
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
    // Group by H2 without touching text content
    const blocks = groupByH2(main) || Array.from(main.querySelectorAll(".section-block"));

    // For each block, if it contains multiple H3, arrange as columns
    blocks.forEach(columnsForH3);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
