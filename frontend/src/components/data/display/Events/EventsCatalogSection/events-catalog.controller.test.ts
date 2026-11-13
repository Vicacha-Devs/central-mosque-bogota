import { createTestDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import { initEventFilters } from "./events-catalog.controller";

describe("events-catalog.controller", () => {
  test("filters event cards by data-event-category", async () => {
    const { root, close } = createTestDom(`
      <button type="button" data-event-filter="all">All</button>
      <button type="button" data-event-filter="Educación">Educación</button>
      <div id="e1" data-event-category="Educación">Event 1</div>
      <div id="e2" data-event-category="Comunidad">Event 2</div>
    `);

    initEventFilters();

    const eduBtn = root.querySelector<HTMLButtonElement>(
      "[data-event-filter=\u0022Educación\u0022]"
    );
    eduBtn?.click();

    expect(root.querySelector("#e1")?.classList.contains("hidden")).toBe(false);
    expect(root.querySelector("#e2")?.classList.contains("hidden")).toBe(true);
    await close();
  });
});
