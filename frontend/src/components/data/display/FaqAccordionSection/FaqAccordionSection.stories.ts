import type { ComponentProps } from "astro/types";

import FaqAccordionSection from "./FaqAccordionSection.astro";

type FaqAccordionSectionProps = ComponentProps<typeof FaqAccordionSection>;

export default {
  component: FaqAccordionSection,
  title: "Data/Display/FaqAccordionSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies FaqAccordionSectionProps,
};
