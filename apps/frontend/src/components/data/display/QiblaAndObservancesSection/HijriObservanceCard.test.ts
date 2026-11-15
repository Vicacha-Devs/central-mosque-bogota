import { getByRole, getByText } from "@testing-library/dom";
import {
  getFallbackObservances,
  getIslamSuiteCopy,
} from "@utils/islam-suite-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import HijriObservanceCard from "./HijriObservanceCard.astro";

describe("HijriObservanceCard", () => {
  it("should render observance card when item is provided", async () => {
    const observance = getFallbackObservances("es")[0];
    const copy = getIslamSuiteCopy("es");

    const { root, close } = await renderAstroComponentToDom(
      HijriObservanceCard,
      {
        props: {
          observance,
          copy,
        },
      }
    );

    try {
      expect(getByText(root, observance.hijriFormatted)).toBeInTheDocument();
      expect(
        getByRole(root, "heading", { name: observance.title })
      ).toBeInTheDocument();
      expect(getByText(root, copy.fastingSunnahLabel)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
