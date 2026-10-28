import { resolveSecret } from "./security.utils";
import { buildVicachaPluginsConfig } from "./vicachaPlugins";

// TODO(security): Integrate Cloudinary malware/antivirus moderation add-on (e.g., AWS Rekognition / Metadefender CDR) on uploaded PDFs and media in production.

const UPLOAD_SIZE_LIMIT_BYTES = 10 * 1024 * 1024; // 10 MB max upload size

const UPLOAD_SECURITY_POLICY = {
  allowedTypes: [
    "image/*",
    "video/*",
    "audio/*",
    "application/pdf",
    "application/zip",
    "text/plain",
    "text/csv",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.*",
  ],
  deniedTypes: [
    "application/x-sh",
    "application/x-dosexec",
    "application/x-msdownload",
    "application/x-executable",
    "text/html",
    "application/javascript",
  ],
};

export default ({ env }) => {
  const cloudinaryName = env("CLOUDINARY_NAME", "");
  const smtpHost = env("SMTP_HOST", "");

  return {
    // 1. Users & Permissions JWT security configuration
    "users-permissions": {
      config: {
        jwtSecret: resolveSecret("JWT_SECRET"),
        jwt: {
          expiresIn: env("JWT_EXPIRES_IN", "7d"),
        },
        ratelimit: {
          interval: 60000,
          max: 10,
        },
      },
    },

    // 2. Cloudinary CDN Upload Provider (falls back to local upload with size limits & MIME security policy when CLOUDINARY_NAME is omitted)
    upload: cloudinaryName
      ? {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
            security: UPLOAD_SECURITY_POLICY,
            provider: "cloudinary",
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: env("CLOUDINARY_KEY", ""),
              api_secret: env("CLOUDINARY_SECRET", ""),
            },
            actionOptions: {
              upload: {
                folder: env("CLOUDINARY_FOLDER", "central-mosque-bogota"),
                resource_type: "auto",
              },
              uploadStream: {
                folder: env("CLOUDINARY_FOLDER", "central-mosque-bogota"),
                resource_type: "auto",
              },
              delete: {},
            },
          },
        }
      : {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
            security: UPLOAD_SECURITY_POLICY,
          },
        },

    // 2b. Transactional Email Provider (@strapi/provider-email-nodemailer; uses SMTP when SMTP_HOST is set or jsonTransport in local dev)
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: smtpHost
          ? {
              host: smtpHost,
              port: env.int("SMTP_PORT", 587),
              secure: env.bool("SMTP_SECURE", false),
              ...(env("SMTP_USERNAME", "")
                ? {
                    auth: {
                      user: env("SMTP_USERNAME", ""),
                      pass: env("SMTP_PASSWORD", ""),
                    },
                  }
                : {}),
            }
          : {
              jsonTransport: true,
            },
        settings: {
          defaultFrom: env("EMAIL_DEFAULT_FROM", "no-reply@mezquitabogota.org"),
          defaultReplyTo: env(
            "EMAIL_DEFAULT_REPLY_TO",
            "info@mezquitabogota.org",
          ),
        },
      },
    },

    // 3. SEO Plugin (@notum-cz/strapi-plugin-seo)
    seo: {
      enabled: true,
    },

    // 4. Tiptap Rich Text Editor (@notum-cz/strapi-plugin-tiptap-editor — local fork)
    "tiptap-editor": {
      enabled: true,
      config: {
        fieldBindings: [
          { uid: "plugin::events.event", field: "description", preset: "editorial" },
          { uid: "plugin::donations.campaign", field: "body", preset: "editorial" },
          { uid: "plugin::media-feeds.media-item", field: "description", preset: "editorial" },
          { uid: "plugin::media-feeds.media-item", field: "transcript", preset: "editorial" },
          { uid: "plugin::media-feeds.media-series", field: "description", preset: "standard" },
          { uid: "plugin::resources.publication", field: "summary", preset: "editorial" },
          { uid: "plugin::resources.gallery-album", field: "description", preset: "standard" },
          { uid: "plugin::resources.glossary-term", field: "definition", preset: "editorial" },
          { uid: "plugin::bookings.resource", field: "description", preset: "standard" },
          { uid: "plugin::bookings.resource", field: "visitorRules", preset: "standard" },
          { uid: "plugin::certificates.template", field: "bodyTemplate", preset: "editorial" },
          { uid: "plugin::broadcasts.campaign", field: "body", preset: "editorial" },
        ],
        settings: {
          defaultPreset: "editorial",
          defaultOutputFormat: "json",
          enableRelationalSync: true,
          allowedIframeDomains: [
            "www.youtube.com",
            "youtube.com",
            "player.vimeo.com",
            "www.google.com",
          ],
        },
        theme: {
          colors: [
            { label: "Mosque Emerald", color: "#14532d" },
            { label: "Emerald Accent", color: "#15803d" },
            { label: "Andalusian Gold", color: "#b45309" },
            { label: "Warm Amber", color: "#d97706" },
            { label: "Deep Slate", color: "#1e293b" },
            { label: "Muted Slate", color: "#475569" },
            { label: "Royal Blue", color: "#1d4ed8" },
            { label: "Crimson Alert", color: "#b91c1c" },
          ],
          css: ".ProseMirror { min-height: 180px; line-height: 1.7; } .ProseMirror blockquote { border-inline-start: 3px solid #14532d; padding-inline-start: 1rem; color: #334155; font-style: italic; }",
        },
        presets: {
          editorial: {
            heading: { levels: [2, 3, 4, 5, 6], autoSlugId: true },
            bold: true,
            italic: true,
            underline: true,
            strike: true,
            code: true,
            codeBlock: true,
            blockquote: true,
            bulletList: true,
            orderedList: true,
            taskList: true,
            horizontalRule: true,
            hardBreak: true,
            history: true,
            clearFormatting: true,
            leadParagraph: true,
            link: {
              openOnClick: false,
              allowInternalLinks: true,
              HTMLAttributes: {
                rel: "noopener noreferrer",
              },
            },
            linker: true,
            table: {
              resizable: true,
              allowCellBackgroundColor: true,
              allowCaption: true,
            },
            textAlign: {
              types: ["heading", "paragraph"],
              alignments: ["left", "center", "right", "justify"],
            },
            superscript: true,
            subscript: true,
            textColor: true,
            highlightColor: true,
            mediaLibrary: {
              resize: {
                enabled: true,
                alwaysPreserveAspectRatio: true,
                minWidth: 80,
                minHeight: 80,
              },
            },
            video: true,
            audio: true,
            attachment: true,
            iframe: {
              allowedDomains: [
                "www.youtube.com",
                "youtube.com",
                "player.vimeo.com",
                "www.google.com",
              ],
              allowFullscreen: true,
            },
            informationPane: {
              variants: [
                "info",
                "warning",
                "success",
                "danger",
                "neutral",
                "tip",
              ],
            },
            accordion: true,
            columns: true,
            tableOfContents: true,
            slashCommands: true,
            emoji: true,
            characterCount: {
              wordsPerMinute: 200,
            },
            fullscreen: true,
          },
          standard: {
            heading: { levels: [2, 3, 4, 5, 6], autoSlugId: true },
            bold: true,
            italic: true,
            underline: true,
            strike: true,
            blockquote: true,
            bulletList: true,
            orderedList: true,
            hardBreak: true,
            history: true,
            clearFormatting: true,
            link: {
              openOnClick: false,
              allowInternalLinks: true,
              HTMLAttributes: {
                rel: "noopener noreferrer",
              },
            },
            linker: true,
            textAlign: {
              types: ["heading", "paragraph"],
              alignments: ["left", "center", "right", "justify"],
            },
            textColor: true,
            highlightColor: true,
            characterCount: true,
            fullscreen: true,
          },
          minimal: {
            bold: true,
            italic: true,
            underline: true,
            bulletList: true,
            orderedList: true,
            link: true,
            history: true,
          },
        },
      },
    },

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

    // 8. REST API Caching (strapi-cache v1.13.0 — disabled by default in dev; set CACHE_ENABLED=true in prod)
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
          "/api/donations/pledges",
          "/api/donations/webhooks",
          "/api/islam",
          "/api/bookings",
          "/api/certificates/apply",
          "/api/certificates/webhooks",
        ],
      },
    },

    // 9. XML Sitemap Generator for Strapi v5 (strapi-5-sitemap-plugin)
    "strapi-5-sitemap-plugin": {
      enabled: true,
    },

    // 10. Visual Hierarchical Navigation Builder (strapi-plugin-navigation)
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

    // 11. Typesense Full-Text, Vector & Hybrid Search (@juadariasmar/strapi-plugin-typesense)
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

    // 12. Preview Button (@frameless/preview-button)
    "preview-button": {
      enabled: true,
      config: {
        domain: env("FRONTEND_URL", "http://127.0.0.1:4321"),
        preview_secret_token: resolveSecret("PREVIEW_SECRET"),
        api_token: env("PREVIEW_API_TOKEN", ""),
        contentTypes: [
          {
            uid: "api::about-page.about-page",
            button_label: "Open Frontend Preview",
            query: { type: "about-us" },
          },
          {
            uid: "api::donations-page.donations-page",
            button_label: "Open Frontend Preview",
            query: { type: "donate" },
          },
          {
            uid: "api::islam-faith-page.islam-faith-page",
            button_label: "Open Frontend Preview",
            query: { type: "islam-and-faith" },
          },
          {
            uid: "api::contact-page.contact-page",
            button_label: "Open Frontend Preview",
            query: { type: "contact-and-visit" },
          },
          {
            uid: "plugin::events.event",
            button_label: "Open Frontend Preview",
            query: { type: "events-and-programs" },
          },
          {
            uid: "api::community-service.community-service",
            button_label: "Open Frontend Preview",
            query: { type: "community-services" },
          },
          {
            uid: "api::article.article",
            button_label: "Open Frontend Preview",
            query: { type: "islam-and-faith" },
          },
          {
            uid: "plugin::donations.campaign",
            button_label: "Open Frontend Preview",
            query: { type: "donate" },
          },
          {
            uid: "plugin::media-feeds.media-item",
            button_label: "Open Frontend Preview",
            query: { type: "media" },
          },
          {
            uid: "plugin::resources.publication",
            button_label: "Open Frontend Preview",
            query: { type: "resources" },
          },
        ],
      },
    },

    // 13. Environment Label Badge (@frameless/strapi-plugin-env-label)
    "env-label": {
      enabled: true,
      config: {
        env_label: env("STRAPI_ENV_LABEL", "development"),
      },
    },

    // 14. Editorial Entity Notes (@frameless/strapi-plugin-notes)
    "entity-notes": {
      enabled: true,
    },

    // 15. Visual Email Template Designer for Strapi v5 (strapi-plugin-email-designer-5)
    "email-designer-5": {
      enabled: true,
      config: {
        appearance: {
          theme: "modern_light",
          panels: {
            tools: {
              dock: "left",
            },
          },
        },
        mergeTags: {
          mosque: {
            name: "Mosque Info",
            mergeTags: {
              name: {
                name: "Mosque Name",
                value: "{{mosque.name}}",
                sample: "Mezquita Central Abu Bakr As-Siddiq",
              },
              address: {
                name: "Mosque Address",
                value: "{{mosque.address}}",
                sample: "Calle 80 # 30-15, Bogotá D.C., Colombia",
              },
              phone: {
                name: "Mosque Phone",
                value: "{{mosque.phone}}",
                sample: "+57 (601) 250-8000",
              },
              email: {
                name: "Mosque Email",
                value: "{{mosque.email}}",
                sample: "info@mezquitabogota.org",
              },
            },
          },
          visitor: {
            name: "Contact / Visitor",
            mergeTags: {
              fullName: {
                name: "Full Name",
                value: "{{visitor.fullName}}",
                sample: "Ahmad Mansoor",
              },
              email: {
                name: "Email Address",
                value: "{{visitor.email}}",
                sample: "visitor@example.org",
              },
              phone: {
                name: "Phone Number",
                value: "{{visitor.phone}}",
                sample: "+57 310 555-0199",
              },
              subject: {
                name: "Inquiry Category",
                value: "{{visitor.subject}}",
                sample: "general",
              },
              message: {
                name: "Message Body",
                value: "{{visitor.message}}",
                sample:
                  "As-salamu alaykum, I would like information about Friday prayers.",
              },
            },
          },
          booking: {
            name: "Guided Visit Booking",
            mergeTags: {
              visitorName: {
                name: "Visitor Name",
                value: "{{booking.visitorName}}",
                sample: "Prof. Carlos Gómez",
              },
              organizationOrSchool: {
                name: "Organization / School",
                value: "{{booking.organizationOrSchool}}",
                sample: "Universidad Nacional de Colombia",
              },
              preferredDate: {
                name: "Preferred Date",
                value: "{{booking.preferredDate}}",
                sample: "2026-11-15",
              },
              preferredTimeSlot: {
                name: "Preferred Time Slot",
                value: "{{booking.preferredTimeSlot}}",
                sample: "10:00 AM",
              },
              groupSize: {
                name: "Group Size",
                value: "{{booking.groupSize}}",
                sample: "25",
              },
              preferredGuideLanguage: {
                name: "Guide Language",
                value: "{{booking.preferredGuideLanguage}}",
                sample: "es",
              },
              notes: {
                name: "Notes",
                value: "{{booking.notes}}",
                sample: "University comparative religion class visit",
              },
            },
          },
          donation: {
            name: "Donation & DIAN Receipt",
            mergeTags: {
              donorName: {
                name: "Donor Name",
                value: "{{donation.donorName}}",
                sample: "Amina Ramírez",
              },
              amount: {
                name: "Amount",
                value: "{{donation.amount}}",
                sample: "250000",
              },
              currency: {
                name: "Currency",
                value: "{{donation.currency}}",
                sample: "COP",
              },
              donationType: {
                name: "Donation Category",
                value: "{{donation.donationType}}",
                sample: "zakat",
              },
              paymentMethodUsed: {
                name: "Payment Method",
                value: "{{donation.paymentMethodUsed}}",
                sample: "bancolombia",
              },
              transactionReference: {
                name: "Transaction Reference",
                value: "{{donation.transactionReference}}",
                sample: "TXN-984120",
              },
              requestsTaxCertificate: {
                name: "Requests DIAN Tax Certificate",
                value: "{{donation.requestsTaxCertificate}}",
                sample: "Yes",
              },
            },
          },
        },
      },
    },

    // 16. Content Manager Sidebar Organizer (strapi-plugin-content-manager-organizer)
    "content-manager-organizer": {
      enabled: true,
    },

    // 17. Spotlight Global Search Palette (strapi-global-search — local fork)
    "global-search": {
      enabled: true,
      config: {
        includePluginContentTypes: true,
        includeDrafts: true,
        deep: true,
      },
    },

    // 18-27. @vicacha-devs Strapi v5 Plugins (calendar, events, bookings, etc.)
    ...buildVicachaPluginsConfig(env),
  };
};
