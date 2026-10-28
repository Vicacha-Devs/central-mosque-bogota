import * as strapiService from "@services/strapi";
import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { vi } from "vitest";

import QiblaAndObservancesSection from "./QiblaAndObservancesSection.astro";

describe("QiblaAndObservancesSection", () => {
  it("should render qibla section when props are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(
      QiblaAndObservancesSection,
      {
        props: { lang: "es" },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: "Dirección de la Qibla y Horarios Litúrgicos",
        })
      ).toBeInTheDocument();

      expect(getByText(root, /64\.67° ENE/)).toBeInTheDocument();
      expect(getByText(root, /12\.286 km/)).toBeInTheDocument();
      expect(getByText(root, "12:15 PM")).toBeInTheDocument();
      expect(getByText(root, "12:45 PM")).toBeInTheDocument();

      expect(getByText(root, "Día de Arafah")).toBeInTheDocument();
      expect(
        getByText(root, "Eid al-Adha (Fiesta del Sacrificio)")
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should map live Qibla and Hijri observances when Strapi returns data", async () => {
    const spy = vi
      .spyOn(strapiService, "fetchIslamSuiteFromStrapi")
      .mockResolvedValueOnce({
        origin: {},
        direction: { degrees: 65.123 },
        distance: {},
      })
      .mockResolvedValueOnce({
        observances: [
          {
            id: "obs-live",
            hijriFormatted: "10 Muharram 1448",
            estimatedGregorianDate: "2026-06-25",
            daysUntil: 15,
            category: "fasting",
            fastingRecommendedOrObligatory: "recommended",
            titles: {},
            descriptions: {},
          },
        ],
      });

    const { root, close } = await renderAstroComponentToDom(
      QiblaAndObservancesSection,
      {
        props: { lang: "ar" },
      }
    );

    try {
      expect(getByText(root, /65\.12°/)).toBeInTheDocument();
      expect(getByText(root, "obs-live")).toBeInTheDocument();
    } finally {
      spy.mockRestore();
      await close();
    }
  });
});
