import { ENUM_VALUE_LABELS } from './i18n/fieldDictionaries';
import {
  translateEnumValue,
  translateFieldLabel,
  translateFieldPlaceholder,
} from './i18n/fieldTranslators';
import { COMPONENT_FIELDS, CONTENT_TYPE_FIELDS } from './i18n/schemaFields';
import type { SupportedAdminLocale } from './i18n/types';

export type { SupportedAdminLocale };
export { translateEnumValue, translateFieldLabel, translateFieldPlaceholder };

// Arabic (`ar`) translations for `strapi-plugin-preview-button` (which natively ships `en`, `es`, `fr`, `ja`, `ru`, `tr`).
const PREVIEW_BUTTON_AR_TRANSLATIONS: Partial<
  Record<SupportedAdminLocale, Record<string, string>>
> = {
  ar: {
    'preview-button.form.button.draft': 'فتح معاينة المسودة',
    'preview-button.form.button.published': 'فتح العرض المباشر',
    'preview-button.form.button.copy-link': 'نسخ الرابط',
    'preview-button.form.button.copy-link.draft': 'نسخ رابط المعاينة',
    'preview-button.list-view.column-header': 'معاينة',
    'preview-button.notification.success.link-copied':
      'تم نسخ الرابط إلى الحافظة',
  },
};

export function buildAdminTranslationsForLocale(
  locale: SupportedAdminLocale
): Record<string, string> {
  const dict: Record<string, string> = {
    ...(PREVIEW_BUTTON_AR_TRANSLATIONS[locale] || {}),
  };

  for (const [enumKey, localizedMap] of Object.entries(ENUM_VALUE_LABELS)) {
    const label = localizedMap[locale] || translateEnumValue(enumKey, locale);
    dict[enumKey] = label;
    dict[`content-manager.enum.${enumKey}`] = label;
  }

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
