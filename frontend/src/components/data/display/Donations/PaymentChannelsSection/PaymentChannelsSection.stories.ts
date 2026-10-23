import preview from "@storybook/preview";
import { getLocalizedPaymentMethods } from "@utils/institutional-mocks";

import PaymentChannelsSection from "./PaymentChannelsSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Donations/PaymentChannelsSection",
  component: PaymentChannelsSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    methods: getLocalizedPaymentMethods("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    methods: getLocalizedPaymentMethods("en"),
  },
});

export const ArabicLocale = meta.story({
  args: {
    lang: "ar",
    methods: getLocalizedPaymentMethods("ar"),
  },
});

export const TurkishLocale = meta.story({
  args: {
    lang: "tr",
    methods: getLocalizedPaymentMethods("tr"),
  },
});
