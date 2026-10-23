import preview from "@storybook/preview";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";

import TasbihCounterCard from "./TasbihCounterCard.astro";

const esBundle = getFallbackScriptureBundle("es");
const esCopy = getIslamSuiteCopy("es");

const meta = preview.meta({
  title: "Components/Data/Display/ScriptureExplorerSection/TasbihCounterCard",
  component: TasbihCounterCard,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    preset: esBundle.tasbihPresets[0],
    completedLabel: esCopy.tasbihCompletedLabel,
    incrementLabel: esCopy.tasbihIncrementLabel,
    resetLabel: esCopy.tasbihResetLabel,
  },
});

export const Default = meta.story({});
