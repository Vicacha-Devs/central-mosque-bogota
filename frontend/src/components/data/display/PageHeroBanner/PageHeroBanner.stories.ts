import type { ComponentProps } from "astro/types";

import PageHeroBanner from "./PageHeroBanner.astro";

type TPageHeroBannerProps = ComponentProps<typeof PageHeroBanner>;

export default {
  title: "Components/Data/Display/PageHeroBanner",
  component: PageHeroBanner,
  tags: ["autodocs"],
};

export const Default: { args: TPageHeroBannerProps } = {
  args: {
    badgeIcon: "mosque",
    badgeLabel: "Nuestra Institución",
    title: "Mezquita Central de Bogotá",
    subtitle:
      "Un espacio de adoración, educación espiritual y servicio comunitario abierto para todos en el corazón de Colombia.",
  },
};

export const English: { args: TPageHeroBannerProps } = {
  args: {
    badgeIcon: "volunteer_activism",
    badgeLabel: "Community Services",
    title: "Support & Pastoral Care",
    subtitle:
      "Comprehensive religious, educational, and social support for the Muslim community and visitors in Bogotá.",
  },
};
