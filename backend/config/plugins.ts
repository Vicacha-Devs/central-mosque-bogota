import { resolveSecret } from './security.utils';
import { buildVicachaPluginsConfig } from './vicachaPlugins';

// TODO(security): Integrate Cloudinary malware/antivirus moderation add-on (e.g., AWS Rekognition / Metadefender CDR) on uploaded PDFs and media in production.

const UPLOAD_SIZE_LIMIT_BYTES = 10 * 1024 * 1024; // 10 MB max upload size

export default ({ env }) => {
  const cloudinaryName = env('CLOUDINARY_NAME', '');
  const smtpHost = env('SMTP_HOST', '');

  return {
    // 1. Users & Permissions JWT security configuration
    'users-permissions': {
      config: {
        jwtSecret: resolveSecret('JWT_SECRET'),
        jwt: {
          expiresIn: env('JWT_EXPIRES_IN', '7d'),
        },
        ratelimit: {
          interval: 60000,
          max: 10,
        },
      },
    },

    // 2. Cloudinary CDN Upload Provider (falls back to local upload with size limits when CLOUDINARY_NAME is omitted)
    upload: cloudinaryName
      ? {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: env('CLOUDINARY_KEY', ''),
              api_secret: env('CLOUDINARY_SECRET', ''),
            },
            actionOptions: {
              upload: {
                folder: env('CLOUDINARY_FOLDER', 'central-mosque-bogota'),
                resource_type: 'auto',
              },
              uploadStream: {
                folder: env('CLOUDINARY_FOLDER', 'central-mosque-bogota'),
                resource_type: 'auto',
              },
              delete: {},
            },
          },
        }
      : {
          config: {
            sizeLimit: UPLOAD_SIZE_LIMIT_BYTES,
          },
        },

    // 2b. Transactional Email Provider (@strapi/provider-email-nodemailer when SMTP_HOST is set)
    ...(smtpHost
      ? {
          email: {
            config: {
              provider: 'nodemailer',
              providerOptions: {
                host: smtpHost,
                port: env.int('SMTP_PORT', 587),
                secure: env.bool('SMTP_SECURE', false),
                ...(env('SMTP_USERNAME', '')
                  ? {
                      auth: {
                        user: env('SMTP_USERNAME', ''),
                        pass: env('SMTP_PASSWORD', ''),
                      },
                    }
                  : {}),
              },
              settings: {
                defaultFrom: env(
                  'EMAIL_DEFAULT_FROM',
                  'no-reply@mezquitabogota.org'
                ),
                defaultReplyTo: env(
                  'EMAIL_DEFAULT_REPLY_TO',
                  'info@mezquitabogota.org'
                ),
              },
            },
          },
        }
      : {}),

    // 3. SEO Plugin (@notum-cz/strapi-plugin-seo)
    seo: {
      enabled: true,
    },

    // 4. Tiptap Rich Text Editor (@notum-cz/strapi-plugin-tiptap-editor)
    'strapi-plugin-tiptap-editor': {
      enabled: true,
    },

    // 5. Deep Populate for Strapi v5 (strapi-v5-plugin-populate-deep)
    'populate-deep': {
      config: {
        defaultDepth: 5,
      },
    },

    // 6. Scheduled Publisher (strapi-plugin-publisher)
    publisher: {
      enabled: true,
    },

    // 7. Config Sync across environments (strapi-plugin-config-sync)
    'config-sync': {
      enabled: true,
      config: {
        syncDir: 'config/sync/',
      },
    },

    // 8. REST API Caching (strapi-cache v1.12.4 — disabled by default in dev; set CACHE_ENABLED=true in prod)
    'strapi-cache': {
      enabled: env.bool('CACHE_ENABLED', false),
      config: {
        provider: env('CACHE_PROVIDER', 'memory'), // 'memory' | 'valkey' | 'redis'
        redisConfig: env(
          'VALKEY_URL',
          env('REDIS_URL', 'redis://127.0.0.1:6379')
        ),
        max: env.int('CACHE_MAX_ITEMS', 1000),
        ttl: env.int('CACHE_TTL', 3600000), // 1 hour in ms
        cacheAuthorizedRequests: true,
        cacheGetTimeoutInMs: env.int('CACHE_GET_TIMEOUT_MS', 1000),
        autoPurgeCache: true,
        autoPurgeCacheOnStart: true,
        cacheableRoutes: [
          '/api/global-setting',
          '/api/prayer-setting',
          '/api/about-page',
          '/api/donations-page',
          '/api/islam-faith-page',
          '/api/contact-page',
          '/api/events',
          '/api/community-services',
          '/api/articles',
          '/api/media-highlights',
          '/api/donation-campaigns',
          '/api/leaders',
          '/api/faqs',
        ],
        excludeRoutes: [
          '/api/contact-submissions',
          '/api/visit-bookings',
          '/api/donation-submissions',
          '/api/inbox',
          '/api/donations/pledges',
          '/api/donations/webhooks',
          '/api/islam',
          '/api/events/occurrences',
          '/api/events/spotlights',
          '/api/bookings',
          '/api/certificates/apply',
          '/api/certificates/webhooks',
        ],
      },
    },

    // 9. XML Sitemap Generator for Strapi v5 (strapi-5-sitemap-plugin)
    'strapi-5-sitemap-plugin': {
      enabled: true,
    },

    // 10. Visual Hierarchical Navigation Builder (strapi-plugin-navigation)
    navigation: {
      enabled: true,
      config: {
        additionalFields: ['audience'],
        contentTypes: [
          'api::event.event',
          'api::community-service.community-service',
          'api::article.article',
        ],
        contentTypesNameFields: {
          'api::event.event': ['title'],
          'api::community-service.community-service': ['title'],
          'api::article.article': ['title'],
        },
        allowedLevels: 2,
        i18nEnabled: true,
      },
    },

    // 11. Typesense Full-Text, Vector & Hybrid Search (@juadariasmar/strapi-plugin-typesense)
    typesense: {
      enabled: Boolean(env('TYPESENSE_API_KEY', '')),
      config: {
        apiKey: env('TYPESENSE_API_KEY', ''),
        nodes: [
          {
            host: env('TYPESENSE_HOST', '127.0.0.1'),
            port: env.int('TYPESENSE_PORT', 8108),
            protocol: env('TYPESENSE_PROTOCOL', 'http'),
          },
        ],
        collections: {
          'api::article.article': {
            name: 'articles',
            facets: ['category', 'locale'],
            vectorField: {
              name: 'embedding',
              numDim: 384,
              autoEmbed: true,
              embedFrom: ['title', 'description', 'content'],
              modelName: 'ts/all-MiniLM-L6-v2',
            },
          },
          'api::event.event': {
            name: 'events',
            facets: ['category', 'locale'],
            vectorField: {
              name: 'embedding',
              numDim: 384,
              autoEmbed: true,
              embedFrom: ['title', 'summary', 'description'],
              modelName: 'ts/all-MiniLM-L6-v2',
            },
          },
          'api::community-service.community-service': {
            name: 'community_services',
            facets: ['locale'],
            vectorField: {
              name: 'embedding',
              numDim: 384,
              autoEmbed: true,
              embedFrom: ['title', 'description', 'longDescription'],
              modelName: 'ts/all-MiniLM-L6-v2',
            },
          },
          'api::media-highlight.media-highlight': {
            name: 'media_highlights',
            facets: ['type', 'locale'],
            vectorField: {
              name: 'embedding',
              numDim: 384,
              autoEmbed: true,
              embedFrom: ['title', 'description'],
              modelName: 'ts/all-MiniLM-L6-v2',
            },
          },
          'api::faq.faq': {
            name: 'faqs',
            facets: ['category', 'locale'],
            vectorField: {
              name: 'embedding',
              numDim: 384,
              autoEmbed: true,
              embedFrom: ['question', 'answer'],
              modelName: 'ts/all-MiniLM-L6-v2',
            },
          },
        },
      },
    },

    // 12. Preview Button (@frameless/preview-button)
    'preview-button': {
      enabled: true,
      config: {
        domain: env('FRONTEND_URL', 'http://127.0.0.1:4321'),
        preview_secret_token: resolveSecret('PREVIEW_SECRET'),
        api_token: env('PREVIEW_API_TOKEN', ''),
        contentTypes: [
          {
            uid: 'api::about-page.about-page',
            query: { type: 'about-us' },
          },
          {
            uid: 'api::donations-page.donations-page',
            query: { type: 'donate' },
          },
          {
            uid: 'api::islam-faith-page.islam-faith-page',
            query: { type: 'islam-and-faith' },
          },
          {
            uid: 'api::contact-page.contact-page',
            query: { type: 'contact-and-visit' },
          },
          {
            uid: 'api::event.event',
            query: { type: 'events-and-programs' },
          },
          {
            uid: 'api::community-service.community-service',
            query: { type: 'community-services' },
          },
          {
            uid: 'api::article.article',
            query: { type: 'islam-and-faith' },
          },
        ],
      },
    },

    // 13. Environment Label Badge (@frameless/strapi-plugin-env-label)
    'env-label': {
      enabled: true,
      config: {
        env_label: env('STRAPI_ENV_LABEL', 'development'),
      },
    },

    // 14. Editorial Entity Notes (@frameless/strapi-plugin-notes)
    'entity-notes': {
      enabled: true,
    },

    // 15. Visual Email Template Designer for Strapi v5 (strapi-plugin-email-designer-5)
    'email-designer-5': {
      enabled: true,
      config: {
        appearance: {
          theme: 'modern_light',
          panels: {
            tools: {
              dock: 'left',
            },
          },
        },
        mergeTags: {
          mosque: {
            name: 'Mosque Info',
            mergeTags: {
              name: {
                name: 'Mosque Name',
                value: '{{mosque.name}}',
                sample: 'Mezquita Central Abu Bakr As-Siddiq',
              },
              address: {
                name: 'Mosque Address',
                value: '{{mosque.address}}',
                sample: 'Calle 80 # 30-15, Bogotá D.C., Colombia',
              },
              phone: {
                name: 'Mosque Phone',
                value: '{{mosque.phone}}',
                sample: '+57 (601) 250-8000',
              },
              email: {
                name: 'Mosque Email',
                value: '{{mosque.email}}',
                sample: 'info@mezquitabogota.org',
              },
            },
          },
          visitor: {
            name: 'Contact / Visitor',
            mergeTags: {
              fullName: {
                name: 'Full Name',
                value: '{{visitor.fullName}}',
                sample: 'Ahmad Mansoor',
              },
              email: {
                name: 'Email Address',
                value: '{{visitor.email}}',
                sample: 'visitor@example.org',
              },
              phone: {
                name: 'Phone Number',
                value: '{{visitor.phone}}',
                sample: '+57 310 555-0199',
              },
              subject: {
                name: 'Inquiry Category',
                value: '{{visitor.subject}}',
                sample: 'general',
              },
              message: {
                name: 'Message Body',
                value: '{{visitor.message}}',
                sample: 'As-salamu alaykum, I would like information about Friday prayers.',
              },
            },
          },
          booking: {
            name: 'Guided Visit Booking',
            mergeTags: {
              visitorName: {
                name: 'Visitor Name',
                value: '{{booking.visitorName}}',
                sample: 'Prof. Carlos Gómez',
              },
              organizationOrSchool: {
                name: 'Organization / School',
                value: '{{booking.organizationOrSchool}}',
                sample: 'Universidad Nacional de Colombia',
              },
              preferredDate: {
                name: 'Preferred Date',
                value: '{{booking.preferredDate}}',
                sample: '2026-11-15',
              },
              preferredTimeSlot: {
                name: 'Preferred Time Slot',
                value: '{{booking.preferredTimeSlot}}',
                sample: '10:00 AM',
              },
              groupSize: {
                name: 'Group Size',
                value: '{{booking.groupSize}}',
                sample: '25',
              },
              preferredGuideLanguage: {
                name: 'Guide Language',
                value: '{{booking.preferredGuideLanguage}}',
                sample: 'es',
              },
              notes: {
                name: 'Notes',
                value: '{{booking.notes}}',
                sample: 'University comparative religion class visit',
              },
            },
          },
          donation: {
            name: 'Donation & DIAN Receipt',
            mergeTags: {
              donorName: {
                name: 'Donor Name',
                value: '{{donation.donorName}}',
                sample: 'Amina Ramírez',
              },
              amount: {
                name: 'Amount',
                value: '{{donation.amount}}',
                sample: '250000',
              },
              currency: {
                name: 'Currency',
                value: '{{donation.currency}}',
                sample: 'COP',
              },
              donationType: {
                name: 'Donation Category',
                value: '{{donation.donationType}}',
                sample: 'zakat',
              },
              paymentMethodUsed: {
                name: 'Payment Method',
                value: '{{donation.paymentMethodUsed}}',
                sample: 'bancolombia',
              },
              transactionReference: {
                name: 'Transaction Reference',
                value: '{{donation.transactionReference}}',
                sample: 'TXN-984120',
              },
              requestsTaxCertificate: {
                name: 'Requests DIAN Tax Certificate',
                value: '{{donation.requestsTaxCertificate}}',
                sample: 'Yes',
              },
            },
          },
        },
      },
    },

    // 16. Content Manager Sidebar Organizer (strapi-plugin-content-manager-organizer)
    'content-manager-organizer': {
      enabled: true,
    },

    // 17-19. @vicacha-devs Strapi v5 Plugins (calendar, events, bookings)
    ...buildVicachaPluginsConfig(env),
  };
};
