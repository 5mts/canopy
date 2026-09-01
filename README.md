# @5mts/canopy

Encoded DOM knowledge and opt-in restyling recipes for NPR Grove sites.

Restyling a Grove means fighting selectors you don't control: variant classes that differ by one letter, page context buried in a meta tag, an audio player with an unguessable class name, layouts that flip depending on whether an aside exists. Canopy packages the selectors that are genuinely hard to know — and working recipes for the restyles everyone does — so your theme starts from solved problems.

> Unaffiliated with any Grove vendor. Published by Five Mountains.

## What's in the box

- **The selector map** — unions, composites, and gnarly selectors you shouldn't have to rediscover: `grove('main-with-aside')`, `grove('promo')`, `grove('container-columns')`.
- **Page-context matching** — `grove-page-is('program', 'The Broadside')` scopes styles to a page's program/section/tags without knowing how Grove exposes them.
- **Patterns** (opt-in Sass) — `column-list`, `audio-player-bottom`: whole restyle jobs as one `@include`.
- **JS runtime** — `ready.js` (Grove's answer to DOMContentLoaded), `relocate.js` (move DOM that survives client-side navigation), `disclosure.js` (ARIA dropdown/accordion state), `subnav.js` (section-nav a11y + current-page marking), and the selector map mirrored to JS.

## What's deliberately NOT in the box

Plain readable 1:1 selectors. If Grove calls it `.SocialBar`, write `.SocialBar` — a `grove('social-bar')` key would only obfuscate what you see in the inspector. **The keep-test: a map entry earns its place only if it adds information the raw selector lacks.** The map holds:

| Category | Example |
|---|---|
| Unions | `container-columns` → six container classes |
| Composites by reference | `show-container` → `('podcast-container', 'radio-container')` |
| Gnarly logic | `main-with-aside` → `main:has(~ aside, aside), aside ~ main` |
| Variant-suffix patterns | `promo-title` → `[class^="Promo"][class$="-title"]` |
| Opaque decoders | `audio-player` → `.PH-persistent-player` |

Raw selectors in your theme are normal, not a smell.

## Install

```bash
npm install @5mts/canopy
```

Requires **Dart Sass 1.78+** run with `--pkg-importer=node` (for `pkg:` specifiers).

## Sass usage

```scss
@use 'pkg:@5mts/canopy' as *;            // core: map + functions, zero CSS output

@include grove-selector('promo') {
  background: var(--color-surface);
}

// The canonical example — aside-aware list density, pure library keys:
@include grove-selector('page-is-show-any') {
  @include grove-selector('main-without-aside') { /* 3-col layouts */ }
  @include grove-selector('main-with-aside')    { /* 2-col layouts */ }
}
```

The mixin emits exactly the mapped selector(s) — no implicit scope. Wrap with normal Sass nesting when you need an ancestor.

### Patterns (opt-in, CSS-emitting)

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.ListE-items {
  @include three-column-list;              // responsive promo tiles
}

@include audio-player-bottom($reserve-footer: 50px);  // pin player, pad footer
```

Also in patterns:

- `disclosure-dropdown` / `disclosure-accordion` / `disclosure-glyph` — the structural CSS half of `disclosure.js` ([examples/disclosure.md](examples/disclosure.md))
- `relocate-flash-guard` — the CSS half of `relocate.js` ([examples/relocate.md](examples/relocate.md))
- `sidebar-left` — put the page sidebar on the left; knows Grove's own side-by-side breakpoints, with optional control of stacking below the flip point ([examples/sidebar-left.md](examples/sidebar-left.md))

Nothing emits until you `@include`; importing the core never adds CSS you didn't ask for. Worked recipes live in [examples/](examples/), one feature per file.

### Page context

```scss
$program-is-broadside: grove-page-is('program', 'The Broadside');

#{$program-is-broadside} .my-thing { color: teal; }
```

`grove-page-is($key, $values)` matches the page's context metadata; pass a list of values to match any of them. Known keys: `program`, `category` (= Grove Section), `keywords` (= Grove Tags), `pageType`, `series`. How the page exposes that metadata is canopy's secret — if Grove changes it, your theme doesn't.

### Composites by reference

A map value may be a list of other keys — the blessed way to name a grouping:

```scss
// in the shared map:
show-title: ('podcast-title', 'radio-title'),
```

References resolve at lookup time, so composites track edits to the keys they point at. Name your *site-specific* groupings the same way, in your own variables file — they don't belong in the shared map.

## JavaScript usage

```js
import { grove, groveAll, groveOne } from '@5mts/canopy/selectors.js';
import { onGroveRender, onGroveElement } from '@5mts/canopy/ready.js';
import { relocate } from '@5mts/canopy/relocate.js';
import { disclosure } from '@5mts/canopy/disclosure.js';
import { subnav } from '@5mts/canopy/subnav.js';
```

### ready.js — Grove's answer to DOMContentLoaded

On Grove, `DOMContentLoaded` is not enough: custom elements mount *after* it fires, and the CMS navigates client-side without firing it again. `onGroveRender(cb)` runs your callback once the DOM is ready and **again on every render and client-side navigation** (bfcache restore + history `popstate`). Because it re-fires, your callback must be idempotent. `onGroveElement(selector, cb)` fires once per matching element as it appears. Both lazily start a single shared `MutationObserver` on first use — importing has no side effects.

### relocate.js — DOM moves that survive navigation

```js
relocate({ source: grove('podcast-subscribe'), dest: '.my-sidebar-slot', position: 'afterend' });
```

Moves every `source` match into the `dest` element, re-applied on every render/navigation. Both are plain CSS selectors — use `grove()` when the target is mapped. Contract: moved nodes are stamped `data-fm-relocated` (key flash-guard styles to it), and destinations gain `fm-relocated`. For moves that must beat first paint, the `relocate-flash-guard` pattern mixin hides a source until it moves, with a no-JS fallback reveal — see [examples/relocate.md](examples/relocate.md).

### disclosure.js — dropdown/accordion state

```js
disclosure(container, {
  label: 'Menu',              // toggle text (updated on re-calls)
  toggleClass: 'my-toggle',
  panel: 'ul',                // optional aria-controls target
  closeOnOutsideClick: true,
});
```

Prepends a `<button aria-expanded>` toggle to the container — that's the whole job. JS flips the attribute; **all** visibility is consumer CSS keyed off `[aria-expanded]`. The structural half of that CSS (collapse, overlay, `:has()` reveal, `@supports` gating) ships as the `disclosure-dropdown` / `disclosure-accordion` pattern mixins — see [examples/disclosure.md](examples/disclosure.md). There is deliberately no breakpoint in the API: put the mixin call inside a media query for "dropdown only below N px", or leave it unscoped for "always a dropdown". Idempotent per container — safe inside `onGroveRender`.

### subnav.js — section-nav a11y + current-page marking

```js
const current = subnav(container, { label: 'Section' });
```

One small job: navigation landmark semantics (`role`/`aria-label`, plus the Safari list-role restore) and current-page marking (`aria-current="page"` + a class for your CSS, same-origin links only). Returns the current page's link so you can compose — e.g. label a `disclosure()` toggle with it for a dropdown nav. Call it inside `onGroveRender`. All styling is consumer CSS; see [examples/subnav.md](examples/subnav.md) for the full composition.

## Regenerating selectors.js

`selectors.js` is generated from `_selectors.scss` — never edit it directly. After editing the SCSS map:

```bash
npm run build:selectors
```

`prepublishOnly` regenerates automatically, so the npm tarball always reflects the SCSS source.

## Versioning

- **Patch** (0.x.Y): internal refactor, documentation, no selector changes
- **Minor** (0.X.y): new keys, patterns, or JS capabilities (backward compatible)
- **Major** (X.y.z): existing keys renamed or removed, or selectors changed in ways that may alter theme output

Consumers pin to a minor range (`^0.3.0`) to get additions and fixes automatically, and review before accepting a major bump. Because the map only holds hard-won selectors, additions are deliberate — ask for a key when a selector genuinely passes the keep-test.

## License

MIT
