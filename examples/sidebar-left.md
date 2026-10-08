# Put the sidebar on the left

`sidebar-left` moves Grove's sidebar to the left on wide screens and fixes
its margins. You choose which pages it affects and how much space separates
the columns.

## Pages with a sidebar menu

This puts the sidebar on the left from 768px up, and above the content on
smaller screens:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

html:has(#sub-nav-menu) {
  @include sidebar-left($gap: 2rem, $stacked: sidebar-first);
}
```

Replace `html:has(#sub-nav-menu)` to select different pages. Set column
widths in your theme.

## Show and episode pages

These layouts use different widths for side-by-side columns:

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

@include sidebar-left($container: 'show-landing-container', $gap: 2rem);
@include sidebar-left($container: 'episode-container', $gap: 2rem);
```

| `$container` | Sidebar moves left at |
|---|---|
| `'page-container'` (default) | 768px |
| `'show-landing-container'` | 768px |
| `'episode-container'` | 1024px |

For article, blog post, and live blog layouts, pass `$breakpoint: 1024px`
with `'page-container'` to match Grove. `'show-container'` combines layouts
with different widths, so it requires an explicit `$breakpoint`.

## Options

- `$gap` sets the sidebar's right margin at every width. Omit it to leave
  that margin unchanged.
- `$breakpoint` overrides the width in the table.
- `$stacked: sidebar-first` puts the sidebar above the content below that
  width. `$stacked: sidebar-last` puts it below. Omit `$stacked` to keep
  Grove's normal stacking.

If your `$breakpoint` is wider than Grove's, set `$stacked` too. This keeps
the columns stacked until your chosen width.

For a sidebar menu with current-page styling and a mobile dropdown, see
[section navigation](subnav.md).
