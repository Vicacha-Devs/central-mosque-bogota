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
