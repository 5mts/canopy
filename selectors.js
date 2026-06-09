// GENERATED — do not edit. Source: _selectors.scss
// Regenerate via: npm run build:selectors

export const groveSelectors = Object.freeze({
  "region-main": "main",
  "promo": "ps-promo:not(:where(ps-tabs,.EplB) ps-promo)",
  "promo-media": "[class^=\"Promo\"][class$=\"-media\"]",
  "promo-content": "[class^=\"Promo\"][class$=\"-content\"]",
  "audio-player": ".PH-persistent-player",
  "promo-audio-label": ".PromoAE-audio-label",
  "episode-list": ".EplB, .EplA",
  "episode-list-header": ".EplB-header, EplA-header",
  "episode-list-title": ".EplB-header-title, EplA-header-title",
  "episode-list-item": ".EplB-items-item, EplA-items-item",
  "promo-titles": ".PromoXS-title",
  "page-above": ".Page-above",
  "sidebar": "main > aside",
  "main-content": "[class$=\"-mainContent\"]",
  "main-headline": "h1",
  "byline": "[class$=\"-byline\"]",
  "header-metadata": "[class$=\"-contentInfo\"]",
  "page-lead": "main [class$=\"-lead\"]",
  "breadcrumbs": "[class$=\"-breadcrumbs-wrapper\"]",
  "article-sidebar": "[class$=\"-sidebar\"], [class$=\"-aside\"]",
  "metadata-relocatable-links": "[class$=\"-contentInfo\"] a",
  "content-image": "figure .Image, .PromoXS-media .Image",
  "content-figure-content": ".Figure-content",
  "content-figure-caption": ".Figure-caption, .CarouselSlide-infoDescription",
  "content-figure-credit-container": ".Figure-credit-container",
  "content-figure-credit": ".Figure-credit, .CarouselSlide-infoAttribution",
  "news-story": ".ArtP:not(.aside)",
  "podcast-aside": ".PodcastPage-aside-content",
  "podcast-cover-and-title": ".PodcastPage-top",
  "podcast-byline": ".PodcastPage-byline",
  "podcast-credits": ".PodcastPage-aside-content .ListPeople",
  "podcast-subscribe-container": ".PodcastPage-share",
  "news-tile": "ps-promo[data-content-type=\"news-story\"]",
  "eyebrow": "[class$=\"-category\"]:has(> a), [class$=\"-breadcrumbs\"]:has(a)",
  "author-info": "[class$=\"-authorName\"]",
  "timestamp": "[class$=\"-timestamp\"], [class$=\"-timestamp\"] > *",
  "tabs": "ps-tabs",
  "tabs-list": ".Tabs-tabs",
  "tabs-header": ".Tabs-header",
  "tab": "ps-tabs .Tabs-tabs-tab",
  "tab-active": "ps-tabs [role=\"tab\"][data-active=\"true\"], ps-tabs .Tabs-tabs-tab[data-active=\"true\"]",
  "tabs-title": "ps-tabs .Tabs-header-title",
  "tabs-content": "ps-tabs .Tabs-content",
  "action-bar": ".ActionBar",
  "action-bar-item": ".ActionBar-items-item",
  "action-link": ".ActionLink",
  "social-action": ".ActionLink[data-social-service]",
  "nav-bar": ".PH-nav-bar",
  "nav-item": ".NavI",
  "nav-item-list": ".NavI-items",
  "nav-item-text": ".NavI-text",
  "nav-link": ".NavLink",
  "dropdown-nav-items": ".DropdownNavigation-items, .NavI .NavLink",
  "stream-container": "ps-stream",
  "stream-pill": ".StreamPill",
  "stream-pill-highlighted": ".StreamPill:hover, [playing] .StreamPill",
});

export const groveContentTypes  = Object.freeze(["ArtP","RSEP"]);
export const groveNewsStoryType = "ArtP";
export const groveHeadSuffixes  = Object.freeze(["-breadcrumbs-wrapper","-headline","-contentInfo","-audioPlayer","parentInfo"]);

export function grove(key) {
  const value = groveSelectors[key];
  if (value == null) {
    throw new Error(
      `No Grove selector found for key: '${key}'. ` +
      `Check $grove-selectors-base or add it via $grove-selectors-extensions.`
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
