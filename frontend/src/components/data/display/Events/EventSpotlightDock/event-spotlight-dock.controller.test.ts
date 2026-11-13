import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initEventSpotlightDocks } from "./event-spotlight-dock.controller";

describe("initEventSpotlightDocks", () => {
  it("should toggle minimized state and compute countdown days when tabs are switched", async () => {
    const { root, window, close } = createTestDom(`
      <aside
        data-event-spotlight-dock
        data-storage-key="test_spotlight"
        data-days-remaining-label="días restantes"
      >
        <button type="button" class="hidden" data-spotlight-expand>
          Expand
        </button>
        <div data-spotlight-card>
          <button type="button" data-spotlight-minimize>Minimize</button>
          <button
            type="button"
            data-spotlight-tab="ev-1"
            aria-selected="true"
          >
            Tab 1
          </button>
          <button
            type="button"
            data-spotlight-tab="ev-2"
            aria-selected="false"
          >
            Tab 2
          </button>
          <div data-spotlight-panel="ev-1" class="block">
            <span class="hidden" data-spotlight-countdown="2026-10-31"></span>
          </div>
          <div data-spotlight-panel="ev-2" class="hidden"></div>
        </div>
      </aside>
    `);

    try {
      const fixedNow = new Date("2026-10-21T12:00:00.000Z").getTime();
      initEventSpotlightDocks(root, fixedNow);

      const badge = root.querySelector("[data-spotlight-countdown]");
      expect(badge?.textContent).toBe("11 días restantes");
      expect(badge?.classList.contains("hidden")).toBe(false);

      const tab2 = root.querySelector<HTMLButtonElement>(
        "[data-spotlight-tab=\u0022ev-2\u0022]"
      );
      tab2?.click();
      expect(tab2?.getAttribute("aria-selected")).toBe("true");
      expect(
        root
          .querySelector("[data-spotlight-panel=\u0022ev-2\u0022]")
          ?.classList.contains("block")
      ).toBe(true);

      const minBtn = root.querySelector<HTMLButtonElement>(
        "[data-spotlight-minimize]"
      );
      minBtn?.click();
      expect(
        root
          .querySelector("[data-spotlight-card]")
          ?.classList.contains("hidden")
      ).toBe(true);
      expect(window.localStorage.getItem("test_spotlight")).toBe("1");

      const expandBtn = root.querySelector<HTMLButtonElement>(
        "[data-spotlight-expand]"
      );
      expandBtn?.click();
      expect(
        root
          .querySelector("[data-spotlight-card]")
          ?.classList.contains("hidden")
      ).toBe(false);
      expect(window.localStorage.getItem("test_spotlight")).toBe("0");

      window.localStorage.setItem("mosque_spotlight_min", "1");
      const extraDock = document.createElement("aside");
      extraDock.setAttribute("data-event-spotlight-dock", "");
      extraDock.innerHTML = `
        <button type="button" class="hidden" data-spotlight-expand></button>
        <div data-spotlight-card>
          <span data-spotlight-countdown=""></span>
          <span data-spotlight-countdown="not-a-date"></span>
          <span data-spotlight-countdown="2026-10-25T12:00:00.000Z"></span>
        </div>
      `;
      root.appendChild(extraDock);
      initEventSpotlightDocks(root, fixedNow);
      initEventSpotlightDocks(root, fixedNow);
      expect(
        extraDock
          .querySelector("[data-spotlight-card]")
          ?.classList.contains("hidden")
      ).toBe(true);
    } finally {
      await close();
    }
  });
});
