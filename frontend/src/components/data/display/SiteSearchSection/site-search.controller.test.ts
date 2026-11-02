import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import { initSiteSearch } from "./site-search.controller";

describe("initSiteSearch", () => {
  it("should filter result cards and toggle empty state when query or category changes", async () => {
    const { root, close } = createTestDom(`
      <input id="site-search-input" value="" />
      <button type="button" data-search-filter="all">All</button>
      <button type="button" data-search-filter="article">Articles</button>
      <div
        data-search-item
        data-search-category="article"
        data-search-text="historia del islam"
      >
        Card 1
      </div>
      <div
        data-search-item
        data-search-category="event"
        data-search-text="cena comunitaria"
      >
        Card 2
      </div>
      <div id="site-search-empty" class="hidden">No results</div>
    `);

    try {
      initSiteSearch(root);

      const input = root.querySelector<HTMLInputElement>("#site-search-input");
      const cards = root.querySelectorAll<HTMLElement>("[data-search-item]");
      const empty = root.querySelector<HTMLElement>("#site-search-empty");
      const articleBtn = root.querySelector<HTMLButtonElement>(
        "[data-search-filter=\u0022article\u0022]"
      );

      articleBtn?.click();
      expect(cards[0].classList.contains("hidden")).toBe(false);
      expect(cards[1].classList.contains("hidden")).toBe(true);
      expect(empty?.classList.contains("hidden")).toBe(true);

      if (input) {
        input.value = "inexistente";
        input.dispatchEvent(new Event("input"));
      }
      expect(cards[0].classList.contains("hidden")).toBe(true);
      expect(empty?.classList.contains("hidden")).toBe(false);
    } finally {
      await close();
    }
  });
});
