export function buildSearchAndCachePlugins(env: any) {
  return {
    "strapi-cache": {
      enabled: env.bool("CACHE_ENABLED", false),
      config: {
        provider: env("CACHE_PROVIDER", "memory"), // 'memory' | 'valkey' | 'redis'
        redisConfig: env(
          "VALKEY_URL",
          env("REDIS_URL", "redis://127.0.0.1:6379"),
        ),
        max: env.int("CACHE_MAX_ITEMS", 1000),
        ttl: env.int("CACHE_TTL", 3600000), // 1 hour in ms
        cacheAuthorizedRequests: true,
        cacheGetTimeoutInMs: env.int("CACHE_GET_TIMEOUT_MS", 1000),
        autoPurgeCache: true,
        autoPurgeCacheOnStart: true,
        cacheableRoutes: [
          "/api/global-setting",
          "/api/about-page",
          "/api/donations-page",
          "/api/islam-faith-page",
          "/api/contact-page",
          "/api/community-services",
          "/api/articles",
          "/api/leaders",
          "/api/faqs",
          "/api/events/occurrences",
          "/api/events/spotlights",
          "/api/media-feeds/episodes",
          "/api/donations/campaigns",
        ],
        excludeRoutes: [
          "/api/inbox",
          "/api/strapi-plugin-form-builder-cms",
          "/api/donations/pledges",
          "/api/donations/webhooks",
          "/api/islam",
          "/api/bookings",
          "/api/certificates/apply",
          "/api/certificates/webhooks",
        ],
      },
    },

    typesense: {
      enabled: Boolean(env("TYPESENSE_API_KEY", "")),
      config: {
        apiKey: env("TYPESENSE_API_KEY", ""),
        nodes: [
          {
            host: env("TYPESENSE_HOST", "127.0.0.1"),
            port: env.int("TYPESENSE_PORT", 8108),
            protocol: env("TYPESENSE_PROTOCOL", "http"),
          },
        ],
        collections: {
          "api::article.article": {
            name: "articles",
            facets: ["category", "locale"],
            vectorField: {
              name: "embedding",
              numDim: 384,
              autoEmbed: true,
              embedFrom: ["title", "description", "content"],
              modelName: "ts/all-MiniLM-L6-v2",
            },
          },
          "plugin::events.event": {
            name: "events",
            facets: ["category", "locale"],
            vectorField: {
              name: "embedding",
              numDim: 384,
              autoEmbed: true,
              embedFrom: ["title", "summary", "description"],
              modelName: "ts/all-MiniLM-L6-v2",
            },
          },
          "api::community-service.community-service": {
            name: "community_services",
            facets: ["locale"],
            vectorField: {
              name: "embedding",
              numDim: 384,
              autoEmbed: true,
              embedFrom: ["title", "description", "longDescription"],
              modelName: "ts/all-MiniLM-L6-v2",
            },
          },
          "plugin::media-feeds.media-item": {
            name: "media_highlights",
            facets: ["type", "locale"],
            vectorField: {
              name: "embedding",
              numDim: 384,
              autoEmbed: true,
              embedFrom: ["title", "description"],
              modelName: "ts/all-MiniLM-L6-v2",
            },
          },
          "api::faq.faq": {
            name: "faqs",
            facets: ["category", "locale"],
            vectorField: {
              name: "embedding",
              numDim: 384,
              autoEmbed: true,
              embedFrom: ["question", "answer"],
              modelName: "ts/all-MiniLM-L6-v2",
            },
          },
        },
      },
    },
  };
}
