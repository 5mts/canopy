# Canopy: A Grove styling & design toolkit

A library to assist in custom designs for sites using the NPR Grove CMS. 

**This project is not affiliated with NPR, Grove, Brightspot, or other vendors.** This is a completely independent project of [Five Mountains](https://5mts.com), a private, independent consultancy supporting public media and local news. While we will try to keep this library updated as a community resource, this project is provided purely "as is" and we can't guarantee it will work or continue working for your needs. 

We encourage questions, issues, and submissions — and if you need support with Grove or other digital projects, we take a limited number of paid projects each year (which help support work on this and other community projects). 

## Quick start

Download the starter into a new theme directory, install its dependencies, and start the local development server:

```bash
npx degit 5mts/canopy/starter my-grove-theme
cd my-grove-theme
npm install
npm run dev
```

The starter pins the audio player to the bottom of the screen and gives the home page a cream background. It rebuilds your CSS when you save changes.

To preview it on your site, add this stylesheet link to the page `<head>` using your browser's local overrides or our [Local Script Testing](https://chromewebstore.google.com/detail/local-script-testing/jmgdaokiiafjphaomnmecgeldnpddebe) extension for Chromium browsers:

```html
<link rel="stylesheet" href="http://localhost:3000/dist/theme.css">
```

See the [starter instructions](https://github.com/5mts/canopy/tree/main/starter#readme) for customization and production builds.


## Install in a theme

```bash
npm install @5mts/canopy
```

Requires Dart Sass 1.78+ with `--pkg-importer=node` to use the `pkg:` imports below. Put Sass examples in your theme's `.scss` files and JavaScript imports in its `.js` files.

## Style Grove elements

Canopy gives short names to complex Grove selectors.

```scss
@use 'pkg:@5mts/canopy' as *;

@include grove-selector('promo-title') {
  color: teal;
}
```

This styles Grove promo titles. Find available names in the [selector map](_selectors.scss). For a simple class such as `.SocialBar`, use ordinary CSS.

To limit a rule to part of the page, nest it:

```scss
aside {
  @include grove-selector('promo-title') {
    font-size: 1rem;
  }
}
```

### Style pages by program, section, or tag

```scss
#{grove-page-is('program', 'Morning Show')} {
  @include grove-selector('nav-bar') {
    background: teal;
  }
}
```

Use `program`, `category` (Grove Section), `keywords` (Grove Tags), `pageType`, or `series`. Values must match the page's metadata. Pass a list to match any listed value: `grove-page-is('program', ('Morning Show', 'Weekend Talk'))`.

### Change a layout

```scss
@use 'pkg:@5mts/canopy/patterns' as *;

.ListE-items {
  @include three-column-list;
}

@include audio-player-bottom($offset: 0, $reserve-footer: 50px);
```

The list uses two columns from 768px and three from 1240px. It also hides bylines and adjusts tile spacing. Use `two-column-list` to stop at two columns.

The player stays at the bottom of the screen. Set `$reserve-footer` to its height to keep footer content clear; that padding applies from 768px by default.

Imports alone add no CSS. Each `@include` adds the styles you request.

| Task | Example |
|---|---|
| Put the sidebar on the left | [Sidebar](examples/sidebar-left.md) |
| Add a dropdown or accordion | [Show and hide content](examples/disclosure.md) |
| Move an element | [Relocation](examples/relocate.md) |
| Mark the current section link or add a section menu | [Section navigation](examples/subnav.md) |

## Run JavaScript when Grove adds content

Grove can load page content after your script runs and replace it during navigation. Use `onGroveElement` to handle each matching element when it appears:

```js
import { onGroveElement } from '@5mts/canopy/ready.js';

onGroveElement('.EplB-header-title', el => {
  el.textContent = 'Latest episodes';
});
```

This runs once per element, including new elements added during navigation.

Two other helpers are available from `ready.js`:

- `onGroveRender(callback)` runs when the page is ready, content is added or removed, and navigation occurs. **Check before changing text or adding elements**: repeated changes can trigger an endless loop.
- `onGroveNavigate(callback)` passes the current path and query, such as `/news?page=2`, at load and when they change. Returning to a URL runs it again; `#hash` changes do not. Content may still be loading, so use `onGroveElement` for element changes.

Each helper returns a function you can call to stop its callback. Importing `ready.js` alone does not start watching the page.

### Find Grove elements

```js
import { grove, groveAll, groveOne } from '@5mts/canopy/selectors.js';

grove('promo-title');    // CSS selector
groveOne('promo-title'); // First matching element, or null
groveAll('promo-title'); // Array of matching elements
```

Use these inside a ready callback when content may not have loaded yet. The JavaScript selector list is in [selectors.js](selectors.js); Sass-only groups are not included.

### Move an element

```js
import { grove } from '@5mts/canopy/selectors.js';
import { relocate } from '@5mts/canopy/relocate.js';

relocate({ source: grove('podcast-subscribe'), dest: '#subscribe-slot' });
```

Add an element with `id="subscribe-slot"` where you want the links. This moves all matching elements into it and handles new content after navigation. See [relocation](examples/relocate.md) for other positions and how to hide elements until they move.

### Add menus and show/hide buttons

- [`disclosure()`](examples/disclosure.md) adds a button that opens and closes content. Pair it with the Sass example to control visibility.
- [`subnav()`](examples/subnav.md) labels section navigation for screen readers and marks the current page's link. The example also shows how to make it a dropdown.
- [`global.js`](examples/inline-snippets.md) lets scripts pasted into the CMS use the ready helpers through `canopy.on()`.

## Maintain the library

Edit selectors in `_selectors.scss`, then regenerate `selectors.js`:

```bash
npm run build:selectors
```

Do not edit `selectors.js` directly. Publishing runs this build automatically.

In Sass, a selector group can reference other keys: `show-container: ('podcast-container', 'radio-container')`. These groups follow changes to their members and are not included in the generated JavaScript. Keep site-specific groups in your theme.

Version policy:

- **Patch:** docs and internal changes; selectors unchanged.
- **Minor:** new selectors, patterns, or JavaScript features that preserve existing behavior.
- **Major:** removed or renamed keys, or selector changes that may change theme styles.

A dependency range such as `^0.3.0` allows `0.3.x` updates. Review release changes before updating beyond that range.

## License

MIT
