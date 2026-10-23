import preview from "@storybook/preview";

import ZakatCalculatorSection from "./ZakatCalculatorSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Donations/ZakatCalculatorSection",
  component: ZakatCalculatorSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    goldWeightGrams: 85,
    goldNisabAmount: 29_500_000,
    silverWeightGrams: 595,
    silverNisabAmount: 2_650_000,
    fitranaPerPersonCop: 35_000,
    fidyahPerDayCop: 25_000,
    kaffarahFastCop: 1_500_000,
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
  },
});
