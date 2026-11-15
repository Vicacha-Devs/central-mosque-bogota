import { getDetailedMediaHighlights } from "@utils/localized-mocks";
import type { ComponentProps } from "astro/types";

import MediaArchiveCard from "./MediaArchiveCard.astro";

type MediaArchiveCardProps = ComponentProps<typeof MediaArchiveCard>;

export default {
  component: MediaArchiveCard,
  title: "Data/Display/Media/MediaArchiveCard",
};

export const Default = {
  args: {
    item: getDetailedMediaHighlights("es")[0],
    listenOrWatchLabel: "Escuchar o Ver",
  } satisfies MediaArchiveCardProps,
};
