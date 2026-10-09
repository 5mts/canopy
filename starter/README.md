# Grove starter theme

A minimal theme built on [canopy](../README.md). It makes two changes you can
see right away:

- The audio player sits at the bottom of the screen ([canopy pattern](scss/components/_audio-player.scss)).
- The home page gets a cream background ([plain Grove class](scss/layout/_home.scss)).

## Run it

```bash
npx degit 5mts/canopy/starter my-grove-theme
cd my-grove-theme
npm install
npm run dev
```

`npm run dev` rebuilds on every save and serves the theme at
`http://localhost:3000/dist/theme.css`. To try it on your live site, add this
to the page `<head>` with your browser's local overrides or our
[Local Script Testing](https://chromewebstore.google.com/detail/local-script-testing/jmgdaokiiafjphaomnmecgeldnpddebe)
extension for Chromium browsers:

```html
<link rel="stylesheet" href="http://localhost:3000/dist/theme.css">
```

Then load the home page.

When you're ready to publish, `npm run build` writes a minified
`dist/theme.css`. Add it to your site.

## Make it yours

- Change colors and sizes in [scss/_tokens.scss](scss/_tokens.scss).
- Add a file under `scss/components/` or `scss/layout/` and `@use` it in
  [scss/main.scss](scss/main.scss).
- Write simple Grove classes such as `.HomePage-main` directly. Use canopy names
  for selectors that are hard to write by hand. The
  [canopy README](../README.md) has the list, more patterns, and JavaScript
  helpers.
