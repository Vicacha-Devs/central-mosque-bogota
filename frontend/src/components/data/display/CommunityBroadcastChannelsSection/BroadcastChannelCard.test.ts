import { getByRole, getByText } from "@testing-library/dom";
import { FALLBACK_BROADCAST_CHANNELS } from "@utils/inbox-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import BroadcastChannelCard from "./BroadcastChannelCard.astro";

describe("BroadcastChannelCard", () => {
  it("should render channel card when channel is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(
      BroadcastChannelCard,
      {
        props: {
          lang: "es",
          joinLabel: "Unirse al canal",
          channel: FALLBACK_BROADCAST_CHANNELS[0],
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: /Canal Oficial de Telegram/i,
        })
      ).toBeInTheDocument();
      expect(getByText(root, /@MezquitaCentralBogota/i)).toBeInTheDocument();
      expect(
        getByRole(root, "link", { name: /Unirse al canal/i })
      ).toHaveAttribute("href", "https://t.me/MezquitaCentralBogota");
    } finally {
      await close();
    }
  });
});
