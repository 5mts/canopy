# Relocate — DOM moves that survive navigation

`relocate()` (JS) moves elements to a new home and re-applies the move on
every render and client-side navigation. The `relocate-flash-guard` pattern
mixin is its CSS half: it hides a source until the move happens, so the
element never flashes in its original spot — without risking content loss if
JS fails.

## Minimal usage

```js
import { grove } from '@5mts/canopy/selectors.js';
import { relocate } from '@5mts/canopy/relocate.js';

relocate({ source: grove('podcast-subscribe'), dest: '.my-sidebar-slot', position: 'afterend' });
```

```scss
@use 'pkg:@5mts/canopy' as *;
@use 'pkg:@5mts/canopy/patterns' as *;

@include grove-selector('podcast-subscribe') {
  @include relocate-flash-guard($dest: '.my-sidebar-slot');
}
```

The guard is optional — skip it for moves below the fold where a brief flash
doesn't matter. Use it whenever the move must beat first paint.

## The contract

Moved nodes are stamped `data-fm-relocated`; destinations that received
nodes gain the `fm-relocated` class. The guard keys off the per-element
stamp, which is what makes it navigation-proof: fresh DOM the CMS swaps in
on forward/back starts hidden again and reveals only once relocated. (A
global "js-ready" flag can't do this — it never resets across a client-side
nav.)

## What the mixin owns — the part that's easy to get wrong

- **Destination gate.** With `$dest`, sources hide only when the page
  actually contains a destination (`body:has($dest)`) — no destination means
  no move is coming, so nothing is hidden. Omit `$dest` only if the
  destination exists on every page where the source does.
- **No-JS fallback.** If the script never runs, a delayed reveal animation
  (`$fallback-delay: 5s`) brings the content back instead of losing it.
- **Reduced motion.** The fallback reveal is content recovery, not
  decoration, so it stays — but as a cut rather than a tween.

Tunables: `$fallback-delay: 5s`, `$duration: 0.4s`, `$shift: -0.5rem` (the
slide-in offset). The reveal tweens `height: 0 → auto` via
`interpolate-size: allow-keywords`, set on the element itself; browsers
without support cut instead of tweening.
