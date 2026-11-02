import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initZakatCalculator } from "./zakat-calculator.controller";

describe("initZakatCalculator", () => {
  it("should calculate Zakat and Fitrana totals when inputs change", async () => {
    const { close } = createTestDom(`
      <div
        id="zakat-calculator"
        data-gold-nisab="30000000"
        data-silver-nisab="2500000"
        data-below-text="Debajo del Nisab"
        data-above-text="Supera el Nisab (2.5%)"
      >
        <select id="zakat-standard-select">
          <option value="gold" selected>Gold</option>
          <option value="silver">Silver</option>
        </select>
        <input id="zakat-cash" value="0" />
        <input id="zakat-investments" value="0" />
        <input id="zakat-debts" value="0" />
        <span id="zakat-net-worth"></span>
        <span id="zakat-status"></span>
        <span id="zakat-due-amount" data-raw-zakat="0"></span>
        <button type="button" id="apply-zakat-to-form-btn">Apply Zakat</button>
      </div>
      <div
        id="fitrana-fidyah-calculator"
        data-fitrana-rate="25000"
        data-fidyah-rate="20000"
        data-kaffarah-rate="1200000"
      >
        <input id="fitrana-members" value="0" />
        <input id="fidyah-days" value="0" />
        <input id="kaffarah-count" value="0" />
        <span id="fitrana-subtotal"></span>
        <span id="fidyah-kaffarah-subtotal"></span>
        <span id="fitrana-total-due" data-raw-fitrana="0"></span>
        <button type="button" id="apply-fitrana-to-form-btn">Apply Fitrana</button>
      </div>
      <input id="donation-amount" value="" />
      <select id="donation-currency"><option value="COP">COP</option></select>
      <select id="donation-type"><option value="sadaqah">Sadaqah</option><option value="zakat">Zakat</option></select>
      <select id="donation-campaign-slug"><option value="">None</option></select>
      <input type="checkbox" id="donation-covers-remaining" checked />
      <div id="donation-form-section"></div>
    `);

    try {
      initZakatCalculator();
      initZakatCalculator();

      const standardSelect = document.getElementById(
        "zakat-standard-select"
      ) as HTMLSelectElement;
      const cashInput = document.getElementById(
        "zakat-cash"
      ) as HTMLInputElement;
      const dueEl = document.getElementById("zakat-due-amount");
      const statusEl = document.getElementById("zakat-status");
      const applyBtn = document.getElementById(
        "apply-zakat-to-form-btn"
      ) as HTMLButtonElement;
      const applyFitranaBtn = document.getElementById(
        "apply-fitrana-to-form-btn"
      ) as HTMLButtonElement;

      standardSelect.value = "silver";
      cashInput.value = "100";
      cashInput.dispatchEvent(new Event("input"));
      expect(statusEl?.textContent).toBe("Debajo del Nisab");
      expect(dueEl?.getAttribute("data-raw-zakat")).toBe("0");

      standardSelect.value = "gold";
      cashInput.value = "40000000";
      cashInput.dispatchEvent(new Event("input"));

      expect(statusEl?.textContent).toBe("Supera el Nisab (2.5%)");
      expect(dueEl?.getAttribute("data-raw-zakat")).toBe("1000000");

      applyBtn.click();
      expect(
        (document.getElementById("donation-amount") as HTMLInputElement).value
      ).toBe("1000000");
      expect(
        (document.getElementById("donation-type") as HTMLSelectElement).value
      ).toBe("zakat");

      const membersInput = document.getElementById(
        "fitrana-members"
      ) as HTMLInputElement;
      const fidyahInput = document.getElementById(
        "fidyah-days"
      ) as HTMLInputElement;
      const fitranaTotalEl = document.getElementById("fitrana-total-due");

      membersInput.value = "4";
      fidyahInput.value = "2";
      membersInput.dispatchEvent(new Event("input"));

      expect(fitranaTotalEl?.getAttribute("data-raw-fitrana")).toBe("140000");
      applyFitranaBtn.click();
      expect(
        (document.getElementById("donation-amount") as HTMLInputElement).value
      ).toBe("140000");
    } finally {
      await close();
    }
  });

  it("should initialize with default attributes when data attributes are omitted", async () => {
    const { close } = createTestDom(`
      <div id="zakat-calculator">
        <input id="zakat-cash" value="100" />
        <button type="button" id="apply-zakat-to-form-btn"></button>
      </div>
      <div id="fitrana-fidyah-calculator">
        <input id="fitrana-members" value="1" />
        <button type="button" id="apply-fitrana-to-form-btn"></button>
      </div>
    `);
    try {
      initZakatCalculator();
      document.getElementById("zakat-cash")?.dispatchEvent(new Event("input"));
      document
        .getElementById("fitrana-members")
        ?.dispatchEvent(new Event("input"));
      document.getElementById("apply-zakat-to-form-btn")?.click();
      document.getElementById("apply-fitrana-to-form-btn")?.click();
      expect(document.getElementById("zakat-calculator")).not.toBeNull();
    } finally {
      await close();
    }
  });
});
