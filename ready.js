// Grove's answer to DOMContentLoaded.
//
// On Grove, DOMContentLoaded is not enough: custom elements mount *after* it
// fires, and the CMS navigates client-side without firing it again. This module
// runs your code once the DOM is ready and AGAIN on every render and every
// client-side navigation (bfcache restore + history popstate).
//
// Because it re-fires, your callback MUST be idempotent and cheap — reconcile
// against the current DOM rather than assuming it runs once.

const callbacks = new Set();
let started = false;
let scheduled = false;

// Run `callback` once the DOM is ready, then again on every render and every
// client-side navigation. Returns an unsubscribe function.
export function onGroveRender(callback) {
  callbacks.add(callback);
  start();
  schedule();
  return () => callbacks.delete(callback);
}

// Convenience over onGroveRender: run `callback(el)` once for each element
// matching `selector` as it appears — on first render and after navigations
// that swap in fresh DOM. Already-handled elements are skipped.
export function onGroveElement(selector, callback) {
  const seen = new WeakSet();
  return onGroveRender(() => {
    for (const el of document.querySelectorAll(selector)) {
      if (seen.has(el)) continue;
      seen.add(el);
      callback(el);
    }
  });
}

// Start the single shared observer + navigation listeners, lazily on first use
// so that importing the module has no side effects.
function start() {
  if (started) return;
  started = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      observeBody();
      schedule();
    }, { once: true });
  } else {
    observeBody();
  }
  // The CMS navigates client-side without re-running scripts; these are the
  // events that still fire on forward/back.
  window.addEventListener("pageshow", e => { if (e.persisted) schedule(); });
  window.addEventListener("popstate", schedule);
}

function observeBody() {
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
}

// Coalesce bursts of mutations into a single pass per microtask.
function schedule() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    runAll();
  });
}

function runAll() {
  if (document.readyState === "loading") return; // wait until the DOM is ready
  for (const callback of [...callbacks]) {
    try {
      callback();
    } catch (err) {
      console.error("[canopy] onGroveRender callback failed:", err);
    }
  }
}
