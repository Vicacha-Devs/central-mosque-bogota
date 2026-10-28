import type { Core } from '@strapi/strapi';

export const DEFAULT_MOSQUE_CMO_CONFIG = {
  stripNumericPrefix: true,
  sortBy: 'custom' as const,
  groups: [
    {
      id: 'editorial-community',
      label: 'Editorial & Community',
      defaultExpanded: true,
      kind: 'collectionType' as const,
      items: ['article', 'community-service', 'leader', 'faq'],
    },
    {
      id: 'events-scheduling-bookings',
      label: 'Events, Scheduling & Bookings',
      defaultExpanded: true,
      kind: 'collectionType' as const,
      items: ['event', 'registration', 'resource', 'booking'],
    },
    {
      id: 'islam-liturgy-scripture',
      label: 'Islam, Liturgy & Scripture',
      defaultExpanded: true,
      kind: 'collectionType' as const,
      items: ['scripture-entry', 'hilal-announcement'],
    },
    {
      id: 'donations-certificates',
      label: 'Donations & Certificates',
      defaultExpanded: true,
      kind: 'collectionType' as const,
      items: ['campaign', 'pledge', 'template', 'certificate'],
    },
    {
      id: 'media-resources-publications',
      label: 'Media, Resources & Library',
      defaultExpanded: true,
      kind: 'collectionType' as const,
      items: [
        'media-item',
        'media-series',
        'publication',
        'gallery-album',
        'glossary-term',
      ],
    },
    {
      id: 'inbox-broadcasts-communications',
      label: 'Inbox & Omnichannel Broadcasts',
      defaultExpanded: false,
      kind: 'collectionType' as const,
      items: [
        'form',
        'submission',
        'subscriber',
        'alert-banner',
        'broadcasts.campaign',
        'automation-rule',
        'delivery-log',
      ],
    },
    {
      id: 'public-website-pages',
      label: 'Public Website Pages',
      defaultExpanded: true,
      kind: 'singleType' as const,
      items: [
        'about-page',
        'islam-faith-page',
        'donations-page',
        'contact-page',
      ],
    },
    {
      id: 'global-configuration-broadcasts',
      label: 'Global Configuration',
      defaultExpanded: true,
      kind: 'singleType' as const,
      items: ['global-setting'],
    },
  ],
};

export const HIDDEN_CMO_PLUGIN_PREFIXES = new Set([
  'upload',
  'i18n',
  'content-releases',
  'review-workflows',
  'email-designer-5',
  'navigation',
  'publisher',
  'notes',
  'content-manager-organizer',
  'seo',
  'cloud',
  'strapi-5-sitemap-plugin',
]);

/**
 * TODO(upstream-patch-removal) [Patch C1 - strapi-plugin-content-manager-organizer]:
 * Remove the `contentTypesSvc.getContentTypes` override once `strapi-plugin-content-manager-organizer`:
 * 1. Respects `schema.pluginOptions['content-manager'].visible === false` and excludes internal system plugin prefixes.
 * 2. Keys group items by full content-type `uid` (or `<plugin>.<singularName>`) so content types from different
 *    plugins sharing the same `singularName` (e.g., `plugin::donations.campaign` vs `plugin::broadcasts.campaign`)
 *    do not collide.
 * See `/PATCHES_AND_UPSTREAM_PR_REPORT.md` for the issue text and PR prompt.
 */
