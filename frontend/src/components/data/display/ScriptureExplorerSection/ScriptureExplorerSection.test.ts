import * as strapiService from "@services/strapi";
import { getAllByRole, getByRole, getByText } from "@testing-library/dom";
import { getFallbackScriptureBundle } from "@utils/islam-suite-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { vi } from "vitest";

import ScriptureExplorerSection from "./ScriptureExplorerSection.astro";

describe("ScriptureExplorerSection", () => {
  it("should render scripture tabs when props are passed", async () => {
    const esBundle = getFallbackScriptureBundle("es");

    const { root, close } = await renderAstroComponentToDom(
      ScriptureExplorerSection,
      {
        props: {
          lang: "es",
          ayatOverride: esBundle.ayat,
          hadithsOverride: esBundle.hadiths,
          asmaOverride: esBundle.asmaOfTheDay,
          tasbihPresetsOverride: esBundle.tasbihPresets,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: "Explorador de Escrituras e Inspiración Diaria",
        })
      ).toBeInTheDocument();

      const tabs = getAllByRole(root, "tab");
      expect(tabs).toHaveLength(4);
      expect(tabs[0]).toHaveTextContent("Inspiración del Día");
      expect(tabs[1]).toHaveTextContent("Aleyas del Corán");
      expect(tabs[2]).toHaveTextContent("Hadices Auténticos");
      expect(tabs[3]).toHaveTextContent("Tasbih y Adhkar");

      expect(getByText(root, "Ar-Rahman")).toBeInTheDocument();

      const untranslatableNodes = root.querySelectorAll(
        "[translate=\u0022no\u0022]"
      );
      expect(untranslatableNodes.length).toBeGreaterThan(0);

      const tasbihCards = root.querySelectorAll("[data-tasbih-card]");
      expect(tasbihCards).toHaveLength(4);
    } finally {
      await close();
    }
  });

  it("should map live Strapi daily scripture inspiration when overrides are omitted", async () => {
    const spy = vi
      .spyOn(strapiService, "fetchIslamSuiteFromStrapi")
      .mockResolvedValueOnce({
        ayahOfTheDay: {
          id: "ayah-live",
          referenceKey: "1:1",
          surahNameAr: "الفاتحة",
          surahNameTranslit: "Al-Fatihah",
          arabicUthmani: "بِسْمِ اللَّهِ",
          transliteration: "Bismillah",
          translations: {},
          reflections: {},
        },
        hadithOfTheDay: {
          id: "hadith-live",
          hadithNumber: "1",
          grading: "Sahih",
          arabicText: "إنما الأعمال بالنيات",
          collectionNames: {},
          narrator: {},
          translations: {},
          keyTakeaways: {},
        },
        nameOfAllahOfTheDay: {
          number: 1,
          arabic: "ٱلرَّحْمَـٰنُ",
          transliteration: "Ar-Rahman-Live",
          meanings: {},
          reflections: {},
          quranReference: "55:1",
        },
      });

    const { root, close } = await renderAstroComponentToDom(
      ScriptureExplorerSection,
      {
        props: { lang: "en" },
      }
    );

    try {
      expect(getByText(root, "Ar-Rahman-Live")).toBeInTheDocument();
    } finally {
      spy.mockRestore();
      await close();
    }
  });
});
