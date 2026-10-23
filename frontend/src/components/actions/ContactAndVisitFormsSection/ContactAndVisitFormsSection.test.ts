import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import ContactAndVisitFormsSection from "./ContactAndVisitFormsSection.astro";

describe("ContactAndVisitFormsSection", () => {
  test("renders general contact and guided visit forms in Spanish", async () => {
    const { root, close } = await renderAstroComponentToDom(
      ContactAndVisitFormsSection,
      {
        props: { lang: "es" },
      }
    );

    expect(root.querySelector("#contact-form")).not.toBeNull();
    expect(root.querySelector("#visit-form")).not.toBeNull();
    expect(root.textContent).toContain("Envíanos un Mensaje");
    expect(root.textContent).toContain("Agendar Visita Guiada");
    await close();
  });

  test("renders localized English copy", async () => {
    const { root, close } = await renderAstroComponentToDom(
      ContactAndVisitFormsSection,
      {
        props: { lang: "en" },
      }
    );

    expect(root.textContent).toContain("Send Us a Message");
    expect(root.textContent).toContain("Book a Guided Visit");
    await close();
  });
});
