# Sidebar placement — aside on the left

Grove lays the page out as main + aside in a flex row, aside on the right,
with the aside's margins assuming that placement. `sidebar-left` moves the
aside to the reading-start side. It knows where Grove's own layout goes
side-by-side, so the minimal call names no widths at all — and because
"where does the sidebar sit" is one responsive decision, the same call
owns what happens below the flip point too.

## Minimal usage

A sidebar nav: aside left wherever Grove goes side-by-side, menu stacked
on top below that:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

// only on pages that have a sidebar nav — scope however fits your site
html:has(#sub-nav-menu) {
  @include sidebar-left($gap: 2rem, $stacked: sidebar-first);
}
```

Show and episode pages: Grove flips each container *family* at a different
point (landing mains go side-by-side at `md`, episode wrappers only at
`md-lg`), so use the family container keys — the mixin knows each family's
point, and each call still names no width:

```scss
@include sidebar-left($container: 'show-landing-container', $gap: 2rem);
@include sidebar-left($container: 'episode-container', $gap: 2rem);
```

(`$container: 'show-container'` errors here — that key unions both
families, so no single flip point is right for it. Pass `$breakpoint`
explicitly only when your flip point deliberately differs from Grove's,
and pair it with `$stacked: sidebar-last` to hold Grove's stack through
the band in between.)

## The options

- `$container` — the flex parent of main + aside: `'page-container'`
  (default) for the standard page layout, `'show-container'` for
  podcast/radio pages. The aside itself is covered by the shared
  `sidebar` / `sidebar-content` keys on every page type.
- `$breakpoint` — flip at and above this width. Default: **Grove's own
  side-by-side point for the container** (mirrored in the pattern, one
  edit if the vendor moves it). Pass a width only when your flip point
  deliberately differs.
- `$stacked` — what happens **below** the flip point. Default `null`:
  nothing — Grove's own stacking is left alone. `sidebar-first` puts the
  aside on top (a nav belongs there); `sidebar-last` stacks in document
  order, aside below — needed with a custom `$breakpoint` higher than
  Grove's point.
- `$gap` — the gutter between main and aside, applied at every width.

## What the mixin owns — the part that's easy to get wrong

- **Grove's breakpoints**, so you don't read minified vendor CSS to learn
  where the pair goes side-by-side.
- **The margin corrections** that go with the flip: Grove's aside spacing
  assumes a right-hand sidebar, so after reversing, the old margins land
  between the sidebar and the viewport edge. The mixin zeroes them and
  lets `$gap` own the gutter.
- **The wrap direction**: Grove gives show containers `flex-wrap:
  wrap-reverse`, so an overflowing aside would wrap *above* the content;
  the mixin makes any wrap land below.
- **Both sides of the flip point in one place** — splitting flip and stack
  across separate rules means encoding the same width twice, and the
  halves drift apart.

Column proportions (flex-basis, min-width on the aside) are site styling —
set them in your theme alongside the include. Pairs naturally with
`subnav()` + `disclosure-dropdown` for a full sidebar section nav — see
[subnav.md](subnav.md).
