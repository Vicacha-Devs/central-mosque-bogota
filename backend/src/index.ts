import type { Core } from '@strapi/strapi';
import {
  backfillAuthorProfilesAndSlugs,
  registerAuthorProfileLifecycles,
} from './bootstrap/author-profile-lifecycles';
import {
  patchAndSeedContentManagerOrganizer,
  syncContentStructureGroupsFile,
} from './bootstrap/content-manager-organizer';
import { registerPluginEmailLifecycles } from './bootstrap/email-lifecycles';
import { enrichContentManagerFieldMetadata } from './bootstrap/field-metadata-enricher';
import {
  ensureLocales,
  ensurePublicPermissions,
} from './bootstrap/permissions-and-locales';
import { patchContentManagerAndPreviewLocalization } from './bootstrap/plugin-patches';
import { seedEmailDesignerTemplates } from './seed/email-templates-seed';
import { seedInitialContent } from './seed/initial-content-seed';
import { seedMediaLibraryFolders } from './seed/media-folders-seed';
import { seedNavigationPluginConfig } from './seed/navigation-seed';
import { seedSitemapPluginConfig } from './seed/sitemap-seed';
import { seedTiptapEditorConfig } from './seed/tiptap-seed';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    syncContentStructureGroupsFile(strapi);
    patchContentManagerAndPreviewLocalization(strapi);
    void patchAndSeedContentManagerOrganizer(strapi, false);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    syncContentStructureGroupsFile(strapi);
    await seedTiptapEditorConfig(strapi);
    patchContentManagerAndPreviewLocalization(strapi);
    await patchAndSeedContentManagerOrganizer(strapi, true);
    registerAuthorProfileLifecycles(strapi);
    registerPluginEmailLifecycles(strapi);
    await ensureLocales(strapi);
    await ensurePublicPermissions(strapi);
    await seedMediaLibraryFolders(strapi);
    await seedInitialContent(strapi);
    await backfillAuthorProfilesAndSlugs(strapi);
    await seedNavigationPluginConfig(strapi);
    await seedSitemapPluginConfig(strapi);
    await seedEmailDesignerTemplates(strapi);
    await enrichContentManagerFieldMetadata(strapi);
  },
};
