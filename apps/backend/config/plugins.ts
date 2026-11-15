import { buildCoreInfrastructurePlugins } from "./plugins/core.plugins";
import { buildEmailDesignerPluginConfig } from "./plugins/email-designer.plugin";
import { buildNavigationAndPreviewPlugins } from "./plugins/navigation-preview.plugins";
import { buildSearchAndCachePlugins } from "./plugins/search-cache.plugins";
import { buildTiptapEditorPluginConfig } from "./plugins/tiptap.plugin";
import { buildVicachaPluginsConfig } from "./vicachaPlugins";

export interface StrapiEnvFn {
  (key: string, defaultValue?: string): string;
  int: (key: string, defaultValue?: number) => number;
  bool: (key: string, defaultValue?: boolean) => boolean;
}

function parseSampleRate(raw: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 1.0;
  return Math.min(1, Math.max(0, parsed));
}

export default ({ env }: { env: StrapiEnvFn }) => ({
  // 1-2b. Core Infrastructure Plugins (users-permissions, upload, email)
  ...buildCoreInfrastructurePlugins(env),

  // 3. SEO Plugin (@vicacha-devs/strapi-plugin-seo)
  seo: {
    enabled: true,
  },

  // 4. Tiptap Rich Text Editor (@vicacha-devs/strapi-plugin-tiptap-editor)
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

  // 14b. Collapsible & Pinnable Left Navigation (@vicacha-devs/strapi-plugin-collapsible-nav)
  "collapsible-nav": {
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

  // 28. Vendor-neutral OpenTelemetry Error Tracking & APM (@vicacha-devs/strapi-plugin-opentelemetry)
  opentelemetry: {
    enabled: env.bool("OTEL_ENABLED", true),
    config: {
      serviceName: env("OTEL_SERVICE_NAME", "central-mosque-bogota-backend"),
      serviceVersion: env("npm_package_version", "1.0.0"),
      environment: env("NODE_ENV", "development"),
      otlpEndpoint: env("OTEL_EXPORTER_OTLP_ENDPOINT", ""),
      sampleRate: parseSampleRate(env("OTEL_TRACES_SAMPLE_RATE", "1.0")),
      ignorePaths: ["/_health", "/api/health", "/favicon.ico"],
      captureDocumentService: true,
      consoleExporter: env.bool("OTEL_CONSOLE_EXPORTER", false),
    },
  },
});
