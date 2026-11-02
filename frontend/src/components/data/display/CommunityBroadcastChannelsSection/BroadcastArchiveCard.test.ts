import { getByRole, getByText } from "@testing-library/dom";
import { FALLBACK_BROADCAST_ARCHIVE } from "@utils/inbox-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import BroadcastArchiveCard from "./BroadcastArchiveCard.astro";

describe("BroadcastArchiveCard", () => {
  it("should render archive card when item is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(
      BroadcastArchiveCard,
      {
        props: {
          lang: "en",
          item: FALLBACK_BROADCAST_ARCHIVE[0],
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: /Friday Jumu'ah Reminder/i,
        })
      ).toBeInTheDocument();
      expect(getByText(root, /Umm al-Qura 1447 AH/i)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
