# Inline snippets — `text/canopy` page scripts + `canopy.on()`

`ready.js` is a module, so out of the box only bundled code can use it.
`global.js` brings its hooks to JS pasted into the CMS, in three tiers —
each with exactly the ceremony it needs.

Action names are the module exports minus the `on`: `"groveRender"`,
`"groveElement"`, `"groveNavigate"` — and any hook the library adds later,
automatically. Unknown actions throw, so typos fail loud.

## Tier 1 — page snippets: `<script type="text/canopy">`

For a snippet pasted into ONE page's content that should behave like it
would on a normal website — affect that page, and only that page:

```html
<script type="text/canopy">
  canopy.on("groveElement", ".EplB-header", el => {
    // once per matching element, on this page only
  });
</script>
```

No stub, no load-order concern, no scope options. The unknown `type` makes
the browser ignore the element; canopy executes it instead — **once each
time the element appears**, so first loads, soft-nav arrivals, and soft-nav
returns all behave identically (each run gets a fresh scope). When Grove
swaps the content away, every registration the run made is torn down. The
`canopy` inside is provided by the runtime, bound to that page-visit — safe
to use even in async code within the snippet.

Caveats: the runtime compiles these with `new Function`, so a CSP that
blocks eval rules them out (use tier 2 with `{scope: "page"}` there); and a
page snippet only works on sites where `global.js` is installed — on others
it is inert markup, visible in source.

## Tier 2 — site-wide snippets: header/footer slots

A snippet in a site-wide CMS slot executes once per browsing session, not
per page — so its registrations are deliberately persistent: they keep
firing across client-side navigations, which is what "run on every page"
requires. These use plain `<script>` plus the queue idiom.

**The site install** (once, stub first — it queues `on()` calls made before
the module loads and is generic, so it never needs updating):

```html
<script>
window.canopy = window.canopy || {
  on: (...args) => (window.canopyActions = window.canopyActions || []).push(args),
};
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@5mts/canopy@0.4.0/global.js"></script>
```

Pin the CDN version; `@latest` means a republish can change every snippet
on the site at once. On a site whose theme already bundles
`import '@5mts/canopy/global.js'`, keep the stub and drop the CDN tag —
loading two copies runs two observers. (The install also activates tier 1.)

**Usage** — same actions, persistent by default:

```html
<script>
canopy.on("groveRender", () => { /* every page, every render */ });
</script>
```

## Tier 3 — programmatic callers

Code with no script tag of its own — tag-manager custom HTML, the browser
console, registrations made from inside callbacks. Same API as tier 2;
registrations persist. Two extras:

- `{scope: "page"}` as a last argument guards a registration to the URL it
  was made under — a permanent filter, not an unsubscribe, so navigating
  back re-applies it. (This is also the no-eval fallback for tier 1.)
- The raw wire form needs no stub at all and queues harmlessly forever if
  `global.js` never loads:

  ```js
  (window.canopyActions = window.canopyActions || []).push(["groveRender", () => { /* … */ }]);
  ```

`canopy.on()` returns an unsubscribe function once the module is loaded
(queued calls can't return one — nothing exists yet to unsubscribe from).

## The rules still apply

The bridge changes where callbacks come from, not how they behave:

- **Idempotent** — `groveRender` re-fires constantly. Reconcile against the
  current DOM; never assume one run.
- **No unconditional DOM writes** — the render observer sees your write and
  re-fires you: an unguarded write loops and hangs the page. Guard every
  mutation with a "did I already do this?" check, or use `groveElement`,
  which tracks handled elements for you.

Errors are isolated per snippet and per callback (`[canopy] …` in the
console), so a broken snippet can't take down the theme's own enhancements.
