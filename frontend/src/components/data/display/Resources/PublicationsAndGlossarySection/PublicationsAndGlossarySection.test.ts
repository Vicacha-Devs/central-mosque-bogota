import { getByRole, getByText } from "@testing-library/dom";
import {
  getLocalizedGlossaryTerms,
  getLocalizedPublications,
  getResourcesHubCopy,
} from "@utils/resources-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import PublicationsAndGlossarySection from "./PublicationsAndGlossarySection.astro";

describe("PublicationsAndGlossarySection", () => {
  it("should render resources section when props are passed", async () => {
    const copy = getResourcesHubCopy("es");
    const publications = getLocalizedPublications("es");
    const glossaryTerms = getLocalizedGlossaryTerms("es");

    const { root, close } = await renderAstroComponentToDom(
      PublicationsAndGlossarySection,
      {
        props: {
          copy,
          publications,
          glossaryTerms,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: copy.publicationsTitle,
        })
      ).toBeInTheDocument();

      expect(
        getByRole(root, "heading", {
          name: copy.glossaryTitle,
        })
      ).toBeInTheDocument();

      expect(getByText(root, publications[0].title)).toBeInTheDocument();
      expect(getByText(root, glossaryTerms[0].term)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
