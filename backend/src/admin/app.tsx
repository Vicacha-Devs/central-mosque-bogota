import type { StrapiApp } from '@strapi/strapi/admin';
import { AuthorProfileFormSync } from './i18n/authorFieldSync';
import { registerBeforeAfterSliderExtension } from './tiptap/beforeAfterSlider';
import { ALL_ADMIN_TRANSLATIONS } from './translations';

(globalThis as any).__CM_I18N_MESSAGES__ = ALL_ADMIN_TRANSLATIONS;

export default {
  config: {
    locales: ['es', 'en', 'ar', 'tr'],
    translations: ALL_ADMIN_TRANSLATIONS,
  },
  register() {
    (globalThis as any).__CM_I18N_MESSAGES__ = ALL_ADMIN_TRANSLATIONS;
    registerBeforeAfterSliderExtension();
  },
  bootstrap(app: StrapiApp) {
    const appTrads = (app as any)?.configurations?.translations || {};
    const merged: Record<string, Record<string, string>> = {};
    for (const loc of ['en', 'es', 'ar', 'tr'] as const) {
      merged[loc] = {
        ...(appTrads[loc] || {}),
        ...(ALL_ADMIN_TRANSLATIONS[loc] || {}),
      };
    }
    (globalThis as any).__CM_I18N_MESSAGES__ = merged;

    try {
      app
        .getPlugin('content-manager')
        .injectComponent('editView', 'right-links', {
          name: 'author-profile-form-sync',
          Component: AuthorProfileFormSync,
        });
    } catch {
      // Ignore if content-manager plugin injection zone is unavailable
    }
  },
};


