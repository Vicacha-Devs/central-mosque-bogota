import { getByText } from "@testing-library/dom";
import {
  getFallbackScriptureBundle,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import ScriptureHadithCard from "./ScriptureHadithCard.astro";

describe("ScriptureHadithCard", () => {
  it("should render hadith card when hadith is provided", async () => {
    const hadith = getFallbackScriptureBundle("es").hadiths[0];
    const copy = getIslamSuiteCopy("es");

    const { root, close } = await renderAstroComponentToDom(
      ScriptureHadithCard,
      {
        props: {
          hadith,
          takeawayLabel: copy.takeawayLabel,
        },
      }
    );

    try {
      expect(
        getByText(root, `${hadith.collectionName} #${hadith.hadithNumber}`)
      ).toBeInTheDocument();
      expect(getByText(root, hadith.grading)).toBeInTheDocument();
      expect(getByText(root, hadith.arabicText)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
