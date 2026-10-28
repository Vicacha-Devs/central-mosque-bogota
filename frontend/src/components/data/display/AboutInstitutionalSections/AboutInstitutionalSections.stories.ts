import preview from "@storybook/preview";
import { getLocalizedAboutPageData } from "@utils/institutional-mocks";

import AboutInstitutionalSections from "./AboutInstitutionalSections.astro";

const meta = preview.meta({
  title: "Components/Data/Display/AboutInstitutionalSections",
  component: AboutInstitutionalSections,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    content: getLocalizedAboutPageData("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    content: getLocalizedAboutPageData("en"),
  },
});

export const ArabicLocale = meta.story({
  args: {
    lang: "ar",
    content: getLocalizedAboutPageData("ar"),
  },
});

export const TurkishLocale = meta.story({
  args: {
    lang: "tr",
    content: getLocalizedAboutPageData("tr"),
  },
});
