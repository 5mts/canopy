# Move content

`relocate()` moves matching elements when the page loads and after Grove
updates it. Register each move once in your theme's JavaScript.

## Move the podcast subscribe links

This places the links inside the first `.my-sidebar-slot` element:

```js
import { grove } from '@5mts/canopy/selectors.js';
import { relocate } from '@5mts/canopy/relocate.js';

relocate({ source: grove('podcast-subscribe'), dest: '.my-sidebar-slot' });
```

Use any CSS selector for `source` and `dest`. All matching sources move;
if the destination is missing, they stay where they are.

`position` controls placement:

| Value | Placement |
|---|---|
| `beforeend` (default) | Inside, after existing content |
| `afterbegin` | Inside, before existing content |
| `beforebegin` | Before the destination |
| `afterend` | After the destination |

## Prevent a flash before the move

Optional SCSS hides the source until it moves:

```scss
@use 'pkg:@5mts/canopy' as *;
@use 'pkg:@5mts/canopy/patterns' as *;

@include grove-selector('podcast-subscribe') {
  @include relocate-flash-guard($dest: '.my-sidebar-slot');
}
```

Use the same destination selector in both examples. The source stays visible
on pages without a destination. If JavaScript fails, it reappears after
five seconds.

Options: `$fallback-delay: 5s`, `$duration: 0.4s`, and `$shift: -0.5rem`.
These control the fallback reveal's delay, duration, and vertical movement.
Reduced-motion settings remove the animation, but keep the delayed reveal.

Moved elements get `data-fm-relocated`; destinations get the `fm-relocated`
class. The SCSS uses the attribute to reveal each element after it moves,
including new content loaded during navigation.
