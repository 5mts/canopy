// Section-navigation enhancer: landmark a11y + current-page marking for one
// nav container — nothing else. Returns the current page's link (or null)
// so callers can compose, e.g. label a disclosure() toggle with it:
//
//   const current = subnav(container, { label: 'Section' });
//   disclosure(container, { label: current?.textContent.trim() || 'Section', panel: 'ul' });
//
// Call it from an onGroveRender callback so fresh DOM after a client-side
// navigation is re-enhanced; writes are attribute-only, so re-runs are
// cheap no-ops.
//
// What it does:
//   - role="navigation" + aria-label (skipped on <nav> or an existing
//     label); role="list" restored on lists (Safari drops the list role
//     under list-style: none)
//   - the same-origin link matching location.pathname gets
//     aria-current="page" + `currentClass` for consumer CSS

// Path only; trailing slash insignificant.
function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function subnav(container, options = {}) {
  const {
    label = "Menu",              // landmark name
    currentClass = "fm-current",
  } = options;

  const isList = container.matches("ul, ol"); // nav role must not land on the <ul>

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
    // same-origin only: an external link with a colliding path (e.g. "/about")
    // must not steal aria-current or the caller's trigger label
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
