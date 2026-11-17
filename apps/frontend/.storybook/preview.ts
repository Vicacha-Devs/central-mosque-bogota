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
let currentTheme = "light";
let currentDirection: "ltr" | "rtl" = "ltr";

type GlobalsPayload = {
  globals?: {
    theme?: string;
    addonRtl?: string;
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

const applyDocumentDirection = (direction?: string): void => {
  if (typeof document === "undefined") return;
  const resolved = direction === "rtl" ? "rtl" : "ltr";
  currentDirection = resolved;
  document.documentElement.dir = resolved;
  document.body.dir = resolved;
  const root = document.getElementById("storybook-root");
  if (root) {
    root.dir = resolved;
  }
};

if (typeof document !== "undefined") {
  applyDocumentTheme(currentTheme);
  applyDocumentDirection(currentDirection);
  try {
    const channel = addons.getChannel();
    const syncChannelGlobals = (payload?: GlobalsPayload): void => {
      const nextTheme = payload?.globals?.theme;
      if (typeof nextTheme === "string" && nextTheme) {
        applyDocumentTheme(nextTheme);
      } else {
        applyDocumentTheme(currentTheme);
      }

      const nextDirection = payload?.globals?.addonRtl;
      if (typeof nextDirection === "string" && nextDirection) {
        applyDocumentDirection(nextDirection);
      } else {
        applyDocumentDirection(currentDirection);
      }

      channel.emit(REGISTER_THEMES_EVENT, {
        defaultTheme: "light",
        themes: ["light", "dark"],
      });
    };
    syncChannelGlobals();
    channel.on(SET_GLOBALS, syncChannelGlobals);
    channel.on(GLOBALS_UPDATED, syncChannelGlobals);
    channel.on(UPDATE_GLOBALS, syncChannelGlobals);
    channel.on(DOCS_RENDERED, (): void => {
      syncChannelGlobals();
    });
    channel.on(STORY_RENDERED, (): void => {
      syncChannelGlobals();
    });
  } catch {
    // Ignore outside browser preview context.
  }
}

const figmaUrl
  = typeof process !== "undefined" ? process.env.STORYBOOK_FIGMA_URL : undefined;
const figmaToken
  = typeof process !== "undefined"
    ? process.env.STORYBOOK_FIGMA_ACCESS_TOKEN
    : undefined;

export default definePreview({
  addons: [addonA11y(), addonDocs(), addonThemes()],
  initialGlobals: {
    theme: "light",
    addonRtl: "ltr",
  },
  decorators: [
    ...astroDocsDecorators,
    (
      story: () => unknown,
      context: { globals: GlobalsPayload["globals"] }
    ): unknown => {
      const dir
        = context.globals?.addonRtl === "rtl" ? "rtl" : currentDirection;
      applyDocumentDirection(dir);
      return story();
    },
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
    a11y: {
      test: "todo",
    },
  },
  tags: ["autodocs"],
});
