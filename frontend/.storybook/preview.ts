import { definePreview, type AstroRenderer } from "@storybook-astro/framework";
import { decorators as astroDocsDecorators } from "@storybook-astro/renderer/entry-preview-docs";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import addonThemes, { withThemeByDataAttribute } from "@storybook/addon-themes";
import {
  DOCS_RENDERED,
  GLOBALS_UPDATED,
  SET_GLOBALS,
  STORY_RENDERED,
  UPDATE_GLOBALS,
} from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { CUSTOM_VIEW_PORTS } from "./constants";
import { websiteThemeLight } from "./theme";

import "@/styles/global.css";
import "./docs.css";

const REGISTER_THEMES_EVENT = "storybook/themes/REGISTER_THEMES";

type GlobalsPayload = {
  globals?: {
    theme?: string;
  };
};

const applyDocumentTheme = (themeName?: string): void => {
  if (typeof document === "undefined") return;
  const resolved = themeName === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.body.setAttribute("data-theme", resolved);
};

// Mirrors the <body> classes set in src/layouts/Layout.astro
const BODY_CLASSES = [
  "bg-background",
  "font-display",
  "text-slate-900",
  "transition-colors",
  "duration-300",
  "dark:text-slate-100",
];

if (typeof document !== "undefined") {
  document.body.classList.add(...BODY_CLASSES);
  applyDocumentTheme("light");
  try {
    const channel = addons.getChannel();
    const syncChannelTheme = (payload?: GlobalsPayload): void => {
      const nextTheme = payload?.globals?.theme;
      // Render events carry no globals; the DOM already holds the theme.
      if (typeof nextTheme === "string" && nextTheme) {
        applyDocumentTheme(nextTheme);
      }
      channel.emit(REGISTER_THEMES_EVENT, {
        defaultTheme: "light",
        themes: ["light", "dark"],
      });
    };
    syncChannelTheme();
    channel.on(SET_GLOBALS, syncChannelTheme);
    channel.on(GLOBALS_UPDATED, syncChannelTheme);
    channel.on(UPDATE_GLOBALS, syncChannelTheme);
    channel.on(DOCS_RENDERED, (): void => {
      syncChannelTheme();
    });
    channel.on(STORY_RENDERED, (): void => {
      syncChannelTheme();
    });
  } catch {
    // Ignore outside browser preview context.
  }
}

export default definePreview({
  addons: [addonA11y(), addonDocs(), addonThemes()],
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    ...astroDocsDecorators,
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
    // The theme toggle owns the canvas color; a second background switch only conflicts with it.
    backgrounds: { disable: true },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: websiteThemeLight,
      codePanel: true,
      toc: true,
      source: {
        type: "dynamic",
      },
    },
    viewport: {
      options: { ...CUSTOM_VIEW_PORTS, ...INITIAL_VIEWPORTS },
    },
  },
  tags: ["autodocs"],
});
