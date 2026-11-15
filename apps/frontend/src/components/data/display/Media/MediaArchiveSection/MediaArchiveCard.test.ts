import { getDetailedMediaHighlights } from "@utils/localized-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, test } from "vitest";

import MediaArchiveCard from "./MediaArchiveCard.astro";

describe("MediaArchiveCard", () => {
  test("renders media item metadata, duration, and watch link", async () => {
    const item = getDetailedMediaHighlights("es")[0];
    const { root, close } = await renderAstroComponentToDom(MediaArchiveCard, {
      props: {
        item,
        listenOrWatchLabel: "Escuchar o Ver",
      },
    });

    expect(root.textContent).toContain(item.title);
    expect(root.textContent).toContain(item.speakerName);
    expect(root.textContent).toContain(item.duration);
    expect(root.textContent).toContain("Escuchar o Ver");
    expect(
      root.querySelector(`[data-media-type="${item.type}"]`)
    ).not.toBeNull();
    await close();
  });
});
