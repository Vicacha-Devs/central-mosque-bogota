/**
 * Initializes interactive Digital Tasbih & Adhkar counters inside `[data-tasbih-card]`.
 */
export function initTasbihCounters(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-tasbih-card]").forEach((card) => {
    if (card.getAttribute("data-tasbih-bound") === "true") return;
    card.setAttribute("data-tasbih-bound", "true");

    const target = Math.max(
      1,
      Number(card.getAttribute("data-tasbih-target") ?? 33)
    );
    let count = 0;

    const labelEl = card.querySelector<HTMLElement>(
      "[data-tasbih-counter-label]"
    );
    const progressEl = card.querySelector<HTMLElement>(
      "[data-tasbih-progress]"
    );
    const doneMsgEl = card.querySelector<HTMLElement>("[data-tasbih-done-msg]");
    const incBtn = card.querySelector<HTMLButtonElement>(
      "[data-tasbih-increment]"
    );
    const resetBtn = card.querySelector<HTMLButtonElement>(
      "[data-tasbih-reset]"
    );

    const syncUi = () => {
      if (labelEl) {
        labelEl.textContent = `${String(count)} / ${String(target)}`;
      }
      const percent = Math.min(100, Math.round((count / target) * 100));
      if (progressEl) {
        progressEl.setAttribute("data-value", String(percent));
        progressEl.setAttribute("aria-valuenow", String(percent));
      }
      if (doneMsgEl) {
        doneMsgEl.classList.toggle("hidden", count < target);
      }
    };

    incBtn?.addEventListener("click", () => {
      if (count < target) {
        count += 1;
      } else {
        count = 1;
      }
      syncUi();
    });

    resetBtn?.addEventListener("click", () => {
      count = 0;
      syncUi();
    });
  });
}
