/**
 * Initializes the client-side filter buttons (`[data-media-filter]`) for the Media Archive section.
 */
export function initMediaFilters(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "[data-media-filter]"
  );
  const cards = document.querySelectorAll<HTMLElement>("[data-media-type]");

  buttons.forEach((btn) => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-media-filter") ?? "all";

      buttons.forEach((b) => {
        const isActive = b === btn;
        b.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const type = card.getAttribute("data-media-type");
        const show = selected === "all" || type === selected;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}
