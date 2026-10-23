import preview from "@storybook/preview";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";

import ScriptureHadithCard from "./ScriptureHadithCard.astro";

const esBundle = getFallbackScriptureBundle("es");
const esCopy = getIslamSuiteCopy("es");

const meta = preview.meta({
  title: "Components/Data/Display/ScriptureExplorerSection/ScriptureHadithCard",
  component: ScriptureHadithCard,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    hadith: esBundle.hadiths[0],
    takeawayLabel: esCopy.takeawayLabel,
  },
});

export const Default = meta.story({});
