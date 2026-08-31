// Generic DOM relocation engine.
//
// Register rules that move every element matching `source` into the element
// matching `dest`. Rules are applied when the DOM is ready and re-applied on
// every render and client-side navigation (via onGroveRender), which is what
// makes relocations survive the CMS's forward/back navigation.
//
// Both `source` and `dest` are plain CSS selectors — pass grove('key') at the
// call site when the target is a mapped element.
//
// Contract (SCSS depends on these — do not rename):
//   - moved nodes are stamped `data-fm-relocated` (idempotency marker; also
//     the hook for flash-guard styles that hide a source until it moves)
//   - a destination that received nodes gets the `fm-relocated` class

import { onGroveRender } from "./ready.js";

const rules = [];
let registered = false;

// rule = { source, dest, position = 'beforeend' }
export function relocate(rule) {
  rules.push(rule);
  if (!registered) {
    registered = true; // lazy: importing this module has no side effects
    onGroveRender(applyAll);
  }
}

function applyAll() {
  for (const { source, dest, position = "beforeend" } of rules) {
    const destEl = document.querySelector(dest);
    if (!destEl) continue;
    let moved = false;
    for (const node of document.querySelectorAll(source)) {
      if (node.dataset.fmRelocated) continue;
      node.dataset.fmRelocated = "true";
      destEl.insertAdjacentElement(position, node);
      moved = true;
    }
    if (moved) destEl.classList.add("fm-relocated");
  }
}
