/**
 * Initializes clipboard copy buttons (`[data-copy-dua]`) inside `DailyDuaModal`.
 */
export function initCopyDuaButtons(root: ParentNode = document): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-copy-dua]");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-copy-dua-bound") === "true") return;
    btn.setAttribute("data-copy-dua-bound", "true");

    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy-dua") ?? "";
      const copyLabel = btn.getAttribute("data-copy-label") ?? "Copy";
      const copiedLabel = btn.getAttribute("data-copied-label") ?? "Copied!";
      const labelSpan = btn.querySelector<HTMLElement>("[data-copy-dua-text]");
      void (async () => {
        try {
          await navigator.clipboard.writeText(text);
          if (labelSpan) {
            labelSpan.textContent = copiedLabel;
            setTimeout(() => {
              labelSpan.textContent = copyLabel;
            }, 2000);
          }
        } catch {
          // Ignore clipboard permission errors silently
        }
      })();
    });
  });
}
