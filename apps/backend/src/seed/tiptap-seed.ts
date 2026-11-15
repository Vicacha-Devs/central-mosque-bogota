import type { Core } from '@strapi/strapi';

export async function seedTiptapEditorConfig(strapi: Core.Strapi) {
  try {

    const tiptapPlugin = strapi.plugin?.('tiptap-editor') as unknown as {
      service?: (name: string) => {
        getStore?: () => { get: (opts: { key: string }) => Promise<unknown> } | null;
        getSettings?: () => Promise<Record<string, unknown>>;
        updateSettings?: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      };
    };

    const settingsSvc = tiptapPlugin?.service?.('settings');
    if (settingsSvc?.getStore && settingsSvc?.updateSettings) {
      const store = settingsSvc.getStore();
      const existing = (store ? await store.get({ key: 'settings' }) : null) as Record<
        string,
        unknown
      > | null;
      if (
        !existing ||
        existing.defaultOutputFormat === 'markdown' ||
        !existing.defaultOutputFormat
      ) {
        if (store && existing && ('presets' in existing || 'fieldPresets' in existing)) {
          await (store as unknown as { set: (opts: { key: string; value: unknown }) => Promise<void> }).set({
            key: 'settings',
            value: {},
          });
        }
        await settingsSvc.updateSettings({
          defaultPreset: (typeof existing?.defaultPreset === 'string' && existing.defaultPreset) || 'editorial',
          defaultOutputFormat: 'json',
          enableRelationalSync: true,
          allowedIframeDomains: [
            'www.youtube.com',
            'youtube.com',
            'player.vimeo.com',
            'www.google.com',
          ],
        });
      }
    }
  } catch {
    strapi.log?.warn?.('Could not initialize Tiptap Editor runtime settings');
  }
}
