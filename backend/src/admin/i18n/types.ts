export type SupportedAdminLocale = 'en' | 'es' | 'ar' | 'tr';

export const ADMIN_LOCALES: SupportedAdminLocale[] = ['en', 'es', 'ar', 'tr'];

export type LocalizedLabelMap = Record<SupportedAdminLocale, string>;
