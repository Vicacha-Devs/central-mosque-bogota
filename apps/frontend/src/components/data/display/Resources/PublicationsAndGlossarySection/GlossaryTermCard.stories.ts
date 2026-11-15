import preview from "@storybook/preview";
import { getLocalizedGlossaryTerms } from "@utils/resources-mocks";

import GlossaryTermCard from "./GlossaryTermCard.astro";

const [term] = getLocalizedGlossaryTerms("es");

const meta = preview.meta({
  title: "Components/Data/Display/Resources/GlossaryTermCard",
  component: GlossaryTermCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    term,
  },
});

export const Default = meta.story({});
