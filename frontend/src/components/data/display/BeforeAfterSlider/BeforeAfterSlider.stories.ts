import preview from "@storybook/preview";

import BeforeAfterSlider from "./BeforeAfterSlider.astro";

const meta = preview.meta({
  title: "Components/Data/Display/BeforeAfterSlider",
  component: BeforeAfterSlider,
  tags: ["autodocs", "version:0.1.0", "new"],
  args: {
    beforeUrl:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=900&q=80",
    afterUrl:
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=900&q=80",
    beforeAlt: "Construcción (2011)",
    afterAlt: "Actualidad (2026)",
    caption:
      "Evolución arquitectónica de la Mezquita Central Abou Bakr Al-Siddiq en Bogotá.",
    value: 50,
    direction: "horizontal",
  },
});

export const Default = meta.story({});

export const WithoutCaption = meta.story({
  args: {
    caption: "",
  },
});

export const VerticalComparison = meta.story({
  args: {
    direction: "vertical",
    caption: "Comparación vertical de iluminación interior.",
  },
});
