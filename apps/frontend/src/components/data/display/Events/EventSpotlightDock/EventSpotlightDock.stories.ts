import preview from "@storybook/preview";
import { getLocalizedMocks } from "@utils/localized-mocks";

import EventSpotlightDock from "./EventSpotlightDock.astro";

const esMocks = getLocalizedMocks("es");
const enMocks = getLocalizedMocks("en");
const arMocks = getLocalizedMocks("ar");
const trMocks = getLocalizedMocks("tr");

const meta = preview.meta({
  title: "Components/Data/Display/Events/EventSpotlightDock",
  component: EventSpotlightDock,
  tags: ["autodocs", "version:0.1.0", "new"],
  args: {
    spotlights: esMocks.eventSpotlights,
  },
});

export const DefaultSpanish = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    spotlights: enMocks.eventSpotlights,
  },
});

export const ArabicRtlLocale = meta.story({
  args: {
    spotlights: arMocks.eventSpotlights,
  },
});

export const TurkishLocale = meta.story({
  args: {
    spotlights: trMocks.eventSpotlights,
  },
});
