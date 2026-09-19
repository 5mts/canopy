// GENERATED — do not edit. Source: _selectors.scss
// Regenerate via: npm run build:selectors

export const groveSelectors = Object.freeze({
  "container-columns": ".FourColumnContainer, .OneColumnContainer, .ThreeColumnContainer, .TwoColumnContainer3070, .TwoColumnContainer5050, .TwoColumnContainer7030",
  "page-is-show": ".PodcastPage, .RadioShowPage",
  "page-is-episode": ".PCEP, .RSEP",
  "page-is-archive": ".SectionPage, .TagPage",
  "promo": "ps-promo:not(:where(ps-tabs,.EplB) ps-promo)",
  "promo-media": "[class^=\"Promo\"][class$=\"-media\"]",
  "promo-content": "[class^=\"Promo\"][class$=\"-content\"]",
  "audio-player": ".PH-persistent-player",
  "promo-audio-label": "[class^=\"Promo\"][class$=\"-audio-label\"]",
  "button": "button, button.Button, button.Link",
  "episode-list": ".EplB, .EplA",
  "episode-list-wrapper": ".EplB-items, .EplA-items",
  "episode-list-header": ".EplB-header, .EplA-header",
  "episode-list-title": ".EplB-header-title, .EplA-header-title",
  "episode-list-item": ".EplB-items-item, .EplA-items-item",
  "promo-title": "[class^=\"Promo\"][class$=\"-title\"]",
  "heading": "[class$=\"-header\"], [class$=\"-heading\"]",
  "heading-title": "[class$=\"-header-title\"]",
  "sidebar": "main > aside, [class$=\"-wrapper\"] > aside",
  "sidebar-content": "aside > [class$=\"-aside-content\"]",
  "main-content": "[class$=\"-mainContent\"]",
  "main-headline": "h1[class$=\"-headline\"]",
  "byline": "[class$=\"-byline\"]",
  "content-meta": "[class$=\"-contentInfo\"]",
  "page-lead": "main [class$=\"-lead\"]",
  "breadcrumbs": "[class$=\"-breadcrumbs-wrapper\"]",
  "people-byline": ".PromoPeople-content",
  "article-body": "article [class$=\"-articleBody\"]",
  "article-subhead": "article h2[class$=\"-subheadline\"]",
  "post-article-tags": "[class$=\"-tags\"]",
  "post-article-bio": "[class$=\"-bottomByline\"]",
  "page-description": "[class$=\"-pageDescription-content\"]",
  "series-banner": ".SeriesBanner",
  "page-container": "[class$=\"Page-wrapper\"]",
  "page-header": "[class$=\"Page-head\"]",
  "page-head-text": "[class$=\"Page-head-text\"]",
  "main-without-aside": "main:not(:has(~ aside, aside), aside ~ main)",
  "main-with-aside": "main:has(~ aside, aside), aside ~ main",
  "metadata-relocatable-links": "[class$=\"-contentInfo\"] a",
  "content-image": "figure .Image, .PromoXS-media .Image",
  "caption": ".Figure-caption, .CarouselSlide-infoDescription, .Figure-credit, .CarouselSlide-infoAttribution, [class$=\"-credit-container\"] [class$=\"-credit\"], [class$=\"-credit-container\"] [class$=\"-divider\"], [class$=\"-credit-container\"] [class$=\"-source\"]",
  "title-text": "[class$=\"-title\"]",
  "description": "[class$=\"-description\"]",
  "news-story": ".ArtP:not(.aside)",
  "podcast-container": ".PodcastPage-main, .PCEP-content .PCEP-wrapper",
  "podcast-aside": ".PodcastPage-aside, .PCEP-aside",
  "podcast-cover-and-title": ".PodcastPage-top",
  "podcast-byline": ".PodcastPage-byline",
  "podcast-description": ".PodcastPage-byline + *",
  "podcast-subscribe": ".PodcastActionBar",
  "podcast-subscribe-label": ".PodcastLink-provider",
  "podcast-social-bar": ".PodcastPage-social",
  "podcast-icon-headings": ".PodcastActionBar-heading, .PodcastPage-social .SocialBar-heading",
  "podcast-hostname": ".PodcastPage-hostName",
  "episode-series-header": "[class$=\"EP-parentInfo\"]",
  "podcast-header": ".PodcastPage-info",
  "radio-container": ".RadioShowPage-main, .RSEP-content .RSEP-wrapper",
  "radio-aside": ".RadioShowPage-aside, .RSEP-aside",
  "radio-cover-and-title": ".RadioShowPage-top",
  "radio-byline": ".RadioShowPage-byline",
  "radio-description": ".RadioShowPage-byline + *",
  "radio-social-bar": ".RadioShowPage-social",
  "radio-icon-headings": ".RadioShowPage-social .SocialBar-heading",
  "radio-hostname": ".RadioShowPage-hostName",
  "radio-header": ".RadioShowPage-info",
  "show-landing-container": ".PodcastPage-main, .RadioShowPage-main",
  "episode-container": ".PCEP-content .PCEP-wrapper, .RSEP-content .RSEP-wrapper",
  "show-main": "[class$=\"Page-wrapper\"], [class$=\"EP-main\"]",
  "sidebar-headings": "aside h2, aside h3, aside h4",
  "episode-meta": ".PCEP-contentInfo, .RSEP-contentInfo",
  "episode-player": ".PCEP-audioPlayer, .RSEP-audioPlayer",
  "show-schedule-info": ".RadioShowPage-mediaSchedule, .PodcastPage-podcastSchedule",
  "news-tile": "ps-promo[data-content-type=\"news-story\"]",
  "eyebrow": "[class$=\"-category\"]:has(> a), [class$=\"-breadcrumbs\"]:has(a)",
  "author-info": "[class$=\"-authorName\"], [class$=\"-contributors\"], [class$=\"-hostName\"]",
  "author-position": "[class$=\"-authorTitle\"]",
  "timestamp": "[class$=\"-timestamp\"], [class$=\"-timestamp\"] > *",
  "tab": "ps-tabs .Tabs-tabs-tab",
  "tab-active": "ps-tabs [role=\"tab\"][data-active=\"true\"], ps-tabs .Tabs-tabs-tab[data-active=\"true\"]",
  "social-action": ".ActionLink[data-social-service]",
  "nav-bar": ".PH-nav-bar",
  "nav-item": ".NavI",
  "nav-item-list": ".NavI-items",
  "nav-item-text": ".NavI-text",
  "dropdown-nav-items": ".DropdownNavigation-items, .NavI .NavLink",
  "stream-pill-highlighted": ".StreamPill:hover, [playing] .StreamPill",
});

export const groveContentTypes  = Object.freeze(["ArtP","RSEP"]);
export const groveNewsStoryType = "ArtP";
export const groveHeadSuffixes  = Object.freeze(["-breadcrumbs-wrapper","-headline","-contentInfo","-audioPlayer","-parentInfo"]);

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
