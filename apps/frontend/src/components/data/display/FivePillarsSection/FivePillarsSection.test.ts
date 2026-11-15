import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import FivePillarsSection from "./FivePillarsSection.astro";

describe("FivePillarsSection", () => {
  test("renders all 5 pillars of Islam with Arabic names and transliterations", async () => {
    const { root, close } = await renderAstroComponentToDom(
      FivePillarsSection,
      {
        props: { lang: "es" },
      }
    );

    expect(root.textContent).toContain("Ash-Shahadah");
    expect(root.textContent).toContain("As-Salah");
    expect(root.textContent).toContain("Az-Zakah");
    expect(root.textContent).toContain("As-Sawm");
    expect(root.textContent).toContain("Al-Hajj");
    await close();
  });
});
