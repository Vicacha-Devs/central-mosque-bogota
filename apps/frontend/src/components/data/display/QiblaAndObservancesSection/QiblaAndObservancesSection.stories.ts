import preview from "@storybook/preview";
import {
  getFallbackObservances,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";

import QiblaAndObservancesSection from "./QiblaAndObservancesSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/QiblaAndObservancesSection",
  component: QiblaAndObservancesSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    copy: getIslamSuiteCopy("es"),
    qiblaDirectionDegrees: 64.94,
    distanceToKaabaKm: 11412,
    latitude: 4.6784,
    longitude: -74.0628,
    hijriFormatted: "21 Shawwal 1447 AH",
    observances: getFallbackObservances("es"),
    icsCalendarHref: "/api/prayer-calendar.ics?lang=es",
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    copy: getIslamSuiteCopy("en"),
    observances: getFallbackObservances("en"),
    icsCalendarHref: "/api/prayer-calendar.ics?lang=en",
  },
});
