import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

/**
 * Copies `src/content-structure/groups.json` into `dist/src/content-structure/groups.json`
 * and ensures all grouped content types are marked visible in Content Manager and
 * Content-Type Builder before invalidating Strapi's native `content-structure` cache.
 */
export function syncContentStructureGroupsFile(strapi: Core.Strapi) {
  try {
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
