// window.canopy — the bridge that lets inline <script> snippets use ready.js.
//
// Importing canopy modules never has a side effect; attaching globals IS one,
// so it lives here, opt-in. Two ways onto a page:
//   - bundled:    import '@5mts/canopy/global.js'  (once, in your theme entry)
//   - standalone: <script type="module" src=".../@5mts/canopy/global.js"></script>
//
// The page API is `canopy.on(action, ...args)`, where "groveRender" →
// onGroveRender and so on (strip the `on`, lowercase the first letter). Sites
// paste a tiny header stub (examples/inline-snippets.md) that queues on()
// calls made before this module loads; the stub is generic, so it forwards
// actions added to the library after the stub was deployed. The wire format
// is `window.canopyActions`, an array of [action, ...args] tuples — drained
// here, then replaced with a live shim whose push() runs entries immediately,
// so both the stub and the raw-array portable idiom work before and after
// load. Takeover assigns onto the EXISTING window.canopy object, so
// references captured before this module loaded stay live.

import { onGroveRender, onGroveElement, onGroveNavigate } from "./ready.js";

const api = { onGroveRender, onGroveElement, onGroveNavigate };

// Direct calls fail loud (like grove()'s unknown-key error); returns the
// unsubscribe function from the underlying registration.
function on(action, ...args) {
  const method = api["on" + action[0].toUpperCase() + action.slice(1)];
  if (!method) throw new Error(`[canopy] unknown action: '${action}'`);
  return method(...args);
}

// Queued entries fail soft: one broken snippet must not kill the drain.
function run(entry) {
  try { on(...entry); }
  catch (err) { console.error("[canopy] dropped queued action:", err); }
}

window.canopy = Object.assign(window.canopy ?? {}, { on, ...api });

const queued = Array.isArray(window.canopyActions) ? window.canopyActions : [];
window.canopyActions = { push: (...entries) => entries.forEach(run) };
queued.forEach(run);
