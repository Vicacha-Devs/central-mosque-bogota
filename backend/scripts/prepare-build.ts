import { syncContentStructureGroupsFile } from '../src/bootstrap/content-manager-organizer';
import { patchContentManagerAndPreviewLocalization } from '../src/bootstrap/plugin-patches';

/**
 * Pre-build hook executed before `strapi build` so dist-level Strapi/plugin patches
 * and `content-structure/groups.json` are baked into the compiled admin bundle and `dist/`,
 * allowing the production container (`USER node`) to run with read-only `node_modules` and `dist/`.
 */
const noopStrapi = {
  log: {
    info: (msg: string) => console.info(msg),
    warn: (msg: string) => console.warn(msg),
    error: (msg: string) => console.error(msg),
  },
} as never;

patchContentManagerAndPreviewLocalization(noopStrapi);
syncContentStructureGroupsFile(noopStrapi);
