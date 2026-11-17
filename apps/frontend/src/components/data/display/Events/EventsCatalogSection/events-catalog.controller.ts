const ACTIVE_CLASSES = [
  "border-transparent",
  "bg-secondary",
  "font-bold",
  "text-white",
  "shadow-sm",
];

const INACTIVE_CLASSES = [
  "border-slate-300",
  "bg-white",
  "font-semibold",
  "text-slate-700",
  "hover:bg-slate-100",
  "dark:border-slate-700",
  "dark:bg-slate-900",
  "dark:text-slate-200",
  "dark:hover:bg-slate-800",
];

/**
 * Initializes the client-side category filter buttons (`[data-event-filter]`) for the Events Catalog section.
 */
export function initEventFilters(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "[data-event-filter]"
  );
  const cards = document.querySelectorAll<HTMLElement>("[data-event-category]");

  buttons.forEach((btn) => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-event-filter") ?? "all";

      buttons.forEach((b) => {
        const isActive = b === btn;
        b.setAttribute("aria-selected", String(isActive));
        for (const cls of ACTIVE_CLASSES) {
          b.classList.toggle(cls, isActive);
        }
        for (const cls of INACTIVE_CLASSES) {
          b.classList.toggle(cls, !isActive);
        }
      });

      cards.forEach((card) => {
        const cat = card.getAttribute("data-event-category");
        const show = selected === "all" || cat === selected;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}
