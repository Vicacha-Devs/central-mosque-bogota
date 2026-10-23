import preview from "@storybook/preview";
import { FALLBACK_BROADCAST_CHANNELS } from "@utils/inbox-mocks";

import BroadcastChannelCard from "./BroadcastChannelCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/BroadcastChannelCard",
  component: BroadcastChannelCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    joinLabel: "Unirse al canal",
    channel: FALLBACK_BROADCAST_CHANNELS[0],
  },
});

export const Default = meta.story({});

export const TelegramEnglish = meta.story({
  args: {
    lang: "en",
    joinLabel: "Join channel",
    channel: FALLBACK_BROADCAST_CHANNELS[1],
  },
});
