import preview from "@storybook/preview";
import {
  getLocalizedGalleryAlbums,
  getResourcesHubCopy,
} from "@utils/resources-mocks";

import PhotoGalleryAlbumCard from "./PhotoGalleryAlbumCard.astro";

const esCopy = getResourcesHubCopy("es");
const [esAlbum] = getLocalizedGalleryAlbums("es");

const meta = preview.meta({
  title: "Components/Data/Display/Resources/PhotoGalleryAlbumCard",
  component: PhotoGalleryAlbumCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    album: esAlbum,
    photosCountLabel: esCopy.photosCountLabel,
    mediaFolderLabel: esCopy.mediaFolderLabel,
  },
});

export const Default = meta.story({});
