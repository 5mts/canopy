# Inline snippets — `canopy.on()`

`ready.js` is a module, so out of the box only bundled code can use it. For
JS pasted straight into the CMS — a header/footer HTML slot, a one-off embed —
`global.js` provides a page-global bridge with one call form:

```js
canopy.on("groveRender", () => { /* … */ });
```

Action names are the module exports minus the `on`: `"groveRender"`,
`"groveElement"`, `"groveNavigate"` — and any hook the library adds later,
automatically. An unknown action throws, so typos fail loud.

## The site install (once, in the header)

Two tags, stub first. The stub queues `on()` calls made before the module
loads; it's generic, so it never needs updating when the library grows:

```html
<script>
window.canopy = window.canopy || {
  on: (...args) => (window.canopyActions = window.canopyActions || []).push(args),
};
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@5mts/canopy@0.4.0/global.js"></script>
```

Pin the CDN version; `@latest` means a republish can change every snippet on
the site at once. On a site whose theme already bundles
`import '@5mts/canopy/global.js'`, keep the stub and drop the CDN tag —
loading two copies runs two observers.

## Usage

```html
<script>
canopy.on("groveRender", () => {
  // idempotent — re-fires on every render and client-side navigation
});

canopy.on("groveElement", ".SomeThing", el => {
  // once per matching element
});

canopy.on("groveNavigate", url => {
  // once per URL — hard loads, soft navs, back/forward. Possibly mid-swap
  // on a soft nav: fine for URL-derived work; for element work use
  // groveElement instead
});
</script>
```

After the module loads, `canopy.on()` is the live API and returns an
unsubscribe function (pre-load queued calls can't return one — nothing exists
yet to unsubscribe from).

## The portable form (assumes nothing about the site)

A snippet that must survive being pasted onto a page *without* the header stub
can push the wire format directly — `[action, ...args]` tuples:

```js
(window.canopyActions = window.canopyActions || []).push(["groveRender", () => {
  // …
}]);
```

This is what the stub does internally; both forms feed the same queue. Without
`global.js` on the page at all, pushes queue harmlessly forever; a `canopy.on()`
call without the stub throws `canopy is not defined` — a clear signal the site
install is missing.

## The rules still apply

The bridge changes where callbacks come from, not how they behave:

- **Idempotent** — `groveRender` re-fires constantly. Reconcile against the
  current DOM; never assume one run.
- **No unconditional DOM writes** — the render observer sees your write and
  re-fires you: an unguarded write loops and hangs the page. Guard every
  mutation with a "did I already do this?" check, or use `groveElement`,
  which tracks handled elements for you.
- **Header/footer slots, not page content** — a snippet in CMS *content* runs
  on first load, but client-side navigation won't re-execute it (callbacks it
  already registered do keep firing).

Callback errors are caught and logged per callback (`[canopy] …`), so a broken
snippet can't take down the theme's own enhancements.
