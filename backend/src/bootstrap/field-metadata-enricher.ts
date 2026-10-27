import type { Core } from '@strapi/strapi';

const ACRONYM_MAP: Record<string, string> = {
  id: 'ID',
  uid: 'UID',
  url: 'URL',
  urls: 'URLs',
  uri: 'URI',
  seo: 'SEO',
  og: 'OG',
  ui: 'UI',
  cta: 'CTA',
  faq: 'FAQ',
  faqs: 'FAQs',
  cop: 'COP',
  usd: 'USD',
  eur: 'EUR',
  nit: 'NIT',
  dian: 'DIAN',
  pse: 'PSE',
  qr: 'QR',
  iban: 'IBAN',
  swift: 'SWIFT',
  bic: 'BIC',
  rsvp: 'RSVP',
  ics: 'ICS',
  rrule: 'RRULE',
  ip: 'IP',
  html: 'HTML',
  pdf: 'PDF',
  rss: 'RSS',
  xml: 'XML',
  api: 'API',
  iso: 'ISO',
  utc: 'UTC',
  gps: 'GPS',
  cldr: 'CLDR',
  iana: 'IANA',
  smtp: 'SMTP',
  whatsapp: 'WhatsApp',
  youtube: 'YouTube',
  esign: 'eSign',
  hijri: 'Hijri',
  quran: "Qur'an",
  ayah: 'Ayah',
  ayat: 'Ayat',
  surah: 'Surah',
  hadith: 'Hadith',
  dua: "Du'a",
  iqamah: 'Iqamah',
  adhan: 'Adhan',
  jumuah: "Jumu'ah",
  zakat: 'Zakat',
  sadaqah: 'Sadaqah',
  fidyah: 'Fidyah',
  kaffarah: 'Kaffarah',
  waqf: 'Waqf',
  nisab: 'Nisab',
};

