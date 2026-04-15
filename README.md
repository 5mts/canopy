# @5mts/understory-styling

A Sass adapter for NPR Grove. Instead of hard-coding class names across your theme files, consume them through this package's semantic map. When Grove renames a class, you update this package — not your theme.

> Unaffiliated with any Grove vendor. Published by Five Mountains.

## Install

```bash
npm install @5mts/understory-styling
```

Requires **Dart Sass 1.78+** (for `pkg:` specifier support).

## Usage

```scss
@use 'pkg:@5mts/understory-styling' as *;

@include grove-selector('promo') {
  background: var(--color-surface);
  padding: 1rem;
}

@include grove-selector('audio-player') {
  position: fixed;
  bottom: 0;
}
```

Compiles to:

```css
body .ps-promo { background: var(--color-surface); padding: 1rem; }
body .PH-persistent-player { position: fixed; bottom: 0; }
```

## Configuration

### Override the root scope

Every selector is prefixed with `body` by default. Override at import time:

```scss
@use 'pkg:@5mts/understory-styling' with (
  $general-scope: 'body.theme-v2'
) as *;
```

### Apply a body-class modifier per call

```scss
@include grove-selector('audio-player', '.has-player') {
  bottom: 80px;
}
// → body.has-player .PH-persistent-player { ... }
```

The modifier can chain multiple classes: `'.has-player.is-playing'`.

### Extend with site-specific selectors

If your Grove has per-site additions that aren't in the shared map:

```scss
@use 'pkg:@5mts/understory-styling' with (
  $grove-selectors-extensions: (
    station-ticker: '.my-site-ticker',
    donate-banner:  '.my-site-donate'
  )
) as *;

@include grove-selector('station-ticker') {
  background: gold;
}
```

Extensions override base entries on key collision — useful when a site runs a Grove variant that renames a shared selector.

## API

| Name | Type | Purpose |
|---|---|---|
| `$general-scope` | variable (default `'body'`) | Root scope prepended to every selector |
| `$grove-selectors-base` | map | Canonical selectors shipped with the package |
| `$grove-selectors-extensions` | map (default `()`) | Per-site additions merged in at import time |
| `$grove-selectors` | map | Final merged map (base + extensions) |
| `grove($key)` | function | Look up a raw selector by semantic key |
| `grove-selector($key, $body-modifier: '')` | mixin | Apply styles to the selector, auto-scoped |

## Versioning

- **Patch** (0.x.Y): internal refactor, documentation, no selector changes
- **Minor** (0.X.y): new semantic keys added (backward compatible)
- **Major** (X.y.z): existing keys renamed or removed, or selectors changed in ways that may alter theme output

Consumers pin to a minor range (`^0.1.0`) to get additions and fixes automatically, and review before accepting a major bump.

## License

MIT
