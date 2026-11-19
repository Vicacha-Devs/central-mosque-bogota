import preview from "@storybook/preview";
import { getFallbackScriptureBundle } from "@utils/islam-suite-mocks";

import ScriptureExplorerSection from "./ScriptureExplorerSection.astro";

const esBundle = getFallbackScriptureBundle("es");
const enBundle = getFallbackScriptureBundle("en");

const meta = preview.meta({
  title: "Components/Data/Display/ScriptureExplorerSection",
  component: ScriptureExplorerSection,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    lang: "es",
    ayatOverride: esBundle.ayat,
    hadithsOverride: esBundle.hadiths,
    asmaOverride: esBundle.asmaOfTheDay,
    tasbihPresetsOverride: esBundle.tasbihPresets,
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    ayatOverride: enBundle.ayat,
    hadithsOverride: enBundle.hadiths,
    asmaOverride: enBundle.asmaOfTheDay,
    tasbihPresetsOverride: enBundle.tasbihPresets,
  },
});
