import type { ComponentProps } from "astro/types";

import ContactAndVisitFormsSection from "./ContactAndVisitFormsSection.astro";

type ContactAndVisitFormsSectionProps = ComponentProps<
  typeof ContactAndVisitFormsSection
>;

export default {
  component: ContactAndVisitFormsSection,
  title: "Actions/ContactAndVisitFormsSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies ContactAndVisitFormsSectionProps,
};

export const Arabic = {
  args: {
    lang: "ar",
  } satisfies ContactAndVisitFormsSectionProps,
};
