import preview from "@storybook/preview";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";

import ScriptureAyahCard from "./ScriptureAyahCard.astro";

const esBundle = getFallbackScriptureBundle("es");
const esCopy = getIslamSuiteCopy("es");

const meta = preview.meta({
  title: "Components/Data/Display/ScriptureExplorerSection/ScriptureAyahCard",
  component: ScriptureAyahCard,
  tags: ["autodocs", "version:1.0.0"],
  args: {
    ayah: esBundle.ayat[0],
    listenRecitationLabel: esCopy.listenRecitationLabel,
  },
});

export const Default = meta.story({});
