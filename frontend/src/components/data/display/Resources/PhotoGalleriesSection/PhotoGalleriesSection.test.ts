import { getByRole, getByText } from "@testing-library/dom";
import {
  getLocalizedGalleryAlbums,
  getResourcesHubCopy,
} from "@utils/resources-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import PhotoGalleriesSection from "./PhotoGalleriesSection.astro";

describe("PhotoGalleriesSection", () => {
  it("should render photo galleries when albums are passed", async () => {
    const copy = getResourcesHubCopy("es");
    const albums = getLocalizedGalleryAlbums("es");

    const { root, close } = await renderAstroComponentToDom(
      PhotoGalleriesSection,
      {
        props: {
          copy,
          albums,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: copy.galleriesTitle,
        })
      ).toBeInTheDocument();

      expect(getByText(root, albums[0].title)).toBeInTheDocument();
      expect(getByText(root, albums[0].mediaFolderPath)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
