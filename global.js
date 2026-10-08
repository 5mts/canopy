// Enable <script type="text/canopy"> snippets and window.canopy.on().
//
// Load once in your theme:
//   import '@5mts/canopy/global.js'
// Or use a module script:
//   <script type="module" src=".../@5mts/canopy/global.js"></script>
//
// Page snippets run when their script element appears. Inside a snippet,
// canopy.on() callbacks stop when Grove removes the script from the page.
// Each snippet has its own variables and can appear before this module loads.
//
// window.canopy.on('groveRender', callback) runs on every page. Its action
// names match ready.js functions without the initial "on": groveRender,
// groveElement, groveNavigate. Add {scope: "page"} as the last argument to
// limit callbacks to the current path and query, including return visits.
// Calls made before this module loads need the setup in examples/inline-snippets.md.

import { onGroveRender, onGroveElement, onGroveNavigate } from "./ready.js";

const api = { onGroveRender, onGroveElement, onGroveNavigate };

function resolve(action) {
  const method = api["on" + action[0].toUpperCase() + action.slice(1)];
  if (!method) throw new Error(`[canopy] unknown action: '${action}'`);
  return method;
}

// Read and remove the optional final {scope} argument.
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

// Return the function that stops this callback. Invalid actions throw an error.
function on(action, ...args) {
  if (takeScope(args, "site") === "page") {
    const here = location.pathname + location.search;
    args = args.map(a => typeof a !== "function" ? a : (...xs) => {
      if (location.pathname + location.search === here) return a(...xs);
    });
  }
  return resolve(action)(...args);
}

// Log errors and continue with the remaining queued calls.
function run(entry) {
  try { on(...entry); }
  catch (err) { console.error("[canopy] dropped queued action:", err); }
}

// Page snippets

const seen = new WeakSet();
const records = [];

function execute(el) {
  const record = { el, offs: [], dead: false };
  records.push(record);
  const facade = {
    on: (action, ...args) => {
      if (record.dead) return () => {}; // don't add callbacks after leaving the page
      if (takeScope(args, "page") === "site") return on(action, ...args, { scope: "site" });
      const off = resolve(action)(...args);
      record.offs.push(off);
      return off;
    },
  };
  try {
    // Give each snippet its own variables and page-scoped canopy.on().
    // If the site's Content Security Policy blocks eval, use a plain script
    // with {scope: "page"} instead of text/canopy.
    new Function("canopy", el.textContent)(facade);
  } catch (err) {
    console.error("[canopy] page snippet failed:", err);
  }
}

// Run first so removed snippets stop before their callbacks can run again.
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

// Keep existing references to window.canopy working.
window.canopy = Object.assign(window.canopy ?? {}, { on });

// Run queued calls now and new calls as they arrive.
const queued = Array.isArray(window.canopyActions) ? window.canopyActions : [];
window.canopyActions = { push: (...entries) => entries.forEach(run) };
queued.forEach(run);
