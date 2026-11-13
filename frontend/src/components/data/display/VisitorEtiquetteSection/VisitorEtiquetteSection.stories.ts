import type { ComponentProps } from "astro/types";

import VisitorEtiquetteSection from "./VisitorEtiquetteSection.astro";

type VisitorEtiquetteSectionProps = ComponentProps<
  typeof VisitorEtiquetteSection
>;

export default {
  component: VisitorEtiquetteSection,
  title: "Data/Display/VisitorEtiquetteSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies VisitorEtiquetteSectionProps,
};

export const English = {
  args: {
    lang: "en",
  } satisfies VisitorEtiquetteSectionProps,
};
