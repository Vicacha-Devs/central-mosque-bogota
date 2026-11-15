import preview from "@storybook/preview";
import {
  getLocalizedGalleryAlbums,
  getResourcesHubCopy,
} from "@utils/resources-mocks";

import PhotoGalleriesSection from "./PhotoGalleriesSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Resources/PhotoGalleriesSection",
  component: PhotoGalleriesSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    copy: getResourcesHubCopy("es"),
    albums: getLocalizedGalleryAlbums("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    copy: getResourcesHubCopy("en"),
    albums: getLocalizedGalleryAlbums("en"),
  },
});