export async function patchAndSeedContentManagerOrganizer(
  strapi: Core.Strapi,
  seedDb = false
) {
  try {
    const cmoPlugin = strapi.plugin('content-manager-organizer') as unknown as {
      service?: (name: string) => Record<string, any> | undefined;
    };
    const contentTypesSvc = cmoPlugin?.service?.('contentTypes');
    if (contentTypesSvc && typeof contentTypesSvc === 'object') {
      contentTypesSvc.getContentTypes = () => {
        return Object.entries(strapi.contentTypes || {})
          .filter(([uid, schema]: [string, any]) => {
            if (!schema || (schema.kind !== 'collectionType' && schema.kind !== 'singleType')) {
              return false;
            }
            if (uid.startsWith('api::')) return true;
            if (!uid.startsWith('plugin::')) return false;
            if (
              uid === 'plugin::users-permissions.permission' ||
              uid === 'plugin::users-permissions.role'
            ) {
              return false;
            }
            const pluginPrefix = uid.replace('plugin::', '').split('.')[0];
            if (HIDDEN_CMO_PLUGIN_PREFIXES.has(pluginPrefix)) {
              return false;
            }
            const pluginOpts =
              schema?.__schema__?.pluginOptions ?? schema?.pluginOptions ?? {};
            if (pluginOpts?.['content-manager']?.visible === false) {
              return false;
            }
            return true;
          })
          .map(([uid, schema]: [string, any]) => {
            const rawSingular =
              schema.info?.singularName ||
              uid.match(/(?:api|plugin)::[^.]+\.([^/&#?]+)/)?.[1] ||
              uid;
            const singularName =
              uid === 'plugin::broadcasts.campaign'
                ? 'broadcasts.campaign'
                : rawSingular;
            const displayName = schema.info?.displayName || singularName;
            const cleanDisplayName = String(displayName).replace(/^\d{1,3}\s+/, '');
            return {
              uid,
              singularName,
              displayName,
              cleanDisplayName,
              kind: schema.kind as 'collectionType' | 'singleType',
            };
          })
          .sort((a, b) => a.cleanDisplayName.localeCompare(b.cleanDisplayName));
      };
    }

    const configSvc = cmoPlugin?.service?.('config');
    if (configSvc && typeof configSvc === 'object' && !configSvc.__mosquePatched) {
      const origGetConfig = configSvc.getConfig?.bind(configSvc);
      const origSaveConfig = configSvc.saveConfig?.bind(configSvc);
      configSvc.getConfig = async () => {
        const current = origGetConfig ? await origGetConfig() : null;
        if (!current || !Array.isArray(current.groups) || current.groups.length === 0) {
          if (origSaveConfig) {
            return await origSaveConfig(DEFAULT_MOSQUE_CMO_CONFIG);
          }
          return DEFAULT_MOSQUE_CMO_CONFIG;
        }
        return current;
      };
      configSvc.__mosquePatched = true;
    }

    if (seedDb && strapi.db?.query) {
      const uid = 'plugin::content-manager-organizer.content-manager-configuration';
      const query = strapi.db.query(uid);
      if (query) {
        const existing = await query.findOne({ where: { key: 'main' } });
        const existingGroups = Array.isArray((existing?.config as Record<string, unknown>)?.groups)
          ? ((existing.config as Record<string, unknown>).groups as Array<{ items?: string[] }>)
          : [];
        const hasOutdatedItemNames = existingGroups.some((g) =>
          (g.items || []).includes('iqamah-schedule') ||
          (g.items || []).includes('certificate-template')
        );
        if (!existing) {
          await query.create({
            data: {
              key: 'main',
              config: DEFAULT_MOSQUE_CMO_CONFIG,
            },
          });
        } else if (
          (existingGroups.length === 0 || hasOutdatedItemNames) &&
          (query as unknown as { update?: Function }).update
        ) {
          await (query as unknown as { update: Function }).update({
            where: { id: existing.id },
            data: { config: DEFAULT_MOSQUE_CMO_CONFIG },
          });
        }
      }
    }
  } catch {
    // Resilient fallback if content-manager-organizer is not mounted in unit test mocks
  }
}

export function syncContentStructureGroupsFile(strapi: Core.Strapi) {
  try {
    const fs = require('node:fs') as typeof import('node:fs');
    const path = require('node:path') as typeof import('node:path');
    const dirs = (strapi as unknown as {
      dirs?: { app?: { src?: string }; dist?: { src?: string } };
    }).dirs;
    const appSrc = dirs?.app?.src || path.resolve(process.cwd(), 'src');
    const distSrc = dirs?.dist?.src || path.resolve(process.cwd(), 'dist/src');
    const srcFile = path.join(appSrc, 'content-structure', 'groups.json');
    const dstDir = path.join(distSrc, 'content-structure');
    const dstFile = path.join(dstDir, 'groups.json');
    if (fs.existsSync(srcFile)) {
      fs.mkdirSync(dstDir, { recursive: true });
      fs.copyFileSync(srcFile, dstFile);
      try {
        const parsed = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
        const allGroups = [
          ...(parsed?.sections?.collectionTypes?.groups || []),
          ...(parsed?.sections?.singleTypes?.groups || []),
        ];
        for (const group of allGroups) {
          for (const child of group?.children || []) {
            if (child?.type === 'contentType' && child?.uid) {
              const ct = (strapi.contentTypes as Record<string, any> | undefined)?.[child.uid];
              if (ct) {
                ct.pluginOptions = {
                  ...(ct.pluginOptions || {}),
                  'content-manager': {
                    ...(ct.pluginOptions?.['content-manager'] || {}),
                    visible: true,
                  },
                  'content-type-builder': {
                    ...(ct.pluginOptions?.['content-type-builder'] || {}),
                    visible: true,
                  },
                };
                if (ct.__schema__) {
                  ct.__schema__.pluginOptions = {
                    ...(ct.__schema__.pluginOptions || {}),
                    'content-manager': {
                      ...(ct.__schema__.pluginOptions?.['content-manager'] || {}),
                      visible: true,
                    },
                    'content-type-builder': {
                      ...(ct.__schema__.pluginOptions?.['content-type-builder'] || {}),
                      visible: true,
                    },
                  };
                }
              }
            }
          }
        }
      } catch {
        // Ignore JSON parse fallback
      }
      const cs = (strapi as unknown as {
        get?: (name: string) => { invalidate?: () => void } | undefined;
      }).get?.('content-structure');
      cs?.invalidate?.();
    }
  } catch {
    // Resilient fallback in test mocks
  }
}
