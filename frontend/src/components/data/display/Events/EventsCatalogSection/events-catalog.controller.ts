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
        b.classList.toggle("bg-secondary", isActive);
        b.classList.toggle("text-white", isActive);
        b.classList.toggle("bg-white", !isActive);
        b.classList.toggle("text-slate-700", !isActive);
      });

      cards.forEach((card) => {
        const cat = card.getAttribute("data-event-category");
        const show = selected === "all" || cat === selected;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}
