import preview from "@storybook/preview";

import ServiceDeskIntakeSection from "./ServiceDeskIntakeSection.astro";

const meta = preview.meta({
  title: "Components/Actions/ServiceDeskIntakeSection",
  component: ServiceDeskIntakeSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
  },
});
