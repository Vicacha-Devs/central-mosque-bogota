import preview from "@storybook/preview";
import { getLocalizedUtilityInvoices } from "@utils/donation-mocks";

import UtilityInvoicesSection from "./UtilityInvoicesSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Donations/UtilityInvoicesSection",
  component: UtilityInvoicesSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    invoices: getLocalizedUtilityInvoices("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    invoices: getLocalizedUtilityInvoices("en"),
  },
});
