import preview from "@storybook/preview";
import { getLocalizedUtilityInvoices } from "@utils/donation-mocks";

import UtilityInvoiceCard from "./UtilityInvoiceCard.astro";

const [invoice] = getLocalizedUtilityInvoices("es");

const meta = preview.meta({
  title: "Components/Data/Display/Donations/UtilityInvoiceCard",
  component: UtilityInvoiceCard,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    invoice,
  },
});

export const Default = meta.story({});
