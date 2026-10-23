import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mezquitabogota.org",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es-CO",
          en: "en-US",
          ar: "ar-SA",
          tr: "tr-TR",
        },
      },
    }),
  ],
  server: {
    host: "127.0.0.1",
    port: 4321,
  },
  env: {
    schema: {
      ISLAMIC_API_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://islamicapi.com/api/v1/",
      }),
      ISLAMIC_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      LOCATION_API_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://ipapi.co/json/",
      }),
      STRAPI_API_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://127.0.0.1:1337",
      }),
      STRAPI_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CLOUDINARY_CLOUD_NAME: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-display",
      weights: [400, 500, 600, 700, 800],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Public Sans",
      cssVariable: "--font-sans",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Material Symbols Outlined",
      cssVariable: "--font-symbols",
    },
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es", "ar", "tr"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "fix-astro-live-content-tla",
        transform(code, id) {
          if (id === "\0astro:content") {
            return code.replace(
              /const liveCollections = \(await import\(("[^"]+")\)\)\.collections;/,
              "import { collections as liveCollections } from $1;"
            );
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("live.config")) {
              return "live.config";
            }
          },
        },
      },
    },
  },
  adapter: node({
    mode: "standalone",
  }),
});
