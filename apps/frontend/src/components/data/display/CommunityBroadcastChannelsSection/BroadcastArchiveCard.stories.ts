import preview from "@storybook/preview";
import { FALLBACK_BROADCAST_ARCHIVE } from "@utils/inbox-mocks";

import BroadcastArchiveCard from "./BroadcastArchiveCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/BroadcastArchiveCard",
  component: BroadcastArchiveCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    item: FALLBACK_BROADCAST_ARCHIVE[0],
  },
});

export const Default = meta.story({});

export const EnglishTranslation = meta.story({
  args: {
    lang: "en",
    item: FALLBACK_BROADCAST_ARCHIVE[0],
  },
});
