import { resolveSecret } from "../security.utils";

export function buildNavigationAndPreviewPlugins(env: any) {
  return {
    navigation: {
      enabled: true,
      config: {
        additionalFields: [
          "audience",
          {
            name: "icon_name",
            label: "Navigation Icon Name",
            type: "string",
            required: false,
            enabled: true,
          },
        ],
        contentTypes: [
          "api::about-page.about-page",
          "api::islam-faith-page.islam-faith-page",
          "api::donations-page.donations-page",
          "api::contact-page.contact-page",
          "api::article.article",
          "api::community-service.community-service",
          "api::leader.leader",
          "api::faq.faq",
          "plugin::events.event",
          "plugin::donations.campaign",
          "plugin::media-feeds.media-item",
          "plugin::media-feeds.media-series",
          "plugin::resources.publication",
          "plugin::resources.gallery-album",
          "plugin::resources.glossary-term",
          "plugin::bookings.resource",
        ],
        defaultContentType: "api::article.article",
        contentTypesNameFields: {
          default: ["title", "name", "heroTitle", "question", "term"],
          "api::about-page.about-page": ["heroTitle"],
          "api::islam-faith-page.islam-faith-page": ["heroTitle"],
          "api::donations-page.donations-page": ["heroTitle"],
          "api::contact-page.contact-page": ["heroTitle"],
          "api::article.article": ["title"],
          "api::community-service.community-service": ["title"],
          "api::leader.leader": ["name"],
          "api::faq.faq": ["question"],
          "plugin::events.event": ["title"],
          "plugin::donations.campaign": ["title"],
          "plugin::media-feeds.media-item": ["title"],
          "plugin::media-feeds.media-series": ["title"],
          "plugin::resources.publication": ["title"],
          "plugin::resources.gallery-album": ["title"],
          "plugin::resources.glossary-term": ["term"],
          "plugin::bookings.resource": ["name"],
        },
        pathDefaultFields: {
          "api::article.article": ["slug"],
          "api::community-service.community-service": ["slug"],
          "api::leader.leader": ["slug"],
          "api::faq.faq": ["id"],
          "plugin::events.event": ["slug"],
          "plugin::donations.campaign": ["slug"],
          "plugin::media-feeds.media-item": ["slug"],
          "plugin::media-feeds.media-series": ["slug"],
          "plugin::resources.publication": ["slug"],
          "plugin::resources.gallery-album": ["slug"],
          "plugin::resources.glossary-term": ["slug"],
          "plugin::bookings.resource": ["slug"],
        },
        allowedLevels: 3,
        cascadeMenuAttached: true,
        preferCustomContentTypes: false,
        i18nEnabled: true,
      },
    },

    "preview-button": {
      enabled: true,
      config: (() => {
        const frontendUrl = String(
          env("FRONTEND_URL", "http://127.0.0.1:4321"),
        ).replace(/\/+$/, "");
        const previewSecret = resolveSecret("PREVIEW_SECRET");

        return {
          contentTypes: [
            {
              uid: "api::about-page.about-page",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "about-us",
                  secret: previewSecret,
                },
              },
              published: {
                url: `${frontendUrl}/{locale}/about-us`,
              },
            },
            {
              uid: "api::donations-page.donations-page",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "donate",
                  secret: previewSecret,
                },
              },
              published: {
                url: `${frontendUrl}/{locale}/donate`,
              },
            },
            {
              uid: "api::islam-faith-page.islam-faith-page",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "islam-and-faith",
                  secret: previewSecret,
                },
              },
              published: {
                url: `${frontendUrl}/{locale}/islam-and-faith`,
              },
            },
            {
              uid: "api::contact-page.contact-page",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "contact-and-visit",
                  secret: previewSecret,
                },
              },
              published: {
                url: `${frontendUrl}/{locale}/contact-and-visit`,
              },
            },
            {
              uid: "plugin::events.event",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "events-and-programs",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/events/{slug}`,
              },
            },
            {
              uid: "api::community-service.community-service",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "community-services",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/community-services`,
              },
            },
            {
              uid: "api::article.article",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "islam-and-faith",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/articles/{slug}`,
              },
            },
            {
              uid: "plugin::donations.campaign",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "donate",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/donate`,
              },
            },
            {
              uid: "plugin::media-feeds.media-item",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "media",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/media`,
              },
            },
            {
              uid: "plugin::resources.publication",
              draft: {
                url: `${frontendUrl}/{locale}/preview`,
                query: {
                  type: "resources",
                  slug: "{slug}",
                  secret: previewSecret,
                },
                alwaysVisible: true,
              },
              published: {
                url: `${frontendUrl}/{locale}/islam-and-faith`,
              },
            },
          ],
        };
      })(),
    },
  };
}
