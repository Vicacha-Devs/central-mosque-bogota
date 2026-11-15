import { getByText } from "@testing-library/dom";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import ScriptureAyahCard from "./ScriptureAyahCard.astro";

describe("ScriptureAyahCard", () => {
  it("should render ayah card when ayah is provided", async () => {
    const ayah = getFallbackScriptureBundle("es").ayat[0];
    const copy = getIslamSuiteCopy("es");

    const { root, close } = await renderAstroComponentToDom(ScriptureAyahCard, {
      props: {
        ayah,
        listenRecitationLabel: copy.listenRecitationLabel,
      },
    });

    try {
      expect(getByText(root, ayah.referenceKey)).toBeInTheDocument();
      expect(getByText(root, ayah.arabicUthmani)).toHaveAttribute(
        "translate",
        "no"
      );
      expect(
        getByText(root, copy.listenRecitationLabel).closest("a")
      ).toHaveAttribute("href", ayah.audioUrl);
    } finally {
      await close();
    }
  });
});
