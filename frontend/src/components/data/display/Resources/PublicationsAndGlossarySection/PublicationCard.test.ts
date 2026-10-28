import { getByRole, getByText } from "@testing-library/dom";
import {
  getLocalizedPublications,
  getResourcesHubCopy,
} from "@utils/resources-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import PublicationCard from "./PublicationCard.astro";

describe("PublicationCard", () => {
  it("should render publication card when item is provided", async () => {
    const copy = getResourcesHubCopy("es");
    const [publication] = getLocalizedPublications("es");

    const { root, close } = await renderAstroComponentToDom(PublicationCard, {
      props: {
        publication,
        pagesLabel: copy.pagesLabel,
        downloadLabel: copy.downloadLabel,
      },
    });

    try {
      expect(
        getByRole(root, "heading", { name: publication.title })
      ).toBeInTheDocument();
      expect(getByText(root, publication.mediaFolderPath)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
