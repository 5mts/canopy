# Run JavaScript pasted into the CMS

Grove can change pages without reloading the browser. Canopy runs your code
when the elements it needs appear, including after those page changes.

Your site must load `global.js` once. If it doesn't yet, follow
[site setup](#site-setup).

## Code for one page

Paste this into a page's HTML field. It adds a working "Back to top" button:

```html
<button type="button" class="back-to-top">Back to top</button>
<script type="text/canopy">
  canopy.on('groveElement', '.back-to-top', button => {
    button.addEventListener('click', () => window.scrollTo({ top: 0 }));
  });
</script>
```

Keep `type="text/canopy"`. Canopy runs the script when it appears and stops
its registered callbacks when it leaves the page. Returning to the page
runs a newly inserted script again.

`groveElement` runs once per matching element. Use it for adding buttons,
changing text, or attaching click handlers.

## Code for every page

Use a normal `<script>` in a site-wide header or footer slot:

```html
<script>
  canopy.on('groveElement', '.back-to-top', button => {
    button.addEventListener('click', () => window.scrollTo({ top: 0 }));
  });
</script>
```

This handles each `.back-to-top` button as it appears across page changes.
Include the button HTML wherever you want it. The setup below must come
before site-wide snippets.

## Site setup

Add this once in the site-wide header, before other canopy scripts. Replace
`VERSION` with the published version you want to use.

```html
<script>
window.canopy = window.canopy || {
  on: (...args) => (window.canopyActions = window.canopyActions || []).push(args),
};
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@5mts/canopy@VERSION/global.js"></script>
```

The first script holds calls until canopy loads. Use a fixed version so
updates don't change your site unexpectedly.

If your theme already includes `import '@5mts/canopy/global.js'`, keep the
first script and omit the CDN script. Load `global.js` only once.

Sites whose Content Security Policy blocks `eval` cannot run `text/canopy`
scripts. Use a permitted normal script with `{ scope: 'page' }` instead.
Without `global.js`, `text/canopy` scripts do nothing.

## Choose when code runs

| Action | Runs |
|---|---|
| `groveElement` | Once per element matching your selector |
| `groveRender` | When ready, then after content or navigation changes |
| `groveNavigate` | On load and whenever the path or query changes |

`groveNavigate` ignores hash changes; returning to an earlier URL runs it
again. The new page's elements may not exist yet, so use `groveElement`
when working with them.

With `groveRender`, check before changing text or adding/removing elements.
Those changes trigger another run; repeating them can freeze the page:

```js
canopy.on('groveRender', () => {
  const heading = document.querySelector('#section-title');
  if (heading && heading.textContent !== 'Local news') {
    heading.textContent = 'Local news';
  }
});
```

## Limit a normal script to its current page

Pass `{ scope: 'page' }` last:

```js
canopy.on('groveElement', '.back-to-top', button => {
  button.addEventListener('click', () => window.scrollTo({ top: 0 }));
}, { scope: 'page' });
```

This checks the path and query where the call was made. The callback stays
registered and can run again when you return. In a normal script, calls
apply site-wide unless you add this option. Calls from tag managers, the
console, or other callbacks follow the same rule.

Once canopy has loaded, `canopy.on()` returns a function you can call to
stop that registration. Calls made before it loads can't return this function.

For debugging, look for `[canopy]` errors in the browser console. Check
action names first: unknown names throw an error.
