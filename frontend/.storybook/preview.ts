import { definePreview, type AstroRenderer } from "@storybook-astro/framework";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import addonThemes, { withThemeByDataAttribute } from "@storybook/addon-themes";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { CUSTOM_VIEW_PORTS } from "./constants";

import "@/styles/global.css";

export default definePreview({
  addons: [addonA11y(), addonDocs(), addonThemes()],
  decorators: [
    (Story) => `
        <div
          class='bg-background font-display text-slate-900
            transition-colors duration-300 dark:text-slate-100'>
            ${Story()}
        </div>
      `,
    withThemeByDataAttribute<AstroRenderer>({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
  parameters: {
    backgrounds: {
      options: {
        dark: { name: "Dark", value: "oklch(0.208 0.042 265.755)" },
        light: {
          name: "Light",
          value: "oklch(0.984 0.003 247.858)",
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
      toc: true,
    },
    viewport: {
      options: { ...CUSTOM_VIEW_PORTS, ...INITIAL_VIEWPORTS },
    },
  },
  tags: ["autodocs"],
});
