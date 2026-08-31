# Subnav — section navigation

`subnav()` does one small job on a nav container: landmark a11y and
current-page marking. It returns the current page's link so you can compose
the rest — timing from `ready.js`, the dropdown from `disclosure.js` — with
every piece visible at the call site.

## What subnav() does

- **Landmark semantics** — `role="navigation"` + `aria-label` (skipped when
  the container is a `<nav>` or already labeled), and `role="list"` restored
  on its lists — Safari silently drops the list role under
  `list-style: none`.
- **Current-page marking** — the link whose path matches
  `location.pathname` gets `aria-current="page"` and the `currentClass`
  (default `fm-current`) for your CSS. Same-origin links only, so an
  external link with a colliding path (e.g. `/about`) can't match; trailing
  slashes are insignificant. Returns the first matching link, or null.

## Composed: a sidebar nav that becomes a dropdown

```js
import { onGroveRender } from '@5mts/canopy/ready.js';
import { subnav } from '@5mts/canopy/subnav.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveRender(() => {
  const nav = document.querySelector('#sub-nav-menu');
  if (!nav) return;

  const current = subnav(nav, { 
    label: 'Section',
    currentClass: "current-link"
  });

  disclosure(nav, {
    label: current?.textContent.trim() || 'Section', // trigger shows the current page
    panel: 'ul',
    toggleClass: 'fm-subnav-toggle',
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });
});
```

Skip the `disclosure()` call for a plain, always-expanded nav — `subnav()`
alone is still worth having for the landmark and `aria-current` semantics.

## The CSS side

All visuals are yours — item spacing, separators, the current-link look,
and *when* it's a dropdown:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.fm-subnav-toggle { display: none; }   // hidden outside dropdown mode

#sub-nav-menu {
  a.fm-current { font-weight: bold; }  // your current-page style

  @media (max-width: 767px) {          // when it's a dropdown — your call
    @include disclosure-dropdown('fm-subnav-toggle') {
      .fm-subnav-toggle { @include disclosure-glyph; /* + trigger chrome */ }
      ul { background: white;          /* + panel chrome */ }
    }
  }
}
```

See [disclosure.md](disclosure.md) for what the dropdown mixin owns.
