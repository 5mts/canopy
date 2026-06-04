#!/usr/bin/env node
// Regenerate ../selectors.js from ../_selectors.scss.
//
// Parses four pieces of "Grove surface area" from the SCSS source:
//   1. $grove-selectors-base map → groveSelectors object
//   2. $grove-content-types list  → groveContentTypes array
//   3. $grove-news-story-type     → groveNewsStoryType string
//   4. $grove-head-suffixes list  → groveHeadSuffixes array
//
// Output is deterministic: same input → byte-identical output. Verify via
// `git diff --exit-code selectors.js` after running with no source change.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PKG_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC     = join(PKG_DIR, '_selectors.scss');
const OUT     = join(PKG_DIR, 'selectors.js');
const RUNTIME = join(PKG_DIR, 'scripts', 'selectors-runtime.js');

const raw = readFileSync(SRC, 'utf8');

// Strip line comments so they don't confuse the parsers below. Block comments
// aren't used in _selectors.scss; if that changes, extend this.
const src = raw.replace(/\/\/[^\n]*/g, '');

function parseMap(blockName) {
  const re = new RegExp(`\\$${blockName}:\\s*\\(([\\s\\S]*?)\\n\\)\\s*;`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not locate $${blockName} block`);
  const body = m[1];
  const entryRe = /([a-z][a-z0-9-]*)\s*:\s*'((?:[^'\\]|\\.)*)'/g;
  const entries = [];
  const seen = new Set();
  let e;
  while ((e = entryRe.exec(body)) !== null) {
    if (seen.has(e[1])) throw new Error(`Duplicate key in $${blockName}: ${e[1]}`);
    seen.add(e[1]);
    entries.push([e[1], e[2]]);
  }
  if (entries.length === 0) throw new Error(`No entries parsed from $${blockName} — regex drift?`);
  return entries;
}

function parseList(varName) {
  // Matches: $var-name: 'a', 'b', 'c' !default;  OR without !default
  const re = new RegExp(`\\$${varName}:\\s*((?:'(?:[^'\\\\]|\\\\.)*'\\s*,?\\s*)+)(?:!default)?\\s*;`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not locate $${varName}`);
  const values = [];
  const valRe = /'((?:[^'\\]|\\.)*)'/g;
  let v;
  while ((v = valRe.exec(m[1])) !== null) values.push(v[1]);
  if (values.length === 0) throw new Error(`No values parsed from $${varName}`);
  return values;
}

function parseScalar(varName) {
  const re = new RegExp(`\\$${varName}:\\s*'((?:[^'\\\\]|\\\\.)*)'\\s*;`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not locate $${varName}`);
  return m[1];
}

const selectors    = parseMap('grove-selectors-base');
const contentTypes = parseList('grove-content-types');
const newsStory    = parseScalar('grove-news-story-type');
const headSuffixes = parseList('grove-head-suffixes');

const banner = `// GENERATED — do not edit. Source: _selectors.scss\n// Regenerate via: npm run build:selectors\n\n`;

const mapBody = selectors.map(([k, v]) =>
  `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`
).join('\n');

const constants =
  `export const groveSelectors = Object.freeze({\n${mapBody}\n});\n\n` +
  `export const groveContentTypes  = Object.freeze(${JSON.stringify(contentTypes)});\n` +
  `export const groveNewsStoryType = ${JSON.stringify(newsStory)};\n` +
  `export const groveHeadSuffixes  = Object.freeze(${JSON.stringify(headSuffixes)});\n\n`;

const runtime = readFileSync(RUNTIME, 'utf8')
  // Strip the runtime's own header comment so it doesn't appear inside the
  // generated file (the banner above already explains provenance).
  .replace(/^\/\/[^\n]*\n(\/\/[^\n]*\n)*\n?/, '');

writeFileSync(OUT, banner + constants + runtime);
console.log(
  `Wrote ${selectors.length} selectors, ${contentTypes.length} content types, ` +
  `${headSuffixes.length} head suffixes to ${OUT}`
);
