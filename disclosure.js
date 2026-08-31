// Disclosure toggle — the original wunc-grove subnav pattern, extracted.
//
// disclosure() prepends a <button aria-expanded> to the container. That's the
// whole job: JS flips the attribute; consumer CSS keys ALL visibility off it
// (collapse rules, :has() reveal, breakpoints via media queries — or no media
// query for an always-on dropdown). Repeat calls only update a changed label,
// so it's safe inside onGroveRender callbacks.
//
//   disclosure(container, {
//     label: 'Menu',               // button text (updated on re-calls)
//     toggleClass: 'fm-x-toggle',  // class for the button (also the rebuild guard)
//     panel: 'ul',                 // optional aria-controls target (descendant
//                                  // selector or element); if given but not
//                                  // found, no button is built
//     closeOnOutsideClick: false,  // click outside the container closes it
//     closeOnEscape: false,        // Escape closes it and refocuses the button
//   }) → the button (or null)

let uid = 0;

// Toggles watched for outside clicks: one lazily-bound document listener;
// entries self-prune when their container leaves the DOM, so client-side
// navs need no teardown.
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
    toggleClass = "fm-disclosure-toggle",
    panel,
    closeOnOutsideClick = false,
    closeOnEscape = false,
  } = options;

  // Built once per container — the existing toggle is the guard, so a
  // client-side nav that swaps in a fresh container just gets rebuilt.
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
      if (!panelEl.id) panelEl.id = `fm-disclosure-${++uid}`;
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
      // container-level listener: dies with the subtree on a nav swap, no leak
      container.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
          button.setAttribute("aria-expanded", "false");
          button.focus();
        }
      });
    }
  }

  // guard: an unconditional write re-triggers reconcile via the body observer (hang)
  if (typeof label === "string" && button.textContent !== label) {
    button.textContent = label;
  }
  return button;
}
