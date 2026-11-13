import { getByRole, getByText } from "@testing-library/dom";
import {
  getLocalizedGalleryAlbums,
  getResourcesHubCopy,
} from "@utils/resources-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import PhotoGalleryAlbumCard from "./PhotoGalleryAlbumCard.astro";

describe("PhotoGalleryAlbumCard", () => {
  it("should render album card when album is provided", async () => {
    const copy = getResourcesHubCopy("es");
    const [album] = getLocalizedGalleryAlbums("es");

    const { root, close } = await renderAstroComponentToDom(
      PhotoGalleryAlbumCard,
      {
        props: {
          album,
          photosCountLabel: copy.photosCountLabel,
          mediaFolderLabel: copy.mediaFolderLabel,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", { name: album.title })
      ).toBeInTheDocument();
      expect(getByText(root, album.mediaFolderPath)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
