import { createTestDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import { initMediaFilters } from "./media-archive.controller";

describe("media-archive.controller", () => {
  test("filters media cards by data-media-type", async () => {
    const { root, close } = createTestDom(`
      <button type="button" data-media-filter="all">All</button>
      <button type="button" data-media-filter="podcast">Podcast</button>
      <div id="c1" data-media-type="khutbah">Khutbah</div>
      <div id="c2" data-media-type="podcast">Podcast</div>
    `);

    initMediaFilters();

    const podcastBtn = root.querySelector<HTMLButtonElement>(
      "[data-media-filter=\u0022podcast\u0022]"
    );
    podcastBtn?.click();

    expect(root.querySelector("#c1")?.classList.contains("hidden")).toBe(true);
    expect(root.querySelector("#c2")?.classList.contains("hidden")).toBe(false);
    await close();
  });
});
