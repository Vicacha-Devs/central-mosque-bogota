import preview from "@storybook/preview";

import RamadanTimeSlotCard from "./RamadanTimeSlotCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/RamadanScheduleBanner/RamadanTimeSlotCard",
  component: RamadanTimeSlotCard,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    icon: "restaurant",
    label: "Iftar (Maghrib)",
    time: "06:06 PM",
    featured: true,
  },
});

export const Default = meta.story({});

export const StandardSlot = meta.story({
  args: {
    icon: "wb_twilight",
    label: "Fin de Suhoor (Fajr)",
    time: "04:42 AM",
    featured: false,
  },
});
