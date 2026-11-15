import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import MediaArchiveSection from "./MediaArchiveSection.astro";

describe("MediaArchiveSection", () => {
  test("renders live spotlight banner, RSS link, filter tabs, and media cards", async () => {
    const { root, close } = await renderAstroComponentToDom(
      MediaArchiveSection,
      {
        props: { lang: "es" },
      }
    );

    expect(root.textContent).toContain("Podcast RSS 2.0 (ES)");
    expect(root.querySelectorAll("[data-media-filter]").length).toBe(4);
    expect(root.querySelectorAll("[data-media-type]").length).toBeGreaterThan(
      0
    );
    await close();
  });
});
