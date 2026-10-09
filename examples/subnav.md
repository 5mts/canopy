# Section navigation

`subnav()` labels a menu for screen readers and marks the current page's
link. Use it with `disclosure()` for a dropdown on small screens.

## JavaScript

This expects a menu container with `id="sub-nav-menu"` and a `ul` of links.
Add it to your theme's JavaScript:

```js
import { onGroveRender } from '@5mts/canopy/ready.js';
import { subnav } from '@5mts/canopy/subnav.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveRender(() => {
  const nav = document.querySelector('#sub-nav-menu');
  if (!nav) return;

  const current = subnav(nav, { label: 'Section', currentClass: 'current-link' });

  disclosure(nav, {
    label: current?.textContent.trim() || 'Section',
    panel: 'ul',
    toggleClass: 'section-toggle',
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });
});
```

The button shows the current page's link text, or "Section" if no link
matches. Remove the `disclosure()` call and import for an expanded menu.

## SCSS

This bolds the current link and turns the menu into a dropdown below 768px:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.section-toggle { display: none; }

#sub-nav-menu {
  a.current-link { font-weight: bold; }

  @media (max-width: 767px) {
    @include disclosure-dropdown('section-toggle') {
      .section-toggle { @include disclosure-glyph; }
      ul {
        flex-direction: column;
        background: white;
      }
    }
  }
}
```

Change the width, colors, and spacing for your site. More options:
[dropdowns and accordions](disclosure.md).

## Current-page and accessibility details

- Matching links get `aria-current="page"` and `currentClass` (default:
  `canopy-current`). Links must be on the same site. Matching ignores query
  strings, hashes, and trailing slashes.
- `subnav()` returns the first matching link, or `null`.
- It adds a navigation role and label where needed, and preserves an
  existing `aria-label`. Pass a container around the list, such as a `nav`
  or `div`; a bare `ul` or `ol` won't get a navigation role or label.
- Lists get `role="list"` so Safari recognizes them when bullets are hidden.
