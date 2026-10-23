import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import VisitorEtiquetteSection from "./VisitorEtiquetteSection.astro";

describe("VisitorEtiquetteSection", () => {
  test("renders default Spanish etiquette and transit items", async () => {
    const { root, close } = await renderAstroComponentToDom(
      VisitorEtiquetteSection,
      {
        props: { lang: "es" },
      }
    );

    expect(root.textContent).toContain("Guía de Etiqueta para Visitantes");
    expect(root.textContent).toContain("Vestimenta Modesta");
    expect(root.textContent).toContain("En TransMilenio");
    await close();
  });

  test("renders custom etiquette override", async () => {
    const { root, close } = await renderAstroComponentToDom(
      VisitorEtiquetteSection,
      {
        props: {
          lang: "en",
          etiquetteItems: [
            {
              icon: "checkroom",
              title: "Custom Rule",
              description: "Custom description",
            },
          ],
        },
      }
    );

    expect(root.textContent).toContain("Visitor Etiquette Guide");
    expect(root.textContent).toContain("Custom Rule");
    await close();
  });
});
