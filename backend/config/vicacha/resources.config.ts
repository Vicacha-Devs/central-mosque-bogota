type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueResourcesPluginConfig(env: EnvFn) {
  return {
    enabled: true,
    config: {
      organizationName: 'Mezquita Central Abu Bakr As-Siddiq — Bogotá',
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      secondaryCalendar: 'islamic-umalqura',
      enableCloudinaryOptimization: env.bool(
        'RESOURCES_CLOUDINARY_OPTIMIZATION',
        true
      ),
      autoSyncMediaFolders: env.bool('RESOURCES_AUTO_SYNC_FOLDERS', true),
      defaultPublicationsFolderPath: env(
        'RESOURCES_PUBLICATIONS_FOLDER',
        '/resources/publications'
      ),
      defaultGalleriesFolderPath: env(
        'RESOURCES_GALLERIES_FOLDER',
        '/resources/galleries'
      ),
      allowedDownloadExtensions: [
        '.pdf',
        '.epub',
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.mp3',
        '.m4a',
        '.zip',
      ],
      allowedDownloadMimeTypes: [
        'application/pdf',
        'application/epub+zip',
        'image/png',
        'image/jpeg',
        'image/webp',
        'audio/mpeg',
        'audio/mp4',
        'application/zip',
      ],
      maxPhotosPerAlbum: env.int('RESOURCES_MAX_PHOTOS_PER_ALBUM', 120),
    },
  };
}
