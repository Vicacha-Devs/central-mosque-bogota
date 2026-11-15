import {
  definePreview,
  type AstroRenderer,
} from "@storybook-astro/framework";
import { decorators as astroDocsDecorators } from "@storybook-astro/renderer/entry-preview-docs";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import addonThemes, {
  withThemeByDataAttribute,
} from "@storybook/addon-themes";
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

import "@/styles/global.css";

const REGISTER_THEMES_EVENT = "storybook/themes/REGISTER_THEMES";
let currentTheme = "light";

type GlobalsPayload = {
  globals?: {
    theme?: string;
  };
};

const applyDocumentTheme = (themeName?: string): void => {
  if (typeof document === "undefined") return;
  const resolved = themeName === "dark" ? "dark" : "light";
  currentTheme = resolved;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.body.setAttribute("data-theme", resolved);
};

if (typeof document !== "undefined") {
  applyDocumentTheme(currentTheme);
  try {
    const channel = addons.getChannel();
    const syncChannelTheme = (payload?: GlobalsPayload): void => {
      const nextTheme = payload?.globals?.theme;
      if (typeof nextTheme === "string" && nextTheme) {
        applyDocumentTheme(nextTheme);
      } else {
        applyDocumentTheme(currentTheme);
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

const figmaUrl =
  typeof process !== "undefined" ? process.env.STORYBOOK_FIGMA_URL : undefined;
const figmaToken =
  typeof process !== "undefined"
    ? process.env.STORYBOOK_FIGMA_ACCESS_TOKEN
    : undefined;

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
    ...(figmaUrl
      ? {
          design: figmaToken
            ? {
                type: "figspec",
                url: figmaUrl,
                accessToken: figmaToken,
              }
            : {
                type: "link",
                url: figmaUrl,
                label: "Abrir diseño en Figma",
              },
        }
      : {}),
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
      toc: true,
      source: {
        type: "dynamic",
      },
    },
    viewport: {
      options: { ...CUSTOM_VIEW_PORTS, ...INITIAL_VIEWPORTS },
    },
    a11y: {
      test: "todo",
    },
  },
  tags: ["autodocs"],
});
