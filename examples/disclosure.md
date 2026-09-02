# Disclosure — dropdown & accordion

`disclosure()` (JS) prepends a `<button aria-expanded>` toggle and flips the
attribute — that's its whole job. The `disclosure-dropdown` /
`disclosure-accordion` pattern mixins are the structural CSS that acts on it.
Together they make a complete, accessible widget that survives Grove's
client-side navigation; your theme adds only the look.

## Minimal dropdown

A sidebar nav that becomes a dropdown below tablet width:

```js
import { onGroveRender } from '@5mts/canopy/ready.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveRender(() => {
  const nav = document.querySelector('#sub-nav-menu');
  if (nav) disclosure(nav, { label: 'Menu', toggleClass: 'my-toggle', panel: 'ul' });
});
```

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.my-toggle { display: none; }        // hidden outside dropdown mode

#sub-nav-menu {
  @media (max-width: 767px) {        // when it's a dropdown — your call
    @include disclosure-dropdown('my-toggle') {
      .my-toggle { @include disclosure-glyph; /* + your trigger chrome */ }
      ul { background: white;        /* + your panel chrome */ }
    }
  }
}
```

There is deliberately no breakpoint in either API: the media query above is
the only place "below tablet" exists. Leave it unscoped for an always-on
dropdown.

## Minimal accordion

Collapse a wrapper's content in place (e.g. a transcript) behind a toggle:

```js
disclosure(wrapper, { label: 'Transcript', toggleClass: 'my-toggle' });
```

```scss
.my-wrapper {
  @include disclosure-accordion('my-toggle', $preserve: 'h2');
  .my-toggle { @include disclosure-glyph; }
}
```

`$preserve` lists selectors to spare from the collapse — here the wrapper's
heading stays in the accessibility tree (visually hide it yourself if the
toggle replaces it on screen).

### Applied: collapsing a transcript

Let's say you want to collapse transcripts. You could establish a convention
that transcripts are a module (say, a Rich Text Module) that start with a
heading with only the word "Transcript". Then you could detect that element
and turn it into an accordion:

```js
import { onGroveElement } from '@5mts/canopy/ready.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveElement('h2:first-child', (h2) => {
  if (h2.textContent.trim().toLowerCase() !== 'transcript') return; // site convention

  disclosure(h2.parentElement, { label: 'Transcript', toggleClass: 'my-toggle' });
  h2.parentElement.classList.add('my-wrapper');
});
```

The selector does the structural work: `:first-child` means "leads its
wrapper", and because `disclosure()` prepends the toggle button, a built
wrapper's heading is no longer `:first-child` — so re-runs and re-rendered
DOM can't match twice. Only the text convention needs JS (CSS has no
`:contains`).

The SCSS is the accordion above verbatim — `$preserve: 'h2'` exists for
exactly this: the toggle replaces the heading visually, but the h2 stays in
the accessibility tree.

## What the mixins own — the part that's easy to get wrong

- `disclosure-dropdown($toggle-class, $panel: 'ul', $panel-display: flex)` —
  hides the panel and reveals it as a full-width overlay via `:has()`.
  Because the panel is hidden unconditionally (fail-closed), the whole
  mechanism sits behind an `@supports selector(:has(*))` gate: old browsers
  keep a plain expanded menu instead of an unreachable one. Your `@content`
  is emitted inside that gate, so dropdown-mode brand styles never leak to
  browsers where the dropdown can't work.
- `disclosure-accordion($toggle-class, $preserve: ())` — collapses the
  container's direct children while the toggle is closed. Fail-open (the
  collapse itself lives inside `:has()`), so no gate is needed.
- `disclosure-glyph($closed: '▼', $open: '▲')` — the open/closed indicator,
  using `content` alt-text syntax so the glyph stays out of the button's
  accessible name.

Everything else — trigger chrome, panel background/shadow, spacing, and
*when* the mechanism applies — is deliberately yours.
