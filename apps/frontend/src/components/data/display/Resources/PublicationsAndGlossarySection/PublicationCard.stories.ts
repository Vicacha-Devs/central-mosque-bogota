import preview from "@storybook/preview";
import {
  getLocalizedPublications,
  getResourcesHubCopy,
} from "@utils/resources-mocks";

import PublicationCard from "./PublicationCard.astro";

const copy = getResourcesHubCopy("es");
const [publication] = getLocalizedPublications("es");

const meta = preview.meta({
  title: "Components/Data/Display/Resources/PublicationCard",
  component: PublicationCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    publication,
    pagesLabel: copy.pagesLabel,
    downloadLabel: copy.downloadLabel,
  },
});

export const Default = meta.story({});
