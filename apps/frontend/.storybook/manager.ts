import {
  defaultConfig,
  type TagBadgeParameters,
} from "storybook-addon-tag-badges/manager-helpers";
import {
  DOCS_RENDERED,
  GLOBALS_UPDATED,
  SET_CURRENT_STORY,
  SET_GLOBALS,
  STORY_RENDERED,
} from "storybook/internal/core-events";
import { addons } from "storybook/manager-api";

import { websiteThemeDark, websiteThemeLight } from "./theme";

const REGISTER_THEMES_EVENT = "storybook/themes/REGISTER_THEMES";

addons.setConfig({
  theme: websiteThemeLight,
  tagBadges: [
    {
      tags: "wcag-aa",
      badge: {
        text: "AA+",
        style: {
          backgroundColor: "#0F7B4F",
          color: "#FFFFFF",
        },
        tooltip: "WCAG 2.1 AA+ verified contrast",
      },
      display: { sidebar: ["component"] as never, toolbar: true },
    },
    {
      tags: "rtl-ready",
      badge: {
        text: "RTL",
        style: {
          backgroundColor: "#212e80",
          color: "#FFFFFF",
        },
        tooltip: "Supports Arabic RTL mirroring via logical CSS properties",
      },
      display: { sidebar: ["component", "story"] as never, toolbar: true },
    },
    {
      tags: "cms-backed",
      badge: {
        text: "Strapi",
        style: {
          backgroundColor: "#a6251c",
          color: "#FFFFFF",
        },
        tooltip: "Backed by Strapi v5 schema with deterministic offline mocks",
      },
      display: { sidebar: ["component"] as never, toolbar: true },
    },
    {
      tags: { prefix: "version" },
      badge: ({ getTagParts, tag }) => {
        const { suffix } = getTagParts(tag);
        return {
          text: suffix ? `v${suffix}` : tag,
          style: {
            backgroundColor: "#212e80",
            color: "#FFFFFF",
          },
          tooltip: `Component version ${suffix ?? tag}`,
        };
      },
    },
    {
      tags: "new",
      badge: {
        text: "New",
        style: {
          backgroundColor: "#c13026",
          color: "#FFFFFF",
        },
        tooltip: "Newly added component",
      },
    },
    {
      tags: "alpha",
      badge: {
        text: "Alpha",
        style: {
          backgroundColor: "#1a2466",
          color: "#FFFFFF",
        },
        tooltip: "Alpha stability — API may evolve",
      },
    },
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
});

type GlobalsPayload = {
  globals?: {
    theme?: string;
  };
};

addons.register("central-mosque-bogota/theme-sync", (api): void => {
  const channel = api.getChannel();
  if (!channel) return;

  const announceThemes = (): void => {
    channel.emit(REGISTER_THEMES_EVENT, {
      defaultTheme: "light",
      themes: ["light", "dark"],
    });
  };

  const applyManagerTheme = (themeName?: string): void => {
    addons.setConfig({
      theme: themeName === "dark" ? websiteThemeDark : websiteThemeLight,
    });
  };

  announceThemes();
  channel.on(SET_CURRENT_STORY, announceThemes);
  channel.on(STORY_RENDERED, announceThemes);
  channel.on(DOCS_RENDERED, announceThemes);
  channel.on(SET_GLOBALS, ({ globals }: GlobalsPayload): void => {
    announceThemes();
    applyManagerTheme(globals?.theme);
  });
  channel.on(GLOBALS_UPDATED, ({ globals }: GlobalsPayload): void => {
    applyManagerTheme(globals?.theme);
  });
});
