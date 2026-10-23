/**
 * Initializes floating EventSpotlightDock widgets (`[data-event-spotlight-dock]`),
 * including minimize/expand persistence, tab switching, and countdown badges.
 */
export function initEventSpotlightDocks(
  root: ParentNode = document,
  nowMs: number = Date.now()
): void {
  const docks = root.querySelectorAll<HTMLElement>(
    "[data-event-spotlight-dock]"
  );

  docks.forEach((dock) => {
    if (dock.getAttribute("data-spotlight-bound") === "true") return;
    dock.setAttribute("data-spotlight-bound", "true");

    const storageKey =
      dock.getAttribute("data-storage-key") ?? "mosque_spotlight_min";
    const daysLabel =
      dock.getAttribute("data-days-remaining-label") ?? "days left";
    const card = dock.querySelector<HTMLElement>("[data-spotlight-card]");
    const expandBtn = dock.querySelector<HTMLButtonElement>(
      "[data-spotlight-expand]"
    );
    const minimizeBtn = dock.querySelector<HTMLButtonElement>(
      "[data-spotlight-minimize]"
    );
    const tabs = dock.querySelectorAll<HTMLButtonElement>(
      "[data-spotlight-tab]"
    );
    const panels = dock.querySelectorAll<HTMLElement>("[data-spotlight-panel]");

    const setMinimizedState = (minimized: boolean) => {
      if (!card || !expandBtn) return;
      if (minimized) {
        card.classList.add("hidden");
        expandBtn.classList.remove("hidden");
        expandBtn.classList.add("inline-flex");
      } else {
        card.classList.remove("hidden");
        expandBtn.classList.add("hidden");
        expandBtn.classList.remove("inline-flex");
      }
      try {
        window.localStorage.setItem(storageKey, minimized ? "1" : "0");
      } catch {
        // Ignore storage quota / privacy mode errors
      }
    };

    try {
      if (window.localStorage.getItem(storageKey) === "1") {
        setMinimizedState(true);
      }
    } catch {
      // Ignore storage errors
    }

    minimizeBtn?.addEventListener("click", () => {
      setMinimizedState(true);
    });
    expandBtn?.addEventListener("click", () => {
      setMinimizedState(false);
    });

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("data-spotlight-tab");
        if (!targetId) return;

        tabs.forEach((tBtn) => {
          const isActive = tBtn.getAttribute("data-spotlight-tab") === targetId;
          tBtn.setAttribute("aria-selected", isActive ? "true" : "false");
          if (isActive) {
            tBtn.classList.add("bg-amber-400", "text-slate-950");
            tBtn.classList.remove("bg-white/10", "text-slate-200");
          } else {
            tBtn.classList.remove("bg-amber-400", "text-slate-950");
            tBtn.classList.add("bg-white/10", "text-slate-200");
          }
        });

        panels.forEach((panel) => {
          const isMatch =
            panel.getAttribute("data-spotlight-panel") === targetId;
          panel.classList.toggle("hidden", !isMatch);
          panel.classList.toggle("block", isMatch);
        });
      });
    });

    const countdownBadges = dock.querySelectorAll<HTMLElement>(
      "[data-spotlight-countdown]"
    );
    countdownBadges.forEach((badge) => {
      const endRaw = badge.getAttribute("data-spotlight-countdown");
      if (!endRaw) return;
      const endIso = /^\d{4}-\d{2}-\d{2}$/.test(endRaw)
        ? `${endRaw}T23:59:59.999Z`
        : endRaw;
      const endMs = new Date(endIso).getTime();
      if (Number.isNaN(endMs)) return;
      const diffDays = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 60) {
        badge.textContent = `${String(diffDays)} ${daysLabel}`;
        badge.classList.remove("hidden");
        badge.classList.add("inline-flex");
      }
    });
  });
}
