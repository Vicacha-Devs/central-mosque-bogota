import * as strapiService from "@services/strapi";
import { getByRole, getByText } from "@testing-library/dom";
import { getUrgentAlertFallback } from "@utils/inbox-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { vi } from "vitest";

import UrgentAlertBanner from "./UrgentAlertBanner.astro";

describe("UrgentAlertBanner", () => {
  it("should render alert banner when banner is active", async () => {
    const { root, close } = await renderAstroComponentToDom(UrgentAlertBanner, {
      props: {
        lang: "es",
        banner: getUrgentAlertFallback("es"),
      },
    });

    try {
      const alertRegion = getByRole(root, "status");
      expect(alertRegion).toBeInTheDocument();
      expect(
        getByText(
          root,
          /Oración del Viernes \(Jumu'ah\) y Servicios Comunitarios/i
        )
      ).toBeInTheDocument();

      const ctaLink = getByRole(root, "link", {
        name: /Agendar Servicio o Visita/i,
      });
      expect(ctaLink).toHaveAttribute("href", "/es/community-services");

      const dismissButton = getByRole(root, "button", {
        name: /Cerrar aviso/i,
      });
      expect(dismissButton).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should fetch banner from Strapi when banner prop is omitted", async () => {
    const spy = vi
      .spyOn(strapiService, "fetchStrapiData")
      .mockResolvedValueOnce([
        {
          ...getUrgentAlertFallback("en"),
          title: "Live Alert Title",
          severity: "urgent",
        },
      ]);

    const { root, close } = await renderAstroComponentToDom(UrgentAlertBanner, {
      props: { lang: "en" },
    });

    try {
      expect(getByText(root, "Live Alert Title")).toBeInTheDocument();
    } finally {
      spy.mockRestore();
      await close();
    }
  });
});
