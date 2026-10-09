// Move elements selected by `source` to `dest` (inside it by default).
// Runs on load, content changes, and navigation, including Back/Forward.
//
// Both values are CSS selectors; use grove('key') for a mapped Grove selector.
//
// SCSS uses these names; keep them in sync:
//   data-canopy-relocated marks moved elements so they move only once.
//   canopy-relocated marks a destination that received elements.
// CSS can hide elements until data-canopy-relocated is set to prevent a flash.

import { onGroveRender } from "./ready.js";

const rules = [];
let registered = false;

// rule = { source, dest, position = 'beforeend' }
export function relocate(rule) {
  rules.push(rule);
  if (!registered) {
    registered = true; // start watching only when a rule is added
    onGroveRender(applyAll);
  }
}

function applyAll() {
  for (const { source, dest, position = "beforeend" } of rules) {
    const destEl = document.querySelector(dest);
    if (!destEl) continue;
    let moved = false;
    for (const node of document.querySelectorAll(source)) {
      if (node.dataset.canopyRelocated) continue;
      node.dataset.canopyRelocated = "true";
      destEl.insertAdjacentElement(position, node);
      moved = true;
    }
    if (moved) destEl.classList.add("canopy-relocated");
  }
}
