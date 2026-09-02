# canopy examples

Worked recipes, one feature per file. Each shows the minimal complete usage
(JS + SCSS where both halves apply), then explains what the library owns vs
what stays in your theme.

- [disclosure.md](disclosure.md) — accessible dropdown and accordion from `disclosure()` + the disclosure CSS mixins, applied to a sub-nav and a transcript
- [relocate.md](relocate.md) — move DOM with `relocate()` + hide sources until they move with `relocate-flash-guard`
- [subnav.md](subnav.md) — section navigation: `subnav()` for landmark a11y + current-page marking, composed with `disclosure()` for the dropdown
- [inline-snippets.md](inline-snippets.md) — use the ready.js hooks from inline `<script>` snippets: `<script type="text/canopy">` for page-scoped snippets with MPA-like semantics, `canopy.on()` + a generic header stub for site-wide slots; `global.js` bundled or standalone from a CDN
- [sidebar-left.md](sidebar-left.md) — flip the page sidebar to the left with `sidebar-left`; it knows Grove's side-by-side breakpoints and can control stacking below the flip point
