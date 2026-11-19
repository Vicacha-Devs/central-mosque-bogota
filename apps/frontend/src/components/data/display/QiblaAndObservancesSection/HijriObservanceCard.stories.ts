import preview from "@storybook/preview";
import {
  getFallbackObservances,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";

import HijriObservanceCard from "./HijriObservanceCard.astro";

const esObs = getFallbackObservances("es")[0];
const esCopy = getIslamSuiteCopy("es");

const meta = preview.meta({
  title:
    "Components/Data/Display/QiblaAndObservancesSection/HijriObservanceCard",
  component: HijriObservanceCard,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    observance: esObs,
    copy: esCopy,
  },
});

export const Default = meta.story({});
