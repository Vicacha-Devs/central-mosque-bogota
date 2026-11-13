import preview from "@storybook/preview";
import { getLocalizedUtilityInvoices } from "@utils/donation-mocks";

import DonationSubmissionForm from "./DonationSubmissionForm.astro";

const meta = preview.meta({
  title: "Components/Actions/DonationSubmissionForm",
  component: DonationSubmissionForm,
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
