import preview from "@storybook/preview";
import {
  FALLBACK_BROADCAST_ARCHIVE,
  FALLBACK_BROADCAST_CHANNELS,
} from "@utils/inbox-mocks";

import CommunityBroadcastChannelsSection from "./CommunityBroadcastChannelsSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/CommunityBroadcastChannelsSection",
  component: CommunityBroadcastChannelsSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    channels: FALLBACK_BROADCAST_CHANNELS,
    archiveItems: FALLBACK_BROADCAST_ARCHIVE,
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    channels: FALLBACK_BROADCAST_CHANNELS,
    archiveItems: FALLBACK_BROADCAST_ARCHIVE,
  },
});
