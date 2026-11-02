import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initTasbihCounters } from "./scripture-explorer.controller";

describe("initTasbihCounters", () => {
  it("should increment and display completion message when target is reached", async () => {
    const { root, close } = createTestDom(`
      <div data-tasbih-card data-tasbih-target="3">
        <span data-tasbih-counter-label>0 / 3</span>
        <div data-tasbih-progress data-value="0" aria-valuenow="0"></div>
        <p class="hidden" data-tasbih-done-msg>Done!</p>
        <button type="button" data-tasbih-increment>+1</button>
        <button type="button" data-tasbih-reset>Reset</button>
      </div>
    `);

    try {
      initTasbihCounters(root);

      const label = root.querySelector("[data-tasbih-counter-label]");
      const progress = root.querySelector("[data-tasbih-progress]");
      const doneMsg = root.querySelector("[data-tasbih-done-msg]");
      const incBtn = root.querySelector<HTMLButtonElement>(
        "[data-tasbih-increment]"
      );
      const resetBtn = root.querySelector<HTMLButtonElement>(
        "[data-tasbih-reset]"
      );

      incBtn?.click();
      expect(label?.textContent).toBe("1 / 3");
      expect(progress?.getAttribute("aria-valuenow")).toBe("33");
      expect(doneMsg?.classList.contains("hidden")).toBe(true);

      incBtn?.click();
      incBtn?.click();
      expect(label?.textContent).toBe("3 / 3");
      expect(progress?.getAttribute("aria-valuenow")).toBe("100");
      expect(doneMsg?.classList.contains("hidden")).toBe(false);

      incBtn?.click();
      expect(label?.textContent).toBe("1 / 3");
      expect(doneMsg?.classList.contains("hidden")).toBe(true);

      resetBtn?.click();
      expect(label?.textContent).toBe("0 / 3");
      expect(progress?.getAttribute("aria-valuenow")).toBe("0");
    } finally {
      await close();
    }
  });
});
