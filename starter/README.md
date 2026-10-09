# Grove starter theme

A minimal theme built on [canopy](../README.md). It makes two changes you can
see right away:

- The audio player sits at the bottom of the screen ([canopy pattern](scss/components/_audio-player.scss)).
- The home page gets a cream background ([plain Grove class](scss/layout/_home.scss)).

## Run it

Copy this folder, then:

```bash
npm install
npm run build
```

Inject the script locally into the header of your site to test, using something like local overrides for your browser or our (Local Script Testing)[https://chromewebstore.google.com/detail/local-script-testing/jmgdaokiiafjphaomnmecgeldnpddebe] Chromium browser extension. 

You'll want to inject something like the following into `head` of the page:
```
<link rel="stylesheet" href="http://localhost:3000/dist/theme.css">
```

This writes `dist/theme.css`. Add it to your site, then load the home page.

While you work, `npm run dev` rebuilds on every save and serves the file at
`http://localhost:3000/theme.css`. Point your site at that URL to test changes
before you publish them.

## Make it yours

- Change colors and sizes in [scss/_tokens.scss](scss/_tokens.scss).
- Add a file under `scss/components/` or `scss/layout/` and `@use` it in
  [scss/main.scss](scss/main.scss).
- Write simple Grove classes such as `.HomePage-main` directly. Use canopy names
  for selectors that are hard to write by hand. The
  [canopy README](../README.md) has the list, more patterns, and JavaScript
  helpers.
