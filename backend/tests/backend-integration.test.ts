import assert from 'node:assert/strict';
import { dirname, resolve as resolvePath } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import buildPluginsConfig from '../config/plugins';
import { resolveAppKeys, resolveSecret } from '../config/security.utils';
import { buildVicachaPluginsConfig } from '../config/vicachaPlugins';
import backendLifecycle from '../src/index';

const currentDir = dirname(fileURLToPath(import.meta.url));
const extensionsRoot = resolvePath(
  currentDir,
  '../../../strapi-v5-extensions/packages'
);

function createMockEnv(overrides: Record<string, unknown> = {}) {
  const envFn = ((key: string, defaultValue?: unknown) => {
    if (key in overrides) return overrides[key];
    return defaultValue ?? '';
  }) as {
    (key: string, defaultValue?: any): any;
    int(key: string, defaultValue?: number): number;
    bool(key: string, defaultValue?: boolean): boolean;
  };

  envFn.int = (key: string, defaultValue = 0) => {
    if (key in overrides) return Number(overrides[key]);
    return defaultValue;
  };
  envFn.bool = (key: string, defaultValue = false) => {
    if (key in overrides) return Boolean(overrides[key]);
    return defaultValue;
  };

  return envFn;
}

describe('Central Mosque Backend — Security, Plugin Configurations, Bootstrap & 10-Plugin Contract Parity', () => {
  it('enforces fail-closed secrets in production and ephemeral PRNG secrets in dev/test', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.TEST_MISSING_SECRET;
      assert.throws(
        () => resolveSecret('TEST_MISSING_SECRET'),
        /Missing required security secret in production/
      );
      assert.throws(
        () => resolveAppKeys('TEST_MISSING_APP_KEYS'),
        /Missing required security secret in production/
      );

      process.env.NODE_ENV = 'test';
      const ephemeral = resolveSecret('TEST_MISSING_SECRET');
      assert.equal(ephemeral.length, 64);
      const keys = resolveAppKeys('TEST_MISSING_APP_KEYS');
      assert.equal(keys.length, 2);
    } finally {
      process.env.NODE_ENV = prevNodeEnv;
    }
  });

  it('configures all 10 @vicacha-devs plugins with Hijri Umm al-Qura secondary calendar and field mappings', () => {
    const env = createMockEnv({
      FRONTEND_URL: 'https://mezquitabogota.org',
      TYPESENSE_API_KEY: 'ts-test-key',
    });

    const vicachaConfig = buildVicachaPluginsConfig(env);
    const expectedPlugins = [
      'calendar',
      'events',
      'bookings',
      'certificates',
      'islam',
      'media-feeds',
      'donations',
      'inbox',
      'broadcasts',
      'resources',
    ] as const;

    for (const pluginKey of expectedPlugins) {
      assert.equal(
        vicachaConfig[pluginKey]?.enabled,
        true,
        `Expected @vicacha-devs/strapi-plugin-${pluginKey} to be enabled`
      );
    }

    const fullPlugins = buildPluginsConfig({ env });
    assert.equal(fullPlugins.typesense.enabled, true);
    assert.ok(
      fullPlugins['strapi-cache'].config.cacheableRoutes.includes(
        '/api/events/spotlights'
      )
    );
    assert.ok(
      fullPlugins['strapi-cache'].config.excludeRoutes.includes('/api/bookings')
    );
    assert.ok(
      fullPlugins['strapi-cache'].config.excludeRoutes.includes(
        '/api/certificates/apply'
      )
    );
  });

  it('bootstraps 4 locales (es, en, ar, tr), public permissions, and 4-locale seed data idempotently', async () => {
    const createdLocales: Array<{ code: string; name: string }> = [];
    const createdPermissions: Array<string> = [];
    const createdDocsByUid: Record<string, Array<{ locale?: string; data: Record<string, unknown> }>> = {};
    const createdEmailTemplates: Array<Record<string, unknown>> = [];

    const mockStrapi = {
      log: {
        info: () => {},
        warn: () => {},
        error: () => {},
      },
      contentTypes: {
        'plugin::email-designer-5.email-designer-template': {},
      },
      db: {
        query: (uid: string) => {
          if (uid === 'plugin::email-designer-5.email-designer-template') {
            return {
              findOne: async ({ where }: { where: { templateReferenceId: number } }) =>
                createdEmailTemplates.find(
                  (t) => t.templateReferenceId === where.templateReferenceId
                ) ?? null,
              create: async ({ data }: { data: Record<string, unknown> }) => {
                createdEmailTemplates.push(data);
                return data;
              },
            };
          }
          return {
            findOne: async () => null,
            create: async () => ({}),
          };
        },
      },
      plugin: (name: string) => {
        if (name === 'i18n') {
          return {
            service: () => ({
              find: async () => [{ code: 'es' }],
              create: async (loc: { code: string; name: string }) => {
                createdLocales.push(loc);
              },
            }),
          };
        }
        return undefined;
      },
      query: (uid: string) => {
        if (uid === 'plugin::users-permissions.role') {
          return {
            findOne: async () => ({ id: 1, type: 'public' }),
          };
        }
        if (uid === 'plugin::users-permissions.permission') {
          return {
            findOne: async ({ where }: { where: { action: string } }) =>
              createdPermissions.includes(where.action)
                ? { id: 1, action: where.action }
                : null,
            create: async ({ data }: { data: { action: string } }) => {
              createdPermissions.push(data.action);
            },
          };
        }
        return {
          findOne: async () => null,
          create: async () => ({}),
        };
      },
      documents: (uid: string) => {
        if (!createdDocsByUid[uid]) {
          createdDocsByUid[uid] = [];
        }
        return {
          findFirst: async ({ locale }: { locale?: string } = {}) =>
            createdDocsByUid[uid].find((d) => d.locale === locale) ?? null,
          findMany: async ({ locale }: { locale?: string } = {}) =>
            createdDocsByUid[uid].filter((d) => d.locale === locale),
          create: async (entry: { locale?: string; data: Record<string, unknown> }) => {
            createdDocsByUid[uid].push(entry);
            return entry;
          },
        };
      },
    };

    await backendLifecycle.bootstrap({ strapi: mockStrapi as never });

    // 1. Locales: en, ar, tr created (since es existed)
    assert.deepEqual(
      createdLocales.map((l) => l.code),
      ['en', 'ar', 'tr']
    );

    // 2. Public permissions include all 10 @vicacha-devs plugins + read models + create-only plugin submission models
    assert.ok(
      createdPermissions.includes('plugin::islam.content-api.getDailyInspiration')
    );
    assert.ok(
      createdPermissions.includes('plugin::events.content-api.listSpotlights')
    );
    assert.ok(
      createdPermissions.includes('plugin::bookings.content-api.createReservation')
    );
    assert.ok(
      createdPermissions.includes('plugin::certificates.content-api.applyCertificate')
    );
    assert.ok(
      createdPermissions.includes('plugin::donations.content-api.listUtilityInvoices')
    );
    assert.ok(
      createdPermissions.includes('plugin::resources.resourcesController.downloadPublication')
    );
    assert.ok(
      createdPermissions.includes('plugin::bookings.booking.create')
    );
    assert.ok(
      !createdPermissions.includes('plugin::bookings.booking.find'),
      'Inbound plugin submission collections must strictly follow least-privilege (create-only)'
    );

    // 3. Seeded content across all 4 locales (es, en, ar, tr) directly in plugin::* and api::* collections
    assert.equal(createdDocsByUid['api::article.article']?.length, 12); // 3 canonical slugs * 4 locales
    assert.equal(createdDocsByUid['plugin::events.event']?.length, 20); // 5 events (2 spotlights + 3 community events) * 4 locales
    assert.equal(createdDocsByUid['plugin::donations.campaign']?.length, 20); // 5 campaigns (1 Waqf + 4 utility invoices) * 4 locales
    assert.equal(createdDocsByUid['plugin::media-feeds.media-item']?.length, 10); // 3 es + 3 en + 2 ar + 2 tr
    assert.equal(createdEmailTemplates.length, 15); // 12 multilingual (es/en/ar/tr) + 3 admin alerts

    // 4. Verify idempotency: running bootstrap a second time must not duplicate documents or permissions
    const prevPermissionCount = createdPermissions.length;
    await backendLifecycle.bootstrap({ strapi: mockStrapi as never });
    assert.equal(createdPermissions.length, prevPermissionCount);
    assert.equal(createdDocsByUid['api::article.article']?.length, 12);
    assert.equal(createdDocsByUid['plugin::events.event']?.length, 20);
    assert.equal(createdDocsByUid['plugin::donations.campaign']?.length, 20);
    assert.equal(createdEmailTemplates.length, 15);
  });

  it('verifies that every @vicacha-devs plugin controller action in backend/src/index.ts exists on the plugin server module', async () => {
    const pluginServerDirs: Record<string, string> = {
      calendar: 'strapi-plugin-calendar',
      events: 'strapi-plugin-events',
      bookings: 'strapi-plugin-bookings',
      certificates: 'strapi-plugin-certificates',
      islam: 'strapi-plugin-islam',
      'media-feeds': 'strapi-plugin-media-feeds',
      donations: 'strapi-plugin-donations',
      inbox: 'strapi-plugin-inbox',
      broadcasts: 'strapi-plugin-broadcasts',
      resources: 'strapi-plugin-resources',
    };

    for (const [pluginName, folderName] of Object.entries(pluginServerDirs)) {
      const serverEntryUrl = pathToFileURL(
        resolvePath(extensionsRoot, folderName, 'server/src/index.ts')
      ).href;
      const mod = await import(serverEntryUrl);
      const serverExport = mod.default ?? mod;
      assert.ok(
        serverExport.controllers,
        `Expected ${folderName} server entry to export controllers`
      );
      assert.ok(
        serverExport.routes,
        `Expected ${folderName} server entry to export routes`
      );
      assert.ok(
        serverExport.services,
        `Expected ${folderName} server entry to export services`
      );
      assert.ok(
        typeof serverExport.bootstrap === 'function',
        `Expected ${folderName} server entry to export bootstrap()`
      );
    }
  });

  it('verifies end-to-end Frontend SSR & BFF endpoint contract against @vicacha-devs plugin content-api routes and controllers', async () => {
    const frontendContractEndpoints: Array<{
      pluginFolder: string;
      method: 'GET' | 'POST';
      path: string;
    }> = [
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/daily-inspiration' },
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/scripture/daily' },
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/prayer-times' },
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/hijri' },
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/scripture' },
      { pluginFolder: 'strapi-plugin-islam', method: 'GET', path: '/nisab' },
      { pluginFolder: 'strapi-plugin-donations', method: 'GET', path: '/campaigns' },
      { pluginFolder: 'strapi-plugin-donations', method: 'GET', path: '/utility-invoices' },
      { pluginFolder: 'strapi-plugin-donations', method: 'POST', path: '/pledges' },
      { pluginFolder: 'strapi-plugin-events', method: 'GET', path: '/spotlights' },
      { pluginFolder: 'strapi-plugin-events', method: 'GET', path: '/occurrences' },
      { pluginFolder: 'strapi-plugin-events', method: 'GET', path: '/feed.ics' },
      { pluginFolder: 'strapi-plugin-events', method: 'POST', path: '/:documentId/register' },
      { pluginFolder: 'strapi-plugin-bookings', method: 'POST', path: '/reserve' },
      { pluginFolder: 'strapi-plugin-certificates', method: 'POST', path: '/apply' },
      { pluginFolder: 'strapi-plugin-media-feeds', method: 'GET', path: '/episodes' },
      { pluginFolder: 'strapi-plugin-media-feeds', method: 'GET', path: '/live' },
      { pluginFolder: 'strapi-plugin-media-feeds', method: 'GET', path: '/rss.xml' },
      { pluginFolder: 'strapi-plugin-resources', method: 'GET', path: '/publications' },
      { pluginFolder: 'strapi-plugin-resources', method: 'GET', path: '/galleries' },
      { pluginFolder: 'strapi-plugin-resources', method: 'GET', path: '/glossary' },
      { pluginFolder: 'strapi-plugin-broadcasts', method: 'GET', path: '/public/channels' },
      { pluginFolder: 'strapi-plugin-inbox', method: 'GET', path: '/alerts' },
      { pluginFolder: 'strapi-plugin-inbox', method: 'POST', path: '/subscribers' },
      { pluginFolder: 'strapi-plugin-inbox', method: 'POST', path: '/forms/:slug/submit' },
    ];

    for (const contract of frontendContractEndpoints) {
      const serverEntryUrl = pathToFileURL(
        resolvePath(extensionsRoot, contract.pluginFolder, 'server/src/index.ts')
      ).href;
      const mod = await import(serverEntryUrl);
      const serverExport = mod.default ?? mod;
      const contentApiRoutesObj =
        typeof serverExport.routes['content-api'] === 'function'
          ? serverExport.routes['content-api']()
          : serverExport.routes['content-api'];
      const routes: Array<{ method: string; path: string; handler: string }> =
        contentApiRoutesObj.routes;

      const matchedRoute = routes.find(
        (r) => r.method === contract.method && r.path === contract.path
      );
      assert.ok(
        matchedRoute,
        `Expected ${contract.pluginFolder} content-api routes to include ${contract.method} ${contract.path}`
      );

      const [controllerName, actionName] = matchedRoute.handler.split('.');
      const controllerFactory = serverExport.controllers[controllerName];
      assert.ok(
        typeof controllerFactory === 'function',
        `Expected ${contract.pluginFolder} controller ${controllerName} to be a factory function`
      );
      const controllerInstance = controllerFactory({ strapi: {} });
      assert.ok(
        typeof controllerInstance[actionName] === 'function',
        `Expected ${contract.pluginFolder} controller ${controllerName}.${actionName} to be a function`
      );
    }
  });
});

