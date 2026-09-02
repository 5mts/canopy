// The inline-snippet runtime: page snippets via <script type="text/canopy">,
// plus the window.canopy bridge for site-wide and programmatic callers.
//
// Importing canopy modules normally has no side effect; this module is the
// deliberate exception — it attaches the globals and starts watching for
// page snippets. Two ways onto a page:
//   - bundled:    import '@5mts/canopy/global.js'  (once, in your theme entry)
//   - standalone: <script type="module" src=".../@5mts/canopy/global.js"></script>
//
// PAGE SNIPPETS — <script type="text/canopy"> in page content. The unknown
// type makes the browser ignore the element; this module executes it instead,
// once each time such an element appears (first load, soft-nav arrivals, and
// soft-nav returns all behave alike — MPA semantics). Each run gets its own
// function scope and a `canopy` binding whose on() ties registrations to that
// element's lifetime: when the element leaves the DOM (Grove swapped the
// content away), they are unsubscribed. No stub, no load-order concern —
// the snippet only ever runs because this module ran it.
//
// SITE-WIDE / PROGRAMMATIC CALLERS — window.canopy.on(action, ...args),
// where "groveRender" → onGroveRender and so on (strip the `on`, lowercase
// the first letter). Registrations persist across navigations — what a
// header/footer-slot script needs, since it executes once per session. Pass
// {scope: "page"} as a last argument to guard a registration to the URL it
// was made under (a permanent filter, not an unsubscribe, so soft-navving
// back re-applies it). Sites paste a tiny generic header stub
// (examples/inline-snippets.md) that queues on() calls made before this
// module loads; the wire format is `window.canopyActions`, an array of
// [action, ...args] tuples — drained here, then replaced with a live shim
// whose push() runs entries immediately. Takeover assigns onto the EXISTING
// window.canopy object, so early-captured references stay live.

import { onGroveRender, onGroveElement, onGroveNavigate } from "./ready.js";

const api = { onGroveRender, onGroveElement, onGroveNavigate };

function resolve(action) {
  const method = api["on" + action[0].toUpperCase() + action.slice(1)];
  if (!method) throw new Error(`[canopy] unknown action: '${action}'`);
  return method;
}

// Shared by both call paths: peel a trailing {scope} option off the args.
function takeScope(args, fallback) {
  let scope = fallback;
  if (args.length && typeof args[args.length - 1] === "object") {
    scope = args.pop().scope ?? fallback;
  }
  if (scope !== "page" && scope !== "site") {
    throw new Error(`[canopy] unknown scope: '${scope}' (use "page" or "site")`);
  }
  return scope;
}

// Direct calls fail loud (like grove()'s unknown-key error); returns the
// unsubscribe function from the underlying registration.
function on(action, ...args) {
  if (takeScope(args, "site") === "page") {
    const here = location.pathname + location.search;
    args = args.map(a => typeof a !== "function" ? a : (...xs) => {
      if (location.pathname + location.search === here) return a(...xs);
    });
  }
  return resolve(action)(...args);
}

// Queued entries fail soft: one broken snippet must not kill the drain.
function run(entry) {
  try { on(...entry); }
  catch (err) { console.error("[canopy] dropped queued action:", err); }
}

// --- page-snippet runtime ---------------------------------------------------

const seen = new WeakSet();
const records = [];

function execute(el) {
  const record = { el, offs: [], dead: false };
  records.push(record);
  const facade = {
    on: (action, ...args) => {
      if (record.dead) return () => {}; // page already left; don't leak
      if (takeScope(args, "page") === "site") return on(action, ...args, { scope: "site" });
      const off = resolve(action)(...args);
      record.offs.push(off);
      return off;
    },
  };
  try {
    // own function scope per run (fresh consts, MPA-like), `canopy` bound to
    // the facade so even async calls inside stay tied to this page-visit.
    // Needs eval permission; a CSP that blocks it rules out text/canopy
    // snippets — use a plain script with {scope: "page"} there instead.
    new Function("canopy", el.textContent)(facade);
  } catch (err) {
    console.error("[canopy] page snippet failed:", err);
  }
}

// Registered before any snippet callback so that, within a single render
// pass, teardown of departed snippets wins over their pending callbacks.
onGroveRender(() => {
  for (const el of document.querySelectorAll('script[type="text/canopy"]')) {
    if (seen.has(el)) continue;
    seen.add(el);
    execute(el);
  }
  for (let i = records.length - 1; i >= 0; i--) {
    if (!records[i].el.isConnected) {
      records[i].dead = true;
      records[i].offs.forEach(off => off());
      records.splice(i, 1);
    }
  }
});

// --- takeover ----------------------------------------------------------------

window.canopy = Object.assign(window.canopy ?? {}, { on });

const queued = Array.isArray(window.canopyActions) ? window.canopyActions : [];
window.canopyActions = { push: (...entries) => entries.forEach(run) };
queued.forEach(run);