export function humanizeFieldLabel(fieldName: string): string {
  const spaced = fieldName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  return spaced
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYM_MAP[lower]) return ACRONYM_MAP[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function buildFieldPlaceholder(
  fieldName: string,
  humanLabel: string,
  attr?: Record<string, any>
): string {
  const lower = fieldName.toLowerCase();
  const type = attr?.type || 'string';
  if (
    type === 'boolean' ||
    type === 'media' ||
    type === 'component' ||
    type === 'dynamiczone' ||
    type === 'relation'
  ) {
    return '';
  }
  if (
    /^(url|website|href|externalpath)$/i.test(fieldName) ||
    /(url|urls|href)$/i.test(fieldName)
  ) {
    return 'https://...';
  }
  if (
    type === 'email' ||
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
    return 'auto-generated-url-slug';
  }
  if (lower.includes('color') || lower.includes('hex')) {
    return '#0F766E';
  }
  if (lower.includes('timezone')) {
    return 'America/Bogota';
  }
  if (fieldName === 'readingTime' || fieldName === 'duration') {
    return 'e.g., 5 min';
  }
  if (
    lower.includes('hijridate') ||
    lower.includes('secondarydate') ||
    fieldName === 'publishedAtLabel'
  ) {
    return 'e.g., 15 Ramadan 1447 AH';
  }
  if (lower.includes('locale') || lower.includes('language') || fieldName === 'langcode') {
    return 'e.g., es, en, ar, tr';
  }
  if (lower.includes('currency')) {
    return 'e.g., COP or USD';
  }
  if (
    fieldName === 'time' ||
    fieldName === 'timeLabel' ||
    fieldName === 'preferredTimeSlot' ||
    fieldName === 'slotLabel'
  ) {
    return 'e.g., 10:00 AM';
  }
  if (type === 'date' || lower.endsWith('date')) {
    return 'YYYY-MM-DD';
  }
  if (type === 'datetime') {
    return 'Select date and time';
  }
  if (type === 'integer' || type === 'biginteger' || type === 'decimal' || type === 'float') {
    return `Enter ${humanLabel.toLowerCase()} (number)`;
  }
  if (type === 'enumeration') {
    return `Select ${humanLabel.toLowerCase()}`;
  }
  if (type === 'json') {
    return '{ "key": "value" }';
  }
  if (type === 'text' || type === 'richtext' || type === 'blocks') {
    return `Write ${humanLabel.toLowerCase()}...`;
  }
  return `Enter ${humanLabel.toLowerCase()}...`;
}

export interface EditLayoutCell {
  name: string;
  size: number;
}

const AUTHOR_LAYOUT_GROUPS: Array<{
  nameField: string;
  relationField: string;
  slugField: string;
}> = [
  { nameField: 'author', relationField: 'authorProfile', slugField: 'authorSlug' },
  { nameField: 'authorName', relationField: 'authorProfile', slugField: 'authorSlug' },
  { nameField: 'speaker', relationField: 'speakerProfile', slugField: 'speakerSlug' },
];

/**
 * Moves `authorProfile` / `speakerProfile` and `authorSlug` / `speakerSlug` up into
 * the same row/section as `author` / `authorName` / `speaker` in Content Manager edit layouts.
 */
export function normalizeAuthorLayoutRows(
  editLayout: EditLayoutCell[][]
): { layout: EditLayoutCell[][]; changed: boolean } {
  if (!Array.isArray(editLayout) || editLayout.length === 0) {
    return { layout: editLayout, changed: false };
  }

  let currentLayout = editLayout;
  let anyChanged = false;

  for (const { nameField, relationField, slugField } of AUTHOR_LAYOUT_GROUPS) {
    const presentFields = new Set<string>();
    for (const row of currentLayout) {
      if (!Array.isArray(row)) continue;
      for (const cell of row) {
        if (cell?.name) presentFields.add(cell.name);
      }
    }

    if (!presentFields.has(nameField)) continue;
    const groupOrder = [relationField, nameField, slugField].filter((f) =>
      presentFields.has(f)
    );
    if (groupOrder.length < 2) continue;

    const cellSize = groupOrder.length === 3 ? 4 : 6;
    const desiredRow: EditLayoutCell[] = groupOrder.map((name) => ({
      name,
      size: cellSize,
    }));
    const groupSet = new Set(groupOrder);

    const existingGroupRows = currentLayout.filter(
      (row) => Array.isArray(row) && row.some((c) => groupSet.has(c?.name))
    );
    const alreadyNormalized =
      existingGroupRows.length === 1 &&
      existingGroupRows[0].length === desiredRow.length &&
      existingGroupRows[0].every(
        (c, idx) => c.name === desiredRow[idx].name && c.size === desiredRow[idx].size
      );

    if (alreadyNormalized) continue;

    const nextLayout: EditLayoutCell[][] = [];
    let inserted = false;

    for (const row of currentLayout) {
      if (!Array.isArray(row)) continue;
      const hasAnchor = row.some((c) => c?.name === nameField);
      const remaining = row.filter((c) => c?.name && !groupSet.has(c.name));

      if (hasAnchor && !inserted) {
        nextLayout.push(desiredRow);
        inserted = true;
        if (remaining.length > 0) {
          nextLayout.push(remaining);
        }
      } else if (remaining.length > 0) {
        nextLayout.push(remaining);
      }
    }

    currentLayout = nextLayout;
    anyChanged = true;
  }

  return { layout: currentLayout, changed: anyChanged };
}

export const READ_ONLY_SLUG_FIELDS = new Set(['authorSlug', 'speakerSlug']);

export async function enrichContentManagerFieldMetadata(strapi: Core.Strapi) {
  try {
    const dbConn = (strapi.db as unknown as {
      connection?: (table: string) => {
        where: (...args: any[]) => any;
      };
    })?.connection;
    if (typeof dbConn !== 'function') return;

    const rows = await (dbConn('strapi_core_store_settings') as any).where(
      'key',
      'like',
      'plugin_content_manager_configuration_%'
    );
    if (!Array.isArray(rows) || rows.length === 0) return;

    const allSchemas: Record<string, any> = {
      ...(strapi.contentTypes || {}),
      ...((strapi as unknown as { components?: Record<string, any> }).components || {}),
    };

    for (const row of rows) {
      if (!row?.value) continue;
      let parsed: Record<string, any>;
      try {
        parsed = JSON.parse(row.value);
      } catch {
        continue;
      }
      if (!parsed?.metadatas || typeof parsed.metadatas !== 'object') continue;

      const uid = row.key
        .replace('plugin_content_manager_configuration_content_types::', '')
        .replace('plugin_content_manager_configuration_components::', '');
      const schemaAttrs = allSchemas[uid]?.attributes || {};

      let changed = false;
      for (const [fieldName, metaObj] of Object.entries(parsed.metadatas)) {
        if (!metaObj || typeof metaObj !== 'object') continue;
        const meta = metaObj as {
          edit?: {
            label?: string;
            placeholder?: string;
            description?: string;
            editable?: boolean;
          };
          list?: { label?: string };
        };
        if (
          fieldName === 'id' ||
          fieldName === 'createdAt' ||
          fieldName === 'updatedAt' ||
          fieldName === 'publishedAt' ||
          fieldName === 'createdBy' ||
          fieldName === 'updatedBy'
        ) {
          continue;
        }
        const humanLabel = humanizeFieldLabel(fieldName);
        const attr = schemaAttrs[fieldName];
        const placeholder = buildFieldPlaceholder(fieldName, humanLabel, attr);

        if (meta.edit) {
          if (meta.edit.label !== humanLabel) {
            meta.edit.label = humanLabel;
            changed = true;
          }
          if (meta.edit.placeholder !== placeholder) {
            meta.edit.placeholder = placeholder;
            changed = true;
          }
          if (READ_ONLY_SLUG_FIELDS.has(fieldName) && meta.edit.editable !== false) {
            meta.edit.editable = false;
            changed = true;
          }
        }
        if (meta.list) {
          if (meta.list.label !== humanLabel) {
            meta.list.label = humanLabel;
            changed = true;
          }
        }
      }

      if (Array.isArray(parsed?.layouts?.edit)) {
        const { layout, changed: layoutChanged } = normalizeAuthorLayoutRows(
          parsed.layouts.edit
        );
        if (layoutChanged) {
          parsed.layouts.edit = layout;
          changed = true;
        }
      }

      if (changed) {
        await (dbConn('strapi_core_store_settings') as any)
          .where({ id: row.id })
          .update({ value: JSON.stringify(parsed) });
      }
    }
  } catch {
    // Resilient fallback if database is not SQLite/Knex in unit test mocks
  }
}

