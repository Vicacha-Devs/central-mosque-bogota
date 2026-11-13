import preview from "@storybook/preview";

import SiteSearchSection from "./SiteSearchSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/SiteSearchSection",
  component: SiteSearchSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    items: [
      {
        id: "article-1",
        category: "article",
        categoryLabel: "Academia y Artículos",
        title: "Introducción al Árabe Coránico",
        description:
          "Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.",
        href: "/es/articles/introduccion-al-arabe-coranico",
        icon: "school",
      },
      {
        id: "event-1",
        category: "event",
        categoryLabel: "Eventos",
        title: "Cena Comunitaria de Viernes",
        description:
          "Encuentro fraternal mensual para fortalecer los lazos comunitarios.",
        href: "/es/events/cena-comunitaria-de-viernes",
        icon: "calendar_month",
      },
      {
        id: "service-1",
        category: "service",
        categoryLabel: "Servicios",
        title: "Matrimonio Islámico (Nikah)",
        description:
          "Oficiamos ceremonias matrimoniales islámicas y brindamos orientación prematrimonial.",
        href: "/es/community-services",
        icon: "favorite",
      },
    ],
  },
});

export const Default = meta.story({});
