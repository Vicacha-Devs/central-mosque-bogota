import type { ComponentProps } from "astro/types";

import EventsCatalogSection from "./EventsCatalogSection.astro";

type EventsCatalogSectionProps = ComponentProps<typeof EventsCatalogSection>;

export default {
  component: EventsCatalogSection,
  title: "Data/Display/Events/EventsCatalogSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies EventsCatalogSectionProps,
};
