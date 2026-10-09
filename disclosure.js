// Add a button that switches aria-expanded between "true" and "false".
// Use CSS to show or hide content based on that attribute.
// Safe to call from onGroveRender; repeat calls only update the button text.
//
//   disclosure(container, {
//     label: 'Menu',
//     panel: 'ul',
//   });
//
// panel can be a selector within the container or an element. If a selector
// finds nothing, return null. Otherwise return the button.
// Optional: toggleClass sets its class (default: canopy-disclosure-toggle).
// Set closeOnOutsideClick or closeOnEscape to true when creating the button
// to enable either. Both default to false. Escape also focuses the button.

let uid = 0;

// Share one outside-click listener; drop removed containers on the next click.
const watched = new Set();
let listenerBound = false;

function handleOutsideClick(event) {
  for (const entry of watched) {
    if (!entry.container.isConnected) { watched.delete(entry); continue; }
    if (
      entry.button.getAttribute("aria-expanded") === "true" &&
      !entry.container.contains(event.target)
    ) {
      entry.button.setAttribute("aria-expanded", "false");
    }
  }
}

export function disclosure(container, options = {}) {
  const {
    label,
    toggleClass = "canopy-disclosure-toggle",
    panel,
    closeOnOutsideClick = false,
    closeOnEscape = false,
  } = options;

  // Reuse the button if this container already has one.
  let button = container.querySelector(`.${toggleClass}`);
  if (!button) {
    let panelEl = null;
    if (panel instanceof Element) {
      panelEl = panel;
    } else if (typeof panel === "string") {
      panelEl = container.querySelector(panel);
      if (!panelEl) return null; // no panel, no toggle
    }

    button = document.createElement("button");
    button.type = "button";
    button.className = toggleClass;
    button.setAttribute("aria-expanded", "false");
    if (panelEl) {
      if (!panelEl.id) panelEl.id = `canopy-disclosure-${++uid}`;
      button.setAttribute("aria-controls", panelEl.id);
    }
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
    });
    container.prepend(button);

    if (closeOnOutsideClick) {
      watched.add({ container, button });
      if (!listenerBound) {
        listenerBound = true;
        document.addEventListener("click", handleOutsideClick);
      }
    }

    if (closeOnEscape) {
      // Keep the listener on the container so it leaves with the page content.
      container.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
          button.setAttribute("aria-expanded", "false");
          button.focus();
        }
      });
    }
  }

  // Only write changed text; repeated writes would keep triggering onGroveRender.
  if (typeof label === "string" && button.textContent !== label) {
    button.textContent = label;
  }
  return button;
}
