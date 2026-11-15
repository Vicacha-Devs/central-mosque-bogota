import * as React from 'react';
import { useForm } from '@strapi/admin/strapi-admin';

const KNOWN_ARABIC_AND_HONORIFIC_SLUGS: Record<string, string> = {
  'dr-amina-gomez': 'dra-amina-gomez',
  'dra-amina-gomez': 'dra-amina-gomez',
  'د-امينة-غوميز': 'dra-amina-gomez',
  'د-أمينة-غوميز': 'dra-amina-gomez',
  'sheikh-ahmad-al-mansoor': 'sheikh-ahmad-al-mansoor',
  'seyh-ahmed-el-mansur': 'sheikh-ahmad-al-mansoor',
  'الشيخ-أحمد-المنصور': 'sheikh-ahmad-al-mansoor',
  'الشيخ-احمد-المنصور': 'sheikh-ahmad-al-mansoor',
  'ustadh-tariq-ramirez': 'ustadh-tariq-ramirez',
  'ustad-tarik-ramirez': 'ustadh-tariq-ramirez',
  'الأستاذ-طارق-راميريز': 'ustadh-tariq-ramirez',
  'الاستاذ-طارق-راميريز': 'ustadh-tariq-ramirez',
  'hajj-ibrahim-al-khatib': 'hajj-ibrahim-al-khatib',
  'haci-ibrahim-el-hatib': 'hajj-ibrahim-al-khatib',
  'الحاج-إبراهيم-الخطيب': 'hajj-ibrahim-al-khatib',
  'الحاج-ابراهيم-الخطيب': 'hajj-ibrahim-al-khatib',
};

export function resolveAuthorSlugFromName(name: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return '';

  const arabicKey = trimmed.replace(/[.\s]+/g, '-').replace(/^-+|-+$/g, '');
  if (KNOWN_ARABIC_AND_HONORIFIC_SLUGS[arabicKey]) {
    return KNOWN_ARABIC_AND_HONORIFIC_SLUGS[arabicKey];
  }

  const asciiSlug = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (KNOWN_ARABIC_AND_HONORIFIC_SLUGS[asciiSlug]) {
    return KNOWN_ARABIC_AND_HONORIFIC_SLUGS[asciiSlug];
  }
  return asciiSlug;
}

const AUTHOR_FIELD_GROUPS = [
  {
    relationField: 'authorProfile',
    nameField: 'author',
    slugField: 'authorSlug',
  },
  {
    relationField: 'authorProfile',
    nameField: 'authorName',
    slugField: 'authorSlug',
  },
  {
    relationField: 'speakerProfile',
    nameField: 'speaker',
    slugField: 'speakerSlug',
  },
] as const;

/**
 * Zero-UI listener injected into Content Manager's EditView `<Form>` context.
 * Automatically updates `Author` (`author` / `authorName` / `speaker`) and
 * read-only `Author Slug` (`authorSlug` / `speakerSlug`) whenever the editor
 * selects an `Author Profile` / `Speaker Profile` relation or edits the `Author` field.
 */
export const AuthorProfileFormSync: React.FC = () => {
  const values = useForm(
    'AuthorProfileFormSync',
    (state) => state.values as Record<string, any>,
    false
  );
  const onChange = useForm(
    'AuthorProfileFormSync',
    (state) => state.onChange,
    false
  );

  const lastConnectedKeyRef = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    if (!values || typeof onChange !== 'function') return;

    for (const { relationField, nameField, slugField } of AUTHOR_FIELD_GROUPS) {
      if (!(nameField in values) && !(slugField in values) && !(relationField in values)) {
        continue;
      }

      const relObj = values[relationField];
      const connectList = Array.isArray(relObj?.connect) ? relObj.connect : [];
      const latestConnected =
        connectList.length > 0 ? connectList[connectList.length - 1] : null;

      if (latestConnected) {
        const connectedId = String(
          latestConnected.documentId ||
            latestConnected?.apiData?.documentId ||
            latestConnected.id ||
            latestConnected.label ||
            latestConnected.name ||
            ''
        );
        const profileName = String(
          latestConnected.name || latestConnected.label || ''
        ).trim();
        const profileSlug = resolveAuthorSlugFromName(profileName);

        const prevConnectedId = lastConnectedKeyRef.current[relationField];
        if (connectedId && connectedId !== prevConnectedId) {
          lastConnectedKeyRef.current[relationField] = connectedId;
          if (profileName && values[nameField] !== profileName) {
            onChange(nameField, profileName);
          }
          if (profileSlug && values[slugField] !== profileSlug) {
            onChange(slugField, profileSlug);
          }
          continue;
        }
      } else {
        lastConnectedKeyRef.current[relationField] = '';
      }

      // Also keep read-only slugField synchronized with nameField whenever nameField changes or slugField is empty
      const currentName =
        typeof values[nameField] === 'string' ? values[nameField].trim() : '';
      if (currentName) {
        const expectedSlug = resolveAuthorSlugFromName(currentName);
        if (expectedSlug && values[slugField] !== expectedSlug) {
          onChange(slugField, expectedSlug);
        }
      }
    }
  }, [values, onChange]);

  return null;
};
