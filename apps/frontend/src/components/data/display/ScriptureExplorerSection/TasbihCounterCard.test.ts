import { getByRole, getByText } from "@testing-library/dom";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import TasbihCounterCard from "./TasbihCounterCard.astro";

describe("TasbihCounterCard", () => {
  it("should render tasbih card when item is provided", async () => {
    const preset = getFallbackScriptureBundle("es").tasbihPresets[0];
    const copy = getIslamSuiteCopy("es");

    const { root, close } = await renderAstroComponentToDom(TasbihCounterCard, {
      props: {
        preset,
        completedLabel: copy.tasbihCompletedLabel,
        incrementLabel: copy.tasbihIncrementLabel,
        resetLabel: copy.tasbihResetLabel,
      },
    });

    try {
      expect(getByText(root, preset.arabic)).toBeInTheDocument();
      expect(
        getByText(root, `0 / ${String(preset.targetCount)}`)
      ).toBeInTheDocument();
      expect(
        getByRole(root, "button", { name: copy.tasbihIncrementLabel })
      ).toBeInTheDocument();
      expect(
        getByRole(root, "button", { name: copy.tasbihResetLabel })
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
