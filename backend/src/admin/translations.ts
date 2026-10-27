import {
  translateFieldLabel,
  translateFieldPlaceholder,
} from './i18n/fieldTranslators';
import { COMPONENT_FIELDS, CONTENT_TYPE_FIELDS } from './i18n/schemaFields';
import type { SupportedAdminLocale } from './i18n/types';

export type { SupportedAdminLocale };
export { translateFieldLabel, translateFieldPlaceholder };

// TODO(upstream-patch-removal) [Patch B3 - @frameless/preview-button & @frameless/strapi-plugin-notes]:
// Remove `THIRD_PARTY_PLUGIN_TRANSLATIONS` once `@frameless/preview-button` and `@frameless/strapi-plugin-notes`
// merge the `es.json`, `ar.json`, and `tr.json` locale PRs (see `/PLUGIN_LOCALIZATION_PR_PROMPT.md`
// and `/PATCHES_AND_UPSTREAM_PR_REPORT.md`).
const THIRD_PARTY_PLUGIN_TRANSLATIONS: Record<
  SupportedAdminLocale,
  Record<string, string>
> = {
  en: {
    'preview-button.panel.title': 'Frontend Live Preview',
    'preview-button.button.pagePreview': 'Open Frontend Preview',
    'preview-button.notification.error': 'Could not load preview configuration',
    'entity-notes.plugin.name': 'Editorial Notes',
    'entity-notes.component.emptyStateLayout': 'No notes yet',
    'entity-notes.component.noteListContent.add.button': 'Add note',
  },
  es: {
    'preview-button.panel.title': 'Vista Previa en el Sitio',
    'preview-button.button.pagePreview': 'Abrir vista previa',
    'preview-button.notification.error':
      'No se pudo cargar la configuración de vista previa',
    'entity-notes.plugin.name': 'Notas Editoriales',
    'entity-notes.component.emptyStateLayout': 'Aún no hay notas',
    'entity-notes.component.noteListContent.add.button': 'Añadir nota',
  },
  ar: {
    'preview-button.panel.title': 'معاينة مباشرة للموقع',
    'preview-button.button.pagePreview': 'فتح المعاينة المباشرة',
    'preview-button.notification.error': 'تعذر تحميل إعدادات المعاينة',
    'entity-notes.plugin.name': 'ملاحظات تحريرية',
    'entity-notes.component.emptyStateLayout': 'لا توجد ملاحظات بعد',
    'entity-notes.component.noteListContent.add.button': 'إضافة ملاحظة',
  },
  tr: {
    'preview-button.panel.title': 'Canlı Site Önizlemesi',
    'preview-button.button.pagePreview': 'Önizlemeyi Aç',
    'preview-button.notification.error': 'Önizleme yapılandırması yüklenemedi',
    'entity-notes.plugin.name': 'Editoryal Notlar',
    'entity-notes.component.emptyStateLayout': 'Henüz not yok',
    'entity-notes.component.noteListContent.add.button': 'Not ekle',
  },
};

export function buildAdminTranslationsForLocale(
  locale: SupportedAdminLocale
): Record<string, string> {
  const dict: Record<string, string> = {
    ...(THIRD_PARTY_PLUGIN_TRANSLATIONS[locale] || {}),
  };

  for (const [compUid, fields] of Object.entries(COMPONENT_FIELDS)) {
    for (const field of fields) {
      const label = translateFieldLabel(field, locale);
      const placeholder = translateFieldPlaceholder(field, label, locale);
      dict[`content-manager.components.${compUid}.${field}`] = label;
      dict[`content-manager.components.${compUid}.${field}.placeholder`] =
        placeholder;
    }
  }

  for (const [ctUid, fields] of Object.entries(CONTENT_TYPE_FIELDS)) {
    for (const field of fields) {
      const label = translateFieldLabel(field, locale);
      const placeholder = translateFieldPlaceholder(field, label, locale);
      dict[`content-manager.content-types.${ctUid}.${field}`] = label;
      dict[`content-manager.content-types.${ctUid}.${field}.placeholder`] =
        placeholder;
    }
  }

  return dict;
}

export const ALL_ADMIN_TRANSLATIONS: Record<
  SupportedAdminLocale,
  Record<string, string>
> = {
  en: buildAdminTranslationsForLocale('en'),
  es: buildAdminTranslationsForLocale('es'),
  ar: buildAdminTranslationsForLocale('ar'),
  tr: buildAdminTranslationsForLocale('tr'),
};
