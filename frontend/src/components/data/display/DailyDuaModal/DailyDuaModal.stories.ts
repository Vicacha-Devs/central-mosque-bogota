import preview from "@storybook/preview";
import { getLocalizedMocks } from "@utils/localized-mocks";

import DailyDuaModal from "./DailyDuaModal.astro";

const esMocks = getLocalizedMocks("es");
const arMocks = getLocalizedMocks("ar");

const meta = preview.meta({
  title: "Components/Data/Display/DailyDuaModal",
  component: DailyDuaModal,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    dua: esMocks.dailyDua,
  },
});

export const Default = meta.story({});

export const ArabicLocale = meta.story({
  args: {
    dua: arMocks.dailyDua,
  },
});
