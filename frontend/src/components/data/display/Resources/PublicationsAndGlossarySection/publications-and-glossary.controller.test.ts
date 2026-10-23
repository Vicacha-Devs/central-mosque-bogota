import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initGlossaryFilter } from "./publications-and-glossary.controller";

describe("initGlossaryFilter", () => {
  it("should filter glossary cards by letter group when filter buttons are clicked", async () => {
    const { root, close } = createTestDom(`
      <button type="button" data-glossary-letter="ALL">All</button>
      <button type="button" data-glossary-letter="A-F">A-F</button>
      <div data-glossary-card="A-F">Adhan</div>
      <div data-glossary-card="S-Z">Zakat</div>
    `);

    try {
      initGlossaryFilter(root);

      const afBtn = root.querySelector<HTMLButtonElement>(
        "[data-glossary-letter=\u0022A-F\u0022]"
      );
      const allBtn = root.querySelector<HTMLButtonElement>(
        "[data-glossary-letter=\u0022ALL\u0022]"
      );
      const cards = root.querySelectorAll<HTMLElement>("[data-glossary-card]");

      afBtn?.click();
      expect(cards[0].style.display).toBe("");
      expect(cards[1].style.display).toBe("none");

      allBtn?.click();
      expect(cards[0].style.display).toBe("");
      expect(cards[1].style.display).toBe("");
    } finally {
      await close();
    }
  });
});
