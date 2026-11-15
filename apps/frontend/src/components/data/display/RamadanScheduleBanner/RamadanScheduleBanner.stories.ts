import preview from "@storybook/preview";

import RamadanScheduleBanner from "./RamadanScheduleBanner.astro";

const meta = preview.meta({
  title: "Components/Data/Display/RamadanScheduleBanner",
  component: RamadanScheduleBanner,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    suhoorTime: "04:42 AM",
    iftarTime: "06:06 PM",
    taraweehTime: "07:30 PM",
  },
});

export const Default = meta.story({});
