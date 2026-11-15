/**
 * Initializes alphabetical letter filtering (`[data-glossary-letter]`) for `PublicationsAndGlossarySection`.
 */
export function initGlossaryFilter(root: ParentNode = document): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>(
    "[data-glossary-letter]"
  );
  const cards = root.querySelectorAll<HTMLElement>("[data-glossary-card]");

  buttons.forEach((btn) => {
    if (btn.getAttribute("data-glossary-bound") === "true") return;
    btn.setAttribute("data-glossary-bound", "true");

    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-glossary-letter") ?? "ALL";
      cards.forEach((card) => {
        const group = card.getAttribute("data-glossary-card");
        card.style.display =
          selected === "ALL" || group === selected ? "" : "none";
      });
    });
  });
}
