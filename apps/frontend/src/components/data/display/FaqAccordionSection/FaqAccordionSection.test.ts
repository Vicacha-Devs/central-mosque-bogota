import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import FaqAccordionSection from "./FaqAccordionSection.astro";

describe("FaqAccordionSection", () => {
  test("renders FAQ questions and answers inside accordion items", async () => {
    const { root, close } = await renderAstroComponentToDom(
      FaqAccordionSection,
      {
        props: {
          lang: "es",
          faqs: [
            {
              question: "¿Pueden visitar la Mezquita?",
              answer: "¡Sí, bienvenidos!",
            },
          ],
        },
      }
    );

    expect(root.textContent).toContain("¿Pueden visitar la Mezquita?");
    expect(root.textContent).toContain("¡Sí, bienvenidos!");
    await close();
  });
});
