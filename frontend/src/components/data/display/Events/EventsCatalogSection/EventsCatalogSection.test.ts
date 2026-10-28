import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import EventsCatalogSection from "./EventsCatalogSection.astro";

describe("EventsCatalogSection", () => {
  test("renders category filter buttons and event cards", async () => {
    const { root, close } = await renderAstroComponentToDom(
      EventsCatalogSection,
      {
        props: { lang: "es" },
      }
    );

    expect(root.querySelectorAll("[data-event-filter]").length).toBeGreaterThan(
      1
    );
    expect(
      root.querySelectorAll("[data-event-category]").length
    ).toBeGreaterThan(0);
    await close();
  });
});
