# Dropdowns and accordions

`disclosure()` adds a button that opens and closes content. Use it with
the SCSS below; JavaScript alone won't hide anything. Set colors, spacing,
and borders in your theme.

## Dropdown menu

This makes `#sub-nav-menu` a dropdown below 768px. The menu must contain a
`ul`. Put the JavaScript in your theme:

```js
import { onGroveRender } from '@5mts/canopy/ready.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveRender(() => {
  const nav = document.querySelector('#sub-nav-menu');
  if (nav) disclosure(nav, { label: 'Menu', toggleClass: 'my-toggle', panel: 'ul' });
});
```

Add this to your SCSS:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.my-toggle { display: none; }

#sub-nav-menu {
  @media (max-width: 767px) {
    @include disclosure-dropdown('my-toggle') {
      .my-toggle { @include disclosure-glyph; }
      ul {
        flex-direction: column;
        background: white;
      }
    }
  }
}
```

Change `767px` to choose when the dropdown appears. Remove the media query
to use a dropdown at every width. Keep `toggleClass` and the mixin's first
argument identical. Repeated calls update the label without adding another button.

To close the menu on an outside click or Escape, pass
`closeOnOutsideClick: true` and `closeOnEscape: true` to `disclosure()`.

## Collapsible transcript

This example finds a container whose first child is an `h2` containing only
"Transcript". In the CMS, start each transcript with that heading.

```js
import { onGroveElement } from '@5mts/canopy/ready.js';
import { disclosure } from '@5mts/canopy/disclosure.js';

onGroveElement('h2:first-child', (heading) => {
  if (heading.textContent.trim().toLowerCase() !== 'transcript') return;

  const wrapper = heading.parentElement;
  disclosure(wrapper, { label: 'Transcript', toggleClass: 'transcript-toggle' });
  wrapper.classList.add('collapsible-transcript');
});
```

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.collapsible-transcript {
  @include disclosure-accordion('transcript-toggle', $preserve: 'h2');
  .transcript-toggle { @include disclosure-glyph; }
}
```

The heading stays visible when closed. Omit `$preserve: 'h2'` to hide it
with the transcript. The container should hold only the transcript: its
other direct children will also collapse.

## SCSS options

- `disclosure-dropdown($toggle-class, $panel: 'ul', $panel-display: flex)`
  opens the panel as a full-width overlay. If you change `$panel`, change
  the JavaScript `panel` option too.
- `disclosure-accordion($toggle-class, $preserve: ())` hides direct children
  when closed, except the button and any selectors in `$preserve`.
- `disclosure-glyph($closed: '▼', $open: '▲')` adds an open/closed indicator
  to the button.

Browsers without CSS `:has()` support leave the content expanded.
