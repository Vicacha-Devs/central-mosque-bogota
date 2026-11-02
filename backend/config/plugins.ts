import { buildCoreInfrastructurePlugins } from "./plugins/core.plugins";
import { buildEmailDesignerPluginConfig } from "./plugins/email-designer.plugin";
import { buildNavigationAndPreviewPlugins } from "./plugins/navigation-preview.plugins";
import { buildSearchAndCachePlugins } from "./plugins/search-cache.plugins";
import { buildTiptapEditorPluginConfig } from "./plugins/tiptap.plugin";
import { buildVicachaPluginsConfig } from "./vicachaPlugins";

export default ({ env }: { env: any }) => ({
  // 1-2b. Core Infrastructure Plugins (users-permissions, upload, email)
  ...buildCoreInfrastructurePlugins(env),

  // 3. SEO Plugin (@vicacha-devs/strapi-plugin-seo)
  seo: {
    enabled: true,
  },

  // 4. Tiptap Rich Text Editor (@notum-cz/strapi-plugin-tiptap-editor — local fork)
  "tiptap-editor": buildTiptapEditorPluginConfig(),

  // 5. Deep Populate for Strapi v5 (strapi-v5-plugin-populate-deep)
  "strapi-v5-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },

  // 6. Scheduled Publisher (strapi-plugin-publisher)
  publisher: {
    enabled: true,
  },

  // 7. Config Sync across environments (strapi-plugin-config-sync)
  "config-sync": {
    enabled: true,
    config: {
      syncDir: "config/sync/",
    },
  },

  // 8 & 11. REST API Caching & Typesense Hybrid Search
  ...buildSearchAndCachePlugins(env),

  // 9. XML Sitemap Generator for Strapi v5 (@vicacha-devs/strapi-plugin-sitemap)
  sitemap: {
    enabled: true,
    config: {
      hostname: env("PUBLIC_SITE_URL", "https://mezquitabogota.org"),
      includeHreflang: true,
    },
  },

  // 10 & 12. Visual Hierarchical Navigation & Frontend Preview Button (strapi-plugin-preview-button)
  ...buildNavigationAndPreviewPlugins(env),

  // 13. Visual Email Template Designer for Strapi v5 (strapi-plugin-email-designer-5)
  "email-designer-5": buildEmailDesignerPluginConfig(),

  // 14. Content Manager Sidebar Organizer (strapi-plugin-content-manager-organizer)
  "content-manager-organizer": {
    enabled: true,
  },

  // 15. Spotlight Global Search Palette (@vicacha-devs/strapi-plugin-global-search)
  "global-search": {
    enabled: true,
    config: {
      includePluginContentTypes: true,
      includeDrafts: true,
      deep: true,
    },
  },

  // 16. Visual Drag-and-Drop Form Builder CMS (strapi-plugin-form-builder-cms — bridged two-way with @vicacha-devs/strapi-plugin-inbox)
  "strapi-plugin-form-builder-cms": {
    enabled: true,
  },

  // 17-27. @vicacha-devs Strapi v5 Plugins (notes, calendar, events, bookings, inbox, etc.)
  ...buildVicachaPluginsConfig(env),
});
