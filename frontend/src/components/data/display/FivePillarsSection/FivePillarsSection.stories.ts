import type { ComponentProps } from "astro/types";

import FivePillarsSection from "./FivePillarsSection.astro";

type FivePillarsSectionProps = ComponentProps<typeof FivePillarsSection>;

export default {
  component: FivePillarsSection,
  title: "Data/Display/FivePillarsSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies FivePillarsSectionProps,
};
