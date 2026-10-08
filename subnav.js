// Label a menu for screen readers and mark the current page's link with
// aria-current="page" and the fm-current class (or your chosen currentClass).
// Returns the matching link, or null. Use it to label a menu button:
//
//   const current = subnav(container, { label: 'Section' });
//   disclosure(container, { label: current?.textContent.trim() || 'Section', panel: 'ul' });
//
// Call from onGroveRender to update the menu after navigation.
// Links match by origin and path; query strings and hashes are ignored.

// Ignore trailing slashes when comparing paths.
function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function subnav(container, options = {}) {
  const {
    label = "Menu",              // menu name for screen readers
    currentClass = "fm-current",
  } = options;

  const isList = container.matches("ul, ol"); // preserve the list's role

  if (!isList) {
    if (container.tagName !== "NAV") container.setAttribute("role", "navigation");
    if (!container.hasAttribute("aria-label")) {
      container.setAttribute("aria-label", label);
    }
  }

  // list-style: none drops the list role in Safari; restore it.
  const lists = isList ? [container] : container.querySelectorAll("ul, ol");
  for (const list of lists) list.setAttribute("role", "list");

  const currentPath = normalizePath(location.pathname);
  let currentLink = null;

  for (const link of container.querySelectorAll("a[href]")) {
    // An external site's /about is not this site's /about.
    const isCurrent = link.origin === location.origin
      && normalizePath(link.pathname) === currentPath;
    link.classList.toggle(currentClass, isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
      if (!currentLink) currentLink = link; // first match wins
    } else {
      link.removeAttribute("aria-current");
    }
  }
  return currentLink;
}
