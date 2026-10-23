import { getByRole, getByText } from "@testing-library/dom";
import { getLocalizedAboutPageData } from "@utils/institutional-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import AboutInstitutionalSections from "./AboutInstitutionalSections.astro";

describe("AboutInstitutionalSections", () => {
  it("should render about sections when props are passed", async () => {
    const content = getLocalizedAboutPageData("en");
    const { root, close } = await renderAstroComponentToDom(
      AboutInstitutionalSections,
      {
        props: {
          lang: "en",
          content,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: content.missionTitle,
        })
      ).toBeInTheDocument();
      expect(
        getByRole(root, "heading", {
          name: content.visionTitle,
        })
      ).toBeInTheDocument();
      const timelineTitle = content.historyTimeline[0].title;
      const archTitle = content.architectureHighlights[0].title;
      expect(getByText(root, timelineTitle)).toBeInTheDocument();
      expect(getByText(root, archTitle)).toBeInTheDocument();
      expect(getByText(root, content.leaders[0].name)).toBeInTheDocument();
      expect(getByText(root, content.leaders[0].roleTitle)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
