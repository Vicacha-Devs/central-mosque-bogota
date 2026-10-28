import { EXACT_FIELD_LABELS, WORD_DICTIONARY } from './fieldDictionaries';
import type { SupportedAdminLocale } from './types';

function splitFieldWords(fieldName: string): string[] {
  return fieldName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function translateFieldLabel(
  fieldName: string,
  locale: SupportedAdminLocale
): string {
  if (EXACT_FIELD_LABELS[fieldName]?.[locale]) {
    return EXACT_FIELD_LABELS[fieldName][locale];
  }
  const words = splitFieldWords(fieldName);
  const translated = words
    .map((w) => {
      const lower = w.toLowerCase();
      if (WORD_DICTIONARY[lower]) {
        return WORD_DICTIONARY[lower][locale];
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .filter(Boolean);
  return translated.join(' ') || fieldName;
}

export function translateFieldPlaceholder(
  fieldName: string,
  label: string,
  locale: SupportedAdminLocale
): string {
  const lower = fieldName.toLowerCase();
  if (
    /^(url|website|href|externalpath)$/i.test(fieldName) ||
    /(url|urls|href)$/i.test(fieldName)
  ) {
    return 'https://...';
  }
  if (
    /^(email|contactemail|recipientemail|customeremail|applicantemail|attendeeemail|donoremail)$/i.test(
      fieldName
    )
  ) {
    return 'info@mezquitabogota.org';
  }
  if (
    /^(phone|whatsapp|telephone|mobile)$/i.test(fieldName) ||
    /(phone|whatsapp)$/i.test(fieldName)
  ) {
    return '+57 310 555 0199';
  }
  if (lower.includes('slug')) {
    return locale === 'es'
      ? 'slug-generado-automaticamente'
      : locale === 'ar'
        ? 'معرف-الرابط-التلقائي'
        : locale === 'tr'
          ? 'otomatik-url-kisa-adi'
          : 'auto-generated-url-slug';
  }
  if (lower.includes('color') || lower.includes('hex')) {
    return '#0F766E';
  }
  if (lower.includes('timezone')) {
    return 'America/Bogota';
  }
  if (fieldName === 'readingTime' || fieldName === 'duration') {
    return locale === 'es'
      ? 'ej., 5 min'
      : locale === 'ar'
        ? 'مثال: 5 دقائق'
        : locale === 'tr'
          ? 'örn., 5 dk'
          : 'e.g., 5 min';
  }
  if (
    lower.includes('hijridate') ||
    lower.includes('secondarydate') ||
    fieldName === 'publishedAtLabel'
  ) {
    return locale === 'es'
      ? 'ej., 15 Ramadán 1447 AH'
      : locale === 'ar'
        ? 'مثال: ١٥ رمضان ١٤٤٧ هـ'
        : locale === 'tr'
          ? 'örn., 15 Ramazan 1447 H'
          : 'e.g., 15 Ramadan 1447 AH';
  }
  if (
    lower.includes('locale') ||
    lower.includes('language') ||
    fieldName === 'langcode'
  ) {
    return locale === 'es'
      ? 'ej., es, en, ar, tr'
      : locale === 'ar'
        ? 'مثال: es, en, ar, tr'
        : locale === 'tr'
          ? 'örn., es, en, ar, tr'
          : 'e.g., es, en, ar, tr';
  }
  if (lower.includes('currency')) {
    return locale === 'es'
      ? 'ej., COP o USD'
      : locale === 'ar'
        ? 'مثال: COP أو USD'
        : locale === 'tr'
          ? 'örn., COP veya USD'
          : 'e.g., COP or USD';
  }
  if (
    fieldName === 'time' ||
    fieldName === 'timeLabel' ||
    fieldName === 'preferredTimeSlot' ||
    fieldName === 'slotLabel'
  ) {
    return locale === 'es'
      ? 'ej., 10:00 AM'
      : locale === 'ar'
        ? 'مثال: 10:00 صباحاً'
        : locale === 'tr'
          ? 'örn., 10:00'
          : 'e.g., 10:00 AM';
  }
  if (lower.endsWith('date')) {
    return 'YYYY-MM-DD';
  }
  if (locale === 'es') {
    return `Ingresa ${label.toLowerCase()}...`;
  }
  if (locale === 'ar') {
    return `أدخل ${label}...`;
  }
  if (locale === 'tr') {
    return `${label} girin...`;
  }
  return `Enter ${label.toLowerCase()}...`;
}
