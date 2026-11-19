import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

export interface MediaFolderNodeDefinition {
  name: string;
  children?: string[];
}

export const MEDIA_LIBRARY_FOLDER_TREE: MediaFolderNodeDefinition[] = [
  {
    name: '01 - Editorial & Community',
    children: [
      'Articles & News',
      'Community Services',
      'Leadership & Imams',
    ],
  },
  {
    name: '02 - Events & Bookings',
    children: [
      'Classes & Courses',
      'Conferences & Seminars',
      'Ramadan & Eid',
      'Youth & Family',
      'Facilities & Spaces',
    ],
  },
  {
    name: '03 - Khutbahs & Media Feeds',
    children: [
      'Jumuah Khutbahs',
      'Spiritual Podcasts',
      'Video Lectures',
      'Series Covers',
    ],
  },
  {
    name: '04 - Library & Resources',
    children: [
      'Publications & Books',
      'Publication Covers',
      'Photo Galleries',
      'Glossary Audio',
    ],
  },
  {
    name: '05 - Donations & Certificates',
    children: [
      'Campaign Banners',
      'Payment & QR Codes',
      'Certificate Templates',
    ],
  },
  {
    name: '06 - Pages, Branding & SEO',
    children: [
      'Brand & Logos',
      'About & Mosque Timeline',
      'SEO & Social Cards',
    ],
  },
];

interface SeedAssetDefinition {
  fileName: string;
  hash: string;
  folderKey: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  sourceRelativePath?: string;
  svgContent?: string;
}

