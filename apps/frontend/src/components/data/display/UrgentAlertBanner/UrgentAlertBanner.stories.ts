import preview from "@storybook/preview";
import { getUrgentAlertFallback } from "@utils/inbox-mocks";

import UrgentAlertBanner from "./UrgentAlertBanner.astro";

const meta = preview.meta({
  title: "Components/Data/Display/UrgentAlertBanner",
  component: UrgentAlertBanner,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    banner: getUrgentAlertFallback("es"),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    banner: getUrgentAlertFallback("en"),
  },
});
