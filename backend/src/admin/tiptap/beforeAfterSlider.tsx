import React, { useState } from 'react';
import {
  Node,
  mergeAttributes,
  registerTiptapExtension,
  MediaLibraryWrapper,
  type CustomExtensionDialogProps,
  type StrapiFile,
} from '@notum-cz/strapi-plugin-tiptap-editor/strapi-admin';

const DEFAULT_BEFORE_ALT = 'Before';
const DEFAULT_AFTER_ALT = 'After';

const SAFE_URL_PATTERN = /^(https?:\/\/|\/(?![/\\]))/i;

const sanitizeMediaUrl = (raw: unknown): string => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  return SAFE_URL_PATTERN.test(trimmed) ? trimmed : '';
};

const BeforeAfterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <polyline points="8 9 5 12 8 15" />
    <polyline points="16 9 19 12 16 15" />
  </svg>
);

export const BeforeAfterNode = Node.create({
  name: 'beforeAfterSlider',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      beforeUrl: { default: '' },
      afterUrl: { default: '' },
      beforeAlt: { default: DEFAULT_BEFORE_ALT },
      afterAlt: { default: DEFAULT_AFTER_ALT },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-before-after]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          const imgs = el.querySelectorAll('img');
          const figcap = el.querySelector('figcaption');
          return {
            beforeUrl: sanitizeMediaUrl(
              el.getAttribute('data-before-url') || imgs[0]?.getAttribute('src')
            ),
            afterUrl: sanitizeMediaUrl(
              el.getAttribute('data-after-url') || imgs[1]?.getAttribute('src')
            ),
            beforeAlt:
              el.getAttribute('data-before-alt') || imgs[0]?.getAttribute('alt') || DEFAULT_BEFORE_ALT,
            afterAlt:
              el.getAttribute('data-after-alt') || imgs[1]?.getAttribute('alt') || DEFAULT_AFTER_ALT,
            caption: el.getAttribute('data-caption') || figcap?.textContent || '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const beforeUrl = sanitizeMediaUrl(HTMLAttributes.beforeUrl);
    const afterUrl = sanitizeMediaUrl(HTMLAttributes.afterUrl);
    const beforeAlt = String(HTMLAttributes.beforeAlt || DEFAULT_BEFORE_ALT);
    const afterAlt = String(HTMLAttributes.afterAlt || DEFAULT_AFTER_ALT);
    const caption = String(HTMLAttributes.caption || '');

    return [
      'figure',
      mergeAttributes({
        'data-tiptap-type': 'beforeAfterSlider',
        'data-before-after': 'true',
        'data-before-url': beforeUrl,
        'data-after-url': afterUrl,
        'data-before-alt': beforeAlt,
        'data-after-alt': afterAlt,
        'data-caption': caption,
        class: 'before-after-slider',
      }),
      ['img', { src: beforeUrl, alt: beforeAlt }],
      ['img', { src: afterUrl, alt: afterAlt }],
      ['figcaption', {}, caption],
    ];
  },
});

export function BeforeAfterDialog({ editor, open, onClose }: CustomExtensionDialogProps) {
  const [step, setStep] = useState<'before' | 'after'>('before');
  const [beforeAsset, setBeforeAsset] = useState<{ url: string; alt: string; caption: string }>({
    url: '',
    alt: DEFAULT_BEFORE_ALT,
    caption: '',
  });

  if (!open || !editor) return null;

  const handleClose = () => {
    setStep('before');
    onClose();
  };

  const handleSelectAssets = (files: StrapiFile[]) => {
    const file = files[0];
    if (!file) return;

    if (step === 'before') {
      setBeforeAsset({
        url: file.url,
        alt: file.alternativeText || file.name || DEFAULT_BEFORE_ALT,
        caption: file.caption || '',
      });
      setStep('after');
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'beforeAfterSlider',
          attrs: {
            beforeUrl: beforeAsset.url,
            afterUrl: file.url,
            beforeAlt: beforeAsset.alt,
            afterAlt: file.alternativeText || file.name || DEFAULT_AFTER_ALT,
            caption: file.caption || beforeAsset.caption || '',
          },
        })
        .run();
      setStep('before');
      onClose();
    }
  };

  return (
    <MediaLibraryWrapper
      allowedTypes={['images']}
      onClose={handleClose}
      onSelectAssets={handleSelectAssets}
    />
  );
}

export function registerBeforeAfterSliderExtension(): () => void {
  return registerTiptapExtension({
    id: 'beforeAfterSlider',
    label: 'Before / After Image Slider',
    extensions: [BeforeAfterNode],
    toolbarButton: {
      label: 'Before / After Slider',
      tooltip: 'Insert Before / After Image Comparison Slider',
      icon: <BeforeAfterIcon />,
      onClick: (_editor, { openDialog }) => openDialog(),
    },
    DialogComponent: BeforeAfterDialog,
    overflowOnly: true,
    slashCommands: [
      {
        id: 'beforeAfterSlider',
        defaultLabel: 'Before / After Image Slider',
        defaultDescription: 'Compare two images from the Media Library with caption support',
        badge: 'B/A',
        keywords: ['before', 'after', 'compare', 'slider', 'image', 'antes', 'despues'],
        openExtensionDialogId: 'beforeAfterSlider',
      },
    ],
  });
}
