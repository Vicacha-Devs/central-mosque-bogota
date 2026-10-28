type ImportMetaEnv = {
  readonly ISLAMIC_API_URL: string;
  readonly ISLAMIC_API_KEY: string;
  readonly LOCATION_API_URL: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};

declare module "@storybook-astro/renderer/entry-preview-docs" {
  import type { DecoratorFunction } from "storybook/internal/types";
  export const decorators: Array<DecoratorFunction>;
}