const INITIAL_MEDIA_ASSETS: SeedAssetDefinition[] = [
  {
    fileName: 'diyanet-scholarship-poster.svg',
    hash: 'diyanet_scholarship_poster_seed',
    folderKey: '02 - Events & Bookings/Conferences & Seminars',
    alternativeText: 'TDV Diyanet Bursları — Becas de Teología y Estudios Islámicos en Turquía',
    caption: 'Póster oficial de la convocatoria anual Diyanet Bursları (TDV)',
    width: 800,
    height: 1120,
    sourceRelativePath: '../frontend/public/images/events/diyanet-scholarship-poster.svg',
  },
  {
    fileName: 'ytb-scholarship-poster.svg',
    hash: 'ytb_scholarship_poster_seed',
    folderKey: '02 - Events & Bookings/Conferences & Seminars',
    alternativeText: 'Türkiye Bursları (YTB) — Becas Universitarias y de Posgrado en Turquía',
    caption: 'Póster informativo de orientación para becas YTB en la Mezquita Central de Bogotá',
    width: 800,
    height: 1120,
    sourceRelativePath: '../frontend/public/images/events/ytb-scholarship-poster.svg',
  },
  {
    fileName: 'mosque-official-emblem.svg',
    hash: 'mosque_official_emblem_seed',
    folderKey: '06 - Pages, Branding & SEO/Brand & Logos',
    alternativeText: 'Emblema Oficial de la Mezquita Central Abu Bakr As-Siddiq de Bogotá',
    caption: 'Logotipo e identidad visual oficial de la Mezquita Central de Bogotá',
    width: 512,
    height: 512,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Mezquita Central Abu Bakr As-Siddiq Bogotá">
  <defs>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fde68a" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#emeraldGrad)" />
  <circle cx="256" cy="224" r="136" fill="#ffffff" fill-opacity="0.08" stroke="url(#goldGrad)" stroke-width="6" />
  <path d="M176 268 C176 188 256 144 256 144 C256 144 336 188 336 268 Z" fill="url(#goldGrad)" />
  <rect x="160" y="276" width="192" height="18" rx="9" fill="#ffffff" />
  <rect x="136" y="132" width="18" height="162" rx="9" fill="#fde68a" />
  <rect x="358" y="132" width="18" height="162" rx="9" fill="#fde68a" />
  <text x="256" y="388" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="800" letter-spacing="2">MEZQUITA CENTRAL</text>
  <text x="256" y="426" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-size="20" font-weight="700" letter-spacing="1.5">ABU BAKR AS-SIDDIQ • BOGOTÁ</text>
</svg>`,
  },
  {
    fileName: 'mosque-opengraph-card.svg',
    hash: 'mosque_opengraph_card_seed',
    folderKey: '06 - Pages, Branding & SEO/SEO & Social Cards',
    alternativeText: 'Mezquita Central Abu Bakr As-Siddiq Bogotá — Tarjeta Social OpenGraph',
    caption: 'Imagen predeterminada para compartir en redes sociales (OpenGraph 1200×630)',
    width: 1200,
    height: 630,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Mezquita Central Abu Bakr As-Siddiq Bogotá">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042f2e" />
      <stop offset="50%" stop-color="#065f46" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogBg)" />
  <circle cx="1020" cy="315" r="240" fill="#ffffff" fill-opacity="0.05" />
  <rect x="80" y="80" width="1040" height="470" rx="28" fill="#ffffff" fill-opacity="0.06" stroke="#fde68a" stroke-opacity="0.35" stroke-width="2" />
  <text x="140" y="210" fill="#fde68a" font-family="system-ui, sans-serif" font-size="24" font-weight="700" letter-spacing="3">CENTRO CULTURAL ISLÁMICO • BOGOTÁ, COLOMBIA</text>
  <text x="140" y="300" fill="#ffffff" font-family="system-ui, sans-serif" font-size="54" font-weight="900">Mezquita Central</text>
  <text x="140" y="370" fill="#ffffff" font-family="system-ui, sans-serif" font-size="54" font-weight="900">Abu Bakr As-Siddiq</text>
  <text x="140" y="450" fill="#ccfbf1" font-family="system-ui, sans-serif" font-size="26" font-weight="500">Oración • Educación Islámica • Acción Social • Diálogo Intercultural</text>
</svg>`,
  },
  {
    fileName: 'jumuah-khutbah-series-cover.svg',
    hash: 'jumuah_khutbah_series_cover_seed',
    folderKey: '03 - Khutbahs & Media Feeds/Jumuah Khutbahs',
    alternativeText: 'Portada de la serie Khutbahs de Jumu’ah — Mezquita Central de Bogotá',
    caption: 'Portada oficial para grabaciones y transcripciones de la Khutbah de los viernes',
    width: 1200,
    height: 675,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img" aria-label="Jumuah Khutbah Series Cover">
  <rect width="1200" height="675" rx="24" fill="#064e3b" />
  <rect x="60" y="60" width="1080" height="555" rx="20" fill="#042f2e" fill-opacity="0.55" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="2" />
  <text x="600" y="240" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-size="28" font-weight="700" letter-spacing="3">SERIE SEMANAL MULTILINGÜE (AR • ES • EN • TR)</text>
  <text x="600" y="340" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="60" font-weight="900">Jumu’ah Khutbah</text>
  <text x="600" y="420" text-anchor="middle" fill="#99f6e4" font-family="system-ui, sans-serif" font-size="28" font-weight="600">Mezquita Central Abu Bakr As-Siddiq • Bogotá</text>
</svg>`,
  },
  {
    fileName: 'zakat-sadaqah-campaign-banner.svg',
    hash: 'zakat_sadaqah_campaign_banner_seed',
    folderKey: '05 - Donations & Certificates/Campaign Banners',
    alternativeText: 'Fondo de Zakat, Sadaqah y Acción Social — Mezquita Central de Bogotá',
    caption: 'Banner principal para campañas de Zakat, Sadaqah y sostenimiento comunitario',
    width: 1200,
    height: 600,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600" role="img" aria-label="Zakat & Sadaqah Campaign Banner">
  <rect width="1200" height="600" rx="24" fill="#0f766e" />
  <rect x="70" y="70" width="1060" height="460" rx="20" fill="#042f2e" fill-opacity="0.5" stroke="#fde68a" stroke-opacity="0.4" stroke-width="2" />
  <text x="600" y="220" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-size="26" font-weight="700" letter-spacing="2.5">SOLIDARIDAD Y SOSTENIMIENTO COMUNITARIO</text>
  <text x="600" y="315" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Zakat &amp; Sadaqah</text>
  <text x="600" y="395" text-anchor="middle" fill="#ccfbf1" font-family="system-ui, sans-serif" font-size="26" font-weight="500">Apoya la educación, la asistencia alimentaria y el mantenimiento de la Mezquita</text>
</svg>`,
  },
  {
    fileName: 'Fortaleza_del_Musulman_Cover.svg',
    hash: 'Fortaleza_del_Musulman_Cover',
    folderKey: '04 - Library & Resources/Publication Covers',
    alternativeText: 'Portada de La Fortaleza del Musulmán (Hisnul Muslim)',
    caption: 'Portada digital para la guía de súplicas diarias Hisnul Muslim',
    width: 800,
    height: 1120,
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="800" height="1120" role="img" aria-label="La Fortaleza del Musulmán">
  <rect width="800" height="1120" rx="24" fill="#064e3b" />
  <rect x="64" y="64" width="672" height="992" rx="18" fill="none" stroke="#fde68a" stroke-width="4" stroke-opacity="0.6" />
  <text x="400" y="340" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-size="26" font-weight="700" letter-spacing="3">BIBLIOTECA DIGITAL • HISNUL MUSLIM</text>
  <text x="400" y="450" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="52" font-weight="900">La Fortaleza</text>
  <text x="400" y="520" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="52" font-weight="900">del Musulmán</text>
  <text x="400" y="620" text-anchor="middle" fill="#99f6e4" font-family="system-ui, sans-serif" font-size="24" font-weight="500">Invocaciones y Súplicas del Corán y la Sunnah</text>
  <text x="400" y="960" text-anchor="middle" fill="#fde68a" font-family="system-ui, sans-serif" font-size="20" font-weight="700">Mezquita Central Abu Bakr As-Siddiq • Bogotá</text>
</svg>`,
  },
];

interface FolderRecord {
  id: number;
  name: string;
  pathId: number;
  path: string;
}

export async function seedMediaLibraryFolders(strapi: Core.Strapi) {
  try {
    const folderService = strapi.plugin('upload')?.service('folder') as
      | {
          create: (data: { name: string; parent?: number | null }) => Promise<FolderRecord>;
        }
      | undefined;

    if (!folderService) {
      return;
    }

    const folderMap = new Map<string, FolderRecord>();

    for (const rootDef of MEDIA_LIBRARY_FOLDER_TREE) {
      let rootFolder = (await strapi.db.query('plugin::upload.folder').findOne({
        where: {
          name: rootDef.name,
          parent: null,
        },
      })) as FolderRecord | null;

      if (!rootFolder) {
        rootFolder = await folderService.create({
          name: rootDef.name,
          parent: null,
        });
      }

      folderMap.set(rootDef.name, rootFolder);

      for (const childName of rootDef.children ?? []) {
        let childFolder = (await strapi.db.query('plugin::upload.folder').findOne({
          where: {
            name: childName,
            parent: { id: rootFolder.id },
          },
        })) as FolderRecord | null;

        if (!childFolder) {
          childFolder = await folderService.create({
            name: childName,
            parent: rootFolder.id,
          });
        }

        folderMap.set(`${rootDef.name}/${childName}`, childFolder);
      }
    }

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    for (const asset of INITIAL_MEDIA_ASSETS) {
      const targetFolder = folderMap.get(asset.folderKey);
      if (!targetFolder) continue;

      const existingFile = await strapi.db.query('plugin::upload.file').findOne({
        where: { hash: asset.hash },
      });
      if (existingFile) continue;

      let contentBuffer: Buffer | null = null;
      if (asset.sourceRelativePath) {
        const sourcePath = path.resolve(process.cwd(), asset.sourceRelativePath);
        if (fs.existsSync(sourcePath)) {
          contentBuffer = fs.readFileSync(sourcePath);
        }
      } else if (asset.svgContent) {
        contentBuffer = Buffer.from(asset.svgContent, 'utf8');
      }

      if (!contentBuffer) continue;

      const diskFileName = `${asset.hash}.svg`;
      const diskFilePath = path.join(uploadsDir, diskFileName);
      if (!fs.existsSync(diskFilePath)) {
        fs.writeFileSync(diskFilePath, contentBuffer);
      }

      const sizeInKb = Number((contentBuffer.byteLength / 1024).toFixed(2));

      await strapi.db.query('plugin::upload.file').create({
        data: {
          name: asset.fileName,
          alternativeText: asset.alternativeText,
          caption: asset.caption,
          width: asset.width,
          height: asset.height,
          formats: null,
          hash: asset.hash,
          ext: '.svg',
          mime: 'image/svg+xml',
          size: sizeInKb,
          url: `/uploads/${diskFileName}`,
          previewUrl: null,
          provider: 'local',
          provider_metadata: null,
          folder: targetFolder.id,
          folderPath: targetFolder.path,
          publishedAt: new Date(),
        },
      });
    }
  } catch (err) {
    strapi.log.warn(
      `[media-folders-seed] Could not seed Media Library folder hierarchy: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
