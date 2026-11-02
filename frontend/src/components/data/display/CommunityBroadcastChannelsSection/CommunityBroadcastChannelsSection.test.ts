import * as strapiService from "@services/strapi";
import { getByRole, getByText } from "@testing-library/dom";
import {
  FALLBACK_BROADCAST_ARCHIVE,
  FALLBACK_BROADCAST_CHANNELS,
} from "@utils/inbox-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { vi } from "vitest";

import CommunityBroadcastChannelsSection from "./CommunityBroadcastChannelsSection.astro";

describe("CommunityBroadcastChannelsSection", () => {
  it("should render broadcast section when props are passed", async () => {
    const { root, close } = await renderAstroComponentToDom(
      CommunityBroadcastChannelsSection,
      {
        props: {
          lang: "es",
          channels: FALLBACK_BROADCAST_CHANNELS,
          archiveItems: FALLBACK_BROADCAST_ARCHIVE,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: /Canales Oficiales y Boletín Comunitario/i,
        })
      ).toBeInTheDocument();

      expect(
        getByText(root, /Canales Directos en Tiempo Real/i)
      ).toBeInTheDocument();
      expect(
        getByText(root, /Suscripción Segmentada por Temas \(Doble Opt-In\)/i)
      ).toBeInTheDocument();

      const submitBtn = getByRole(root, "button", {
        name: /Suscribirme a Difusiones/i,
      });
      expect(submitBtn).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should fetch channels and archive from Strapi when props are omitted", async () => {
    const spy = vi
      .spyOn(strapiService, "fetchStrapiData")
      .mockResolvedValueOnce({
        publicChannelLinks: FALLBACK_BROADCAST_CHANNELS,
      })
      .mockResolvedValueOnce(FALLBACK_BROADCAST_ARCHIVE);

    const { root, close } = await renderAstroComponentToDom(
      CommunityBroadcastChannelsSection,
      {
        props: { lang: "en" },
      }
    );

    try {
      expect(root.querySelector("section")).not.toBeNull();
    } finally {
      spy.mockRestore();
      await close();
    }
  });
});
