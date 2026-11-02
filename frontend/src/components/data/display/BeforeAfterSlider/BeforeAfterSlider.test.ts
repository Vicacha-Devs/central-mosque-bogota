import { getByAltText, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import BeforeAfterSlider from "./BeforeAfterSlider.astro";

describe("BeforeAfterSlider", () => {
  it("should render comparison slider with images and caption when valid URLs are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(BeforeAfterSlider, {
      props: {
        beforeUrl: "https://cms.mezquitabogota.org/uploads/before.jpg",
        afterUrl: "https://cms.mezquitabogota.org/uploads/after.jpg",
        beforeAlt: "1995",
        afterAlt: "2026",
        caption: "Restauración de la fachada principal",
      },
    });

    try {
      const slider = root.querySelector("img-comparison-slider");
      expect(slider).toBeInTheDocument();

      const beforeImg = getByAltText(root, "1995");
      expect(beforeImg.getAttribute("src")).toBe(
        "https://cms.mezquitabogota.org/uploads/before.jpg"
      );

      const afterImg = getByAltText(root, "2026");
      expect(afterImg.getAttribute("src")).toBe(
        "https://cms.mezquitabogota.org/uploads/after.jpg"
      );

      const captionEl = getByText(root, "Restauración de la fachada principal");
      expect(captionEl).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should omit slider when unsafe javascript: URL is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(BeforeAfterSlider, {
      props: {
        attrs: {
          beforeUrl: "javascript:alert(1)",
          afterUrl: "https://cms.mezquitabogota.org/uploads/after.jpg",
        },
      },
    });

    try {
      expect(root.querySelector("img-comparison-slider")).toBeNull();
    } finally {
      await close();
    }
  });
});
