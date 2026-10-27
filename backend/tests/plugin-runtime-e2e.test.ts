import assert from 'node:assert/strict';
import { dirname, resolve as resolvePath } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildVicachaPluginsConfig } from '../config/vicachaPlugins';
import backendLifecycle from '../src/index';

const currentDir = dirname(fileURLToPath(import.meta.url));
const extensionsRoot = resolvePath(
  currentDir,
  '../../../strapi-v5-extensions/packages'
);

const PLUGIN_FOLDERS: Record<string, string> = {
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

function createMockEnv(overrides: Record<string, unknown> = {}) {
  const envFn = ((key: string, defaultValue?: unknown) => {
    if (key in overrides) return overrides[key];
    return defaultValue ?? '';
  }) as {
    (key: string, defaultValue?: any): any;
    int(key: string, defaultValue?: number): number;
    bool(key: string, defaultValue?: boolean): boolean;
  };
  envFn.int = (key: string, defaultValue = 0) =>
    key in overrides ? Number(overrides[key]) : defaultValue;
  envFn.bool = (key: string, defaultValue = false) =>
    key in overrides ? Boolean(overrides[key]) : defaultValue;
  return envFn;
}

function createKoaCtx(options: {
  query?: Record<string, unknown>;
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  ip?: string;
} = {}) {
  const headers: Record<string, string> = {};
  const ctx: any = {
    query: options.query ?? {},
    params: options.params ?? {},
    ip: options.ip ?? '127.0.0.1',
    request: {
      ip: options.ip ?? '127.0.0.1',
      body: options.body ?? {},
      headers: {},
    },
    status: 200,
    body: undefined,
    set(key: string, val: string) {
      headers[key] = val;
    },
    getHeaders: () => headers,
    badRequest(message: string, details?: unknown) {
      ctx.status = 400;
      ctx.body = { error: { status: 400, message, details } };
      return ctx.body;
    },
    notFound(message = 'Not Found') {
      ctx.status = 404;
      ctx.body = { error: { status: 404, message } };
      return ctx.body;
    },
    tooManyRequests(message = 'Too Many Requests') {
      ctx.status = 429;
      ctx.body = { error: { status: 429, message } };
      return ctx.body;
    },
    unauthorized(message = 'Unauthorized') {
      ctx.status = 401;
      ctx.body = { error: { status: 401, message } };
      return ctx.body;
    },
    send(payload: unknown) {
      ctx.body = payload;
      return payload;
    },
  };
  return ctx;
}

describe('Central Mosque Backend — 10-Plugin Live Runtime & Controller Execution E2E', () => {
  it('boots all 10 @vicacha-devs plugins with Mosque config + 4-locale seed data and executes live content-api controllers', async () => {
    const env = createMockEnv({
      FRONTEND_URL: 'https://mezquitabogota.org',
    });
    const vicachaConfigs = buildVicachaPluginsConfig(env);

    const storeMemory = new Map<string, unknown>();
    const documentsDb: Record<string, Array<Record<string, any>>> = {};
    const pluginServices: Record<string, Record<string, any>> = {};
    const pluginControllers: Record<string, Record<string, any>> = {};
    let autoId = 1;

    const mockStrapi: any = {
      log: {
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
      },
      config: {
        get: (key: string, defaultVal?: unknown) => {
          if (key.startsWith('plugin::')) {
            const pluginName = key.replace('plugin::', '');
            return (vicachaConfigs as any)[pluginName]?.config ?? defaultVal ?? {};
          }
          if (key.startsWith('plugin.')) {
            const pluginName = key.replace('plugin.', '');
            return (vicachaConfigs as any)[pluginName]?.config ?? defaultVal ?? {};
          }
          return defaultVal ?? {};
        },
      },
      contentTypes: {
        'plugin::email-designer-5.email-designer-template': {},
      },
      store: (storeProps?: { type?: string; name?: string; key?: string }) => ({
        get: async (arg?: { key?: string }) => {
          const compositeKey = `${storeProps?.name ?? 'global'}:${arg?.key ?? storeProps?.key ?? 'settings'}`;
          return storeMemory.get(compositeKey) ?? null;
        },
        set: async (arg: { key?: string; value: unknown }) => {
          const compositeKey = `${storeProps?.name ?? 'global'}:${arg?.key ?? storeProps?.key ?? 'settings'}`;
          storeMemory.set(compositeKey, arg.value);
          return arg.value;
        },
      }),
      db: {
        query: (uid: string) => ({
          findOne: async ({ where }: any = {}) => {
            const list = documentsDb[uid] ?? [];
            if (!where) return list[0] ?? null;
            return (
              list.find((item) =>
                Object.entries(where).every(([k, v]) => item[k] === v)
              ) ?? null
            );
          },
          findMany: async () => documentsDb[uid] ?? [],
          create: async ({ data }: any) => {
            if (!documentsDb[uid]) documentsDb[uid] = [];
            const created = { id: autoId++, documentId: `doc-${autoId}`, ...data };
            documentsDb[uid].push(created);
            return created;
          },
          count: async () => (documentsDb[uid] ?? []).length,
        }),
      },
      query: (uid: string) => mockStrapi.db.query(uid),
      documents: (uid: string) => {
        if (!documentsDb[uid]) {
          documentsDb[uid] = [];
        }
        return {
          findFirst: async ({ locale, filters }: any = {}) => {
            return (
              documentsDb[uid].find((doc) => {
                if (locale && doc.locale && doc.locale !== locale) return false;
                if (filters) {
                  return Object.entries(filters).every(([k, v]) => doc[k] === v);
                }
                return true;
              }) ?? null
            );
          },
          findOne: async ({ documentId }: { documentId: string }) =>
            documentsDb[uid].find((d) => d.documentId === documentId) ?? null,
          findMany: async ({ locale, filters }: any = {}) => {
            return documentsDb[uid].filter((doc) => {
              if (locale && doc.locale && doc.locale !== locale) return false;
              if (filters) {
                return Object.entries(filters).every(([k, v]) => {
                  if (v && typeof v === 'object' && '$eq' in v) {
                    return doc[k] === (v as any).$eq;
                  }
                  return doc[k] === v;
                });
              }
              return true;
            });
          },
          create: async ({ locale, data }: any) => {
            const entry = {
              id: autoId++,
              documentId: data?.documentId ?? `doc-${autoId}`,
              locale: locale ?? data?.locale ?? 'es',
              ...data,
            };
            documentsDb[uid].push(entry);
            return entry;
          },
          update: async ({ documentId, data }: any) => {
            const idx = documentsDb[uid].findIndex(
              (d) => d.documentId === documentId
            );
            if (idx >= 0) {
              documentsDb[uid][idx] = { ...documentsDb[uid][idx], ...data };
              return documentsDb[uid][idx];
            }
            return null;
          },
          count: async () => documentsDb[uid].length,
        };
      },
      plugin: (name: string) => {
        if (name === 'i18n') {
          return {
            service: () => ({
              find: async () => [{ code: 'es' }],
              create: async () => ({}),
            }),
          };
        }
        return {
          service: (svcName: string) => pluginServices[name]?.[svcName],
          controller: (ctrlName: string) => pluginControllers[name]?.[ctrlName],
        };
      },
    };

    // 1. Load & instantiate all 10 plugin server modules
    const loadedServerModules: Record<string, any> = {};
    for (const [pluginKey, folderName] of Object.entries(PLUGIN_FOLDERS)) {
      const entryUrl = pathToFileURL(
        resolvePath(extensionsRoot, folderName, 'server/src/index.ts')
      ).href;
      const mod = await import(entryUrl);
      const serverExport = mod.default ?? mod;
      loadedServerModules[pluginKey] = serverExport;

      pluginServices[pluginKey] = {};
      for (const [svcName, factory] of Object.entries<any>(
        serverExport.services ?? {}
      )) {
        pluginServices[pluginKey][svcName] =
          typeof factory === 'function'
            ? factory({ strapi: mockStrapi })
            : factory;
      }

      pluginControllers[pluginKey] = {};
      for (const [ctrlName, factory] of Object.entries<any>(
        serverExport.controllers ?? {}
      )) {
        pluginControllers[pluginKey][ctrlName] =
          typeof factory === 'function'
            ? factory({ strapi: mockStrapi })
            : factory;
      }
    }

    // 2. Run bootstrap() across all 10 plugins + backend seed bootstrap
    for (const [pluginKey, serverExport] of Object.entries(loadedServerModules)) {
      if (typeof serverExport.bootstrap === 'function') {
        await serverExport.bootstrap({ strapi: mockStrapi });
      }
    }
    await backendLifecycle.bootstrap({ strapi: mockStrapi });

    // 3. Test @vicacha-devs/strapi-plugin-islam live controller actions
    const islamCtrl = pluginControllers.islam['content-api'];
    const prayerCtx = createKoaCtx({ query: { date: '2026-03-20', locale: 'es' } });
    await islamCtrl.getPrayerTimes(prayerCtx);
    assert.equal(prayerCtx.status, 200);
    assert.ok(prayerCtx.body?.data?.times?.fajr);

    const qiblaCtx = createKoaCtx({ query: {} });
    await islamCtrl.getQibla(qiblaCtx);
    assert.equal(qiblaCtx.status, 200);
    const qiblaData = qiblaCtx.body?.data ?? qiblaCtx.body;
    assert.ok(
      typeof qiblaData?.direction?.degrees === 'number' &&
        qiblaData.direction.degrees > 64 &&
        qiblaData.direction.degrees < 66.5
    );

    const inspirationCtx = createKoaCtx({ query: { locale: 'ar' } });
    await islamCtrl.getDailyInspiration(inspirationCtx);
    assert.equal(inspirationCtx.status, 200);
    assert.ok(inspirationCtx.body?.data || inspirationCtx.body);

    const nisabCtx = createKoaCtx({ query: { currency: 'COP' } });
    await islamCtrl.getNisab(nisabCtx);
    assert.equal(nisabCtx.status, 200);
    assert.ok(nisabCtx.body?.data || nisabCtx.body);

    // 4. Test @vicacha-devs/strapi-plugin-donations live controller actions
    const donationsCtrl = pluginControllers.donations['content-api'];
    const invoicesCtx = createKoaCtx({ query: { locale: 'es' } });
    await donationsCtrl.listUtilityInvoices(invoicesCtx);
    assert.equal(invoicesCtx.status, 200);
    const invoicesList = invoicesCtx.body?.data ?? [];
    assert.ok(
      Array.isArray(invoicesList) && invoicesList.length >= 4,
      `Expected at least 4 seeded utility invoices in es locale, got ${invoicesList.length}`
    );

    const campaignsCtx = createKoaCtx({ query: { locale: 'en' } });
    await donationsCtrl.listCampaigns(campaignsCtx);
    assert.equal(campaignsCtx.status, 200);
    assert.ok(Array.isArray(campaignsCtx.body?.data));

    // 5. Test @vicacha-devs/strapi-plugin-events live controller actions (spotlights & ICS feed)
    const eventsCtrl = pluginControllers.events['content-api'];
    const spotlightsCtx = createKoaCtx({
      query: { date: '2026-02-12T12:00:00.000Z', locale: 'es' },
    });
    await eventsCtrl.listSpotlights(spotlightsCtx);
    assert.equal(spotlightsCtx.status, 200);
    assert.ok(
      Array.isArray(spotlightsCtx.body?.data) &&
        spotlightsCtx.body.data.length >= 2,
      'Expected seeded YTB & Diyanet scholarship spotlights to be returned'
    );

    const icsCtx = createKoaCtx({ query: { locale: 'es' } });
    await eventsCtrl.downloadFeedIcs(icsCtx);
    assert.ok(
      typeof icsCtx.body === 'string' && icsCtx.body.includes('BEGIN:VCALENDAR')
    );

    // 6. Test @vicacha-devs/strapi-plugin-inbox live controller actions
    const inboxCtrl = pluginControllers.inbox.inboxController;
    const alertsCtx = createKoaCtx({ query: { locale: 'es' } });
    await inboxCtrl.getActiveAlerts(alertsCtx);
    assert.equal(alertsCtx.status, 200);

    const formsCtx = createKoaCtx({ query: { locale: 'tr' } });
    await inboxCtrl.listForms(formsCtx);
    assert.equal(formsCtx.status, 200);

    // 7. Test @vicacha-devs/strapi-plugin-broadcasts live controller actions
    const broadcastsCtrl = pluginControllers.broadcasts.broadcastController;
    const channelsCtx = createKoaCtx({ query: { locale: 'es' } });
    await broadcastsCtrl.listPublicChannels(channelsCtx);
    assert.equal(channelsCtx.status, 200);

    // 8. Test @vicacha-devs/strapi-plugin-media-feeds live controller actions
    const mediaCtrl = pluginControllers['media-feeds']['content-api'];
    const episodesCtx = createKoaCtx({ query: { locale: 'es' } });
    await mediaCtrl.listEpisodes(episodesCtx);
    assert.equal(episodesCtx.status, 200);

    const liveStatusCtx = createKoaCtx({ query: { locale: 'es' } });
    await mediaCtrl.getLiveStatus(liveStatusCtx);
    assert.equal(liveStatusCtx.status, 200);

    const rssCtx = createKoaCtx({ query: { locale: 'es' } });
    await mediaCtrl.getRssXml(rssCtx);
    assert.ok(
      typeof rssCtx.body === 'string' && rssCtx.body.includes('<rss')
    );

    // 9. Test @vicacha-devs/strapi-plugin-resources live controller actions
    const resourcesCtrl = pluginControllers.resources.resourcesController;
    const pubsCtx = createKoaCtx({ query: { locale: 'es' } });
    await resourcesCtrl.listPublications(pubsCtx);
    assert.equal(pubsCtx.status, 200);

    const glossaryCtx = createKoaCtx({ query: { locale: 'ar' } });
    await resourcesCtrl.listGlossary(glossaryCtx);
    assert.equal(glossaryCtx.status, 200);

    // 10. Test @vicacha-devs/strapi-plugin-bookings, certificates & calendar live controller actions
    const bookingsCtrl = pluginControllers.bookings['content-api'];
    const resourcesListCtx = createKoaCtx({ query: { locale: 'es' } });
    await bookingsCtrl.listPublicResources(resourcesListCtx);
    assert.equal(resourcesListCtx.status, 200);

    const certsCtrl = pluginControllers.certificates['content-api'];
    const certTemplatesCtx = createKoaCtx({ query: { locale: 'es' } });
    await certsCtrl.listPublicTemplates(certTemplatesCtx);
    assert.equal(certTemplatesCtx.status, 200);

    const calendarCtrl = pluginControllers.calendar['content-api'];
    const calIcsCtx = createKoaCtx({ query: { locale: 'es' } });
    await calendarCtrl.downloadFeedIcs(calIcsCtx);
    assert.ok(
      typeof calIcsCtx.body === 'string' &&
        calIcsCtx.body.includes('BEGIN:VCALENDAR')
    );
  });
});
