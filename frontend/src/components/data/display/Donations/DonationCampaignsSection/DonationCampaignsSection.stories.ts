import preview from "@storybook/preview";
import { getLocalizedDonationCampaigns } from "@utils/institutional-mocks";

import DonationCampaignsSection from "./DonationCampaignsSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Donations/DonationCampaignsSection",
  component: DonationCampaignsSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    campaigns: getLocalizedDonationCampaigns("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    campaigns: getLocalizedDonationCampaigns("en"),
  },
});

export const ArabicLocale = meta.story({
  args: {
    lang: "ar",
    campaigns: getLocalizedDonationCampaigns("ar"),
  },
});

export const TurkishLocale = meta.story({
  args: {
    lang: "tr",
    campaigns: getLocalizedDonationCampaigns("tr"),
  },
});
