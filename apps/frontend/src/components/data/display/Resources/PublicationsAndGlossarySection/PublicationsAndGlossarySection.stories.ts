import preview from "@storybook/preview";
import {
  getLocalizedGlossaryTerms,
  getLocalizedPublications,
  getResourcesHubCopy,
} from "@utils/resources-mocks";

import PublicationsAndGlossarySection from "./PublicationsAndGlossarySection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Resources/PublicationsAndGlossarySection",
  component: PublicationsAndGlossarySection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    copy: getResourcesHubCopy("es"),
    publications: getLocalizedPublications("es"),
    glossaryTerms: getLocalizedGlossaryTerms("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    copy: getResourcesHubCopy("en"),
    publications: getLocalizedPublications("en"),
    glossaryTerms: getLocalizedGlossaryTerms("en"),
  },
});
