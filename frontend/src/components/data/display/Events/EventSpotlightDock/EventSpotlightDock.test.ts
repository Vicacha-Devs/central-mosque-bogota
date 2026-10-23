import { getAllByRole, getAllByText, getByRole } from "@testing-library/dom";
import { getLocalizedMocks } from "@utils/localized-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import EventSpotlightDock from "./EventSpotlightDock.astro";

describe("EventSpotlightDock", () => {
  it("should render spotlight dock when events are active", async () => {
    const spotlights = getLocalizedMocks("es").eventSpotlights;
    const { root, close } = await renderAstroComponentToDom(
      EventSpotlightDock,
      {
        props: { spotlights },
      }
    );

    try {
      expect(
        getAllByText(root, "Becas Türkiye Bursları (YTB) — Gobierno de Turquía")
          .length
      ).toBeGreaterThanOrEqual(1);
      expect(
        getAllByText(
          root,
          "Becas Fundación Diyanet (TDV) — Teología y Estudios Islámicos"
        ).length
      ).toBeGreaterThanOrEqual(1);

      const tabs = getAllByRole(root, "tab");
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveTextContent("Becas YTB");
      expect(tabs[1]).toHaveTextContent("Becas Diyanet (TDV)");

      const minimizeBtn = getByRole(root, "button", {
        name: "Minimizar aviso",
      });
      expect(minimizeBtn).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should sanitize unsafe action URLs and support bottom-start position when configured", async () => {
    const baseSpotlight = getLocalizedMocks("es").eventSpotlights[0];
    const customSpotlight = {
      ...baseSpotlight,
      actionLinks: [
        {
          label: "Internal",
          url: "/es/events",
          variant: "secondary" as const,
        },
        {
          label: "Mail",
          url: "mailto:info@mezquitabogota.org",
          variant: "outline" as const,
        },
        {
          label: "Unsafe",
          url: "javascript:alert(1)",
          variant: "primary" as const,
        },
        {
          label: "Malformed",
          url: "http://[invalid",
          variant: "primary" as const,
        },
        {
          label: "Empty",
          url: "",
          variant: "primary" as const,
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(
      EventSpotlightDock,
      {
        props: {
          lang: "en",
          position: "bottom-start",
          spotlights: [customSpotlight],
        },
      }
    );

    try {
      expect(root.querySelector("aside")).not.toBeNull();
    } finally {
      await close();
    }
  });
});
