import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initAlertBanner } from "./urgent-alert-banner.controller";

describe("initAlertBanner", () => {
  it("should hide the alert banner and persist dismissal when dismiss button is clicked", async () => {
    const { window, close } = createTestDom(`
      <aside id="mosque-urgent-alert-banner" data-alert-code="eid-1447">
        <button type="button" id="mosque-alert-dismiss-btn">Dismiss</button>
      </aside>
    `);

    try {
      window.sessionStorage.clear();
      initAlertBanner();

      const banner = document.getElementById("mosque-urgent-alert-banner");
      const dismissBtn = document.getElementById(
        "mosque-alert-dismiss-btn"
      ) as HTMLButtonElement;

      expect(banner?.classList.contains("hidden")).toBe(false);
      dismissBtn.click();
      expect(banner?.classList.contains("hidden")).toBe(true);
      expect(
        window.sessionStorage.getItem("mosque_alert_dismissed_eid-1447")
      ).toBe("1");
    } finally {
      await close();
    }
  });
});
