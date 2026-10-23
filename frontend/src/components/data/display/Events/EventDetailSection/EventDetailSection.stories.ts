import preview from "@storybook/preview";
import { getDetailedEvents } from "@utils/localized-mocks";

import EventDetailSection from "./EventDetailSection.astro";

const esEvents = getDetailedEvents("es");
const enEvents = getDetailedEvents("en");
const arEvents = getDetailedEvents("ar");
const trEvents = getDetailedEvents("tr");

const meta = preview.meta({
  title: "Components/Data/Display/Events/EventDetailSection",
  component: EventDetailSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    eventItem: esEvents[0],
    relatedEvents: esEvents.slice(1),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    eventItem: enEvents[0],
    relatedEvents: enEvents.slice(1),
  },
});

export const ArabicLocale = meta.story({
  args: {
    lang: "ar",
    eventItem: arEvents[0],
    relatedEvents: arEvents.slice(1),
  },
});

export const TurkishLocale = meta.story({
  args: {
    lang: "tr",
    eventItem: trEvents[0],
    relatedEvents: trEvents.slice(1),
  },
});
