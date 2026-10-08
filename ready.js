// Run code when Grove content loads or changes, including after navigation.
// DOMContentLoaded alone misses content Grove adds later.
// Keep callbacks quick and safe to repeat: check before adding or changing things.

const callbacks = new Set();
let started = false;
let scheduled = false;

// Run callback when the page is ready, content changes, or the URL changes.
// Returns a function that stops the callback.
export function onGroveRender(callback) {
  callbacks.add(callback);
  start();
  schedule();
  return () => callbacks.delete(callback);
}

// Run callback(el) once per matching element, including elements added later.
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

// Run callback(url) on load and when the path or query changes, including Back.
// Ignores hash changes. Content may still be loading; use onGroveElement to
// work with page elements. Returns a function that stops the callback.
export function onGroveNavigate(callback) {
  // Remember only the last URL so returning to a page runs the callback again.
  let last;
  return onGroveRender(() => {
    const url = location.pathname + location.search;
    if (url === last) return;
    last = url;
    callback(url);
  });
}

// Start watching on first use, not on import.
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
  // Also handle Back/Forward and pages restored from the browser's cache.
  window.addEventListener("pageshow", e => { if (e.persisted) schedule(); });
  window.addEventListener("popstate", schedule);
  // These methods fire no event. Watch them in case the URL changes after content.
  for (const method of ["pushState", "replaceState"]) {
    const orig = history[method];
    history[method] = function (...args) {
      const result = orig.apply(this, args);
      schedule();
      return result;
    };
  }
}

function observeBody() {
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
}

// Group changes so callbacks run once per batch.
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
    if (!callbacks.has(callback)) continue; // stopped by an earlier callback
    try {
      callback();
    } catch (err) {
      console.error("[canopy] onGroveRender callback failed:", err);
    }
  }
}
