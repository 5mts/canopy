// Functions copied into selectors.js by scripts/generate-selectors-js.mjs.
// Import selectors.js, not this file.

export function grove(key) {
  const value = groveSelectors[key];
  if (value == null) {
    throw new Error(
      `No Grove selector found for key: '${key}'. ` +
      `Check $grove-selectors-base — or write the raw selector if the class is plainly readable.`
    );
  }
  return value;
}

export function groveAll(keys, root = document) {
  const list = Array.isArray(keys) ? keys : [keys];
  return Array.from(root.querySelectorAll(list.map(grove).join(', ')));
}

export function groveOne(key, root = document) {
  return root.querySelector(grove(key));
}

export function groveVariants(prefix, suffix, letters) {
  return letters.map(L => `.${prefix}${L}${suffix}`);
}

export const isNewsStory = el => el?.classList?.contains(groveNewsStoryType);
