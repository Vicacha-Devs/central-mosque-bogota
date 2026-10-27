import type { Core } from '@strapi/strapi';

/**
 * TODO(upstream-patch-removal): Gradually remove each runtime/dist patch below as upstream
 * Strapi core and community plugins release fixes. See `/PATCHES_AND_UPSTREAM_PR_REPORT.md`
 * for full issue descriptions, reproduction steps, and PR prompts.
 *
 * Removal checklist:
 * 1. [Patch B1 - @strapi/i18n `ai-localization-jobs` 404 when disabled]
 *    Remove the `ai-localization-jobs` controller wrapper (lines 20-47) and dist patch (section 4)
 *    once `@strapi/i18n` returns `200 { data: null }` (or skips polling in the admin UI) when AI localizations are disabled.
 * 2. [Patch B2 - @strapi/content-manager placeholder i18n & content-locale lookup]
 *    Remove section 1 (`FormLayout`, `NonRepeatable`, `Repeatable` dist patch) once `@strapi/content-manager`
 *    translates `field.placeholder` via `formatMessage` natively.
 * 3. [Patch B3 - @frameless/preview-button panel title & default locale]
 *    Remove section 2 (`@frameless/preview-button` dist patch) and `THIRD_PARTY_PLUGIN_TRANSLATIONS` in
 *    `src/admin/translations.ts` once `@frameless/preview-button` localizes its panel title via `formatMessage`
 *    and ships `es`, `ar`, and `tr` locale files.
 * 4. [Patch B4 - strapi-plugin-navigation `plugin::*` content-type support]
 *    Remove section 3 (`strapi-plugin-navigation` dist patch) once `strapi-plugin-navigation` includes
 *    `plugin::` alongside `api::` for Content Manager shortcut links and selectable content types.
 */
export function patchContentManagerAndPreviewLocalization(strapi?: Core.Strapi) {
  try {
    // TODO(Patch B1a): Remove runtime controller wrapper when @strapi/i18n stops returning 404 for disabled AI localizations
    if (strapi) {
      try {
        const i18nPlugin = strapi.plugin('i18n');
        const jobsController = i18nPlugin?.controller('ai-localization-jobs') as
          | Record<string, ((ctx: any) => Promise<unknown>) & { __patchedNo404?: boolean }>
          | undefined;
        const aiLocalizationsService = i18nPlugin?.service('ai-localizations') as
          | { isEnabled?: () => Promise<boolean> }
          | undefined;
        if (jobsController && aiLocalizationsService) {
          for (const method of ['getJobForSingleType', 'getJobForCollectionType'] as const) {
            const original = jobsController[method];
            if (typeof original === 'function' && !original.__patchedNo404) {
              const wrapped = async (ctx: any) => {
                if ((await aiLocalizationsService.isEnabled?.()) === false) {
                  ctx.body = { data: null };
                  return;
                }
                return original.call(jobsController, ctx);
              };
              wrapped.__patchedNo404 = true;
              jobsController[method] = wrapped;
            }
          }
        }
      } catch {
        // Ignore if i18n plugin is unavailable
      }
    }

    const fs = require('node:fs') as typeof import('node:fs');
    const path = require('node:path') as typeof import('node:path');

    // TODO(Patch B2): Remove when @strapi/content-manager localizes `field.placeholder` via formatMessage natively.
    // 1. Patch @strapi/content-manager FormLayout, NonRepeatable, and Repeatable so both
    // labels and placeholders are localized via formatMessage (and respect content locale / admin locale).
    try {
      const cmPkgPath = require.resolve('@strapi/content-manager/package.json');
      const cmDist = path.join(path.dirname(cmPkgPath), 'dist/admin/pages/EditView/components');

      for (const ext of ['mjs', 'js']) {
        const formLayoutPath = path.join(cmDist, `FormLayout.${ext}`);
        if (fs.existsSync(formLayoutPath)) {
          const raw = fs.readFileSync(formLayoutPath, 'utf8');
          if (!raw.includes('__mosquePlaceholderTranslated')) {
            const patched = raw
              .replace(
                /const getLabel = \(name, label\)=>\{\s*return formatMessage\(\{\s*id: `content-manager\.content-types\.\$\{modelUid\}\.\$\{name\}`,\s*defaultMessage: label\s*\}\);\s*\};/g,
                `const __mosquePlaceholderTranslated = true;
    const getActiveDict = () => {
        const urlLoc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plugins[i18n][locale]') : null;
        return urlLoc && globalThis.__CM_I18N_MESSAGES__?.[urlLoc] ? globalThis.__CM_I18N_MESSAGES__[urlLoc] : null;
    };
    const getLabel = (name, label) => {
        const key = \`content-manager.content-types.\${modelUid}.\${name}\`;
        const dict = getActiveDict();
        if (dict && dict[key]) return dict[key];
        return formatMessage({ id: key, defaultMessage: label });
    };
    const getPlaceholder = (name, placeholder) => {
        if (!placeholder) return placeholder;
        const key = \`content-manager.content-types.\${modelUid}.\${name}.placeholder\`;
        const dict = getActiveDict();
        if (dict && dict[key]) return dict[key];
        return formatMessage({ id: key, defaultMessage: placeholder });
    };`
              )
              .replace(
                /label: getLabel\(field\.name, field\.label\),/g,
                `label: getLabel(field.name, field.label),
                            placeholder: getPlaceholder(field.name, field.placeholder),`
              );
            if (patched !== raw) {
              fs.writeFileSync(formLayoutPath, patched, 'utf8');
            }
          }
        }

        const nonRepeatablePath = path.join(cmDist, `FormInputs/Component/NonRepeatable.${ext}`);
        if (fs.existsSync(nonRepeatablePath)) {
          const raw = fs.readFileSync(nonRepeatablePath, 'utf8');
          if (!raw.includes('__mosqueCompPlaceholderTranslated')) {
            const patched = raw
              .replace(
                /const translatedLabel = formatMessage\(\{\s*id: `content-manager\.components\.\$\{attribute\.component\}\.\$\{field\.name\}`,\s*defaultMessage: field\.label\s*\}\);/g,
                `const __mosqueCompPlaceholderTranslated = true;
                    const __urlLoc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plugins[i18n][locale]') : null;
                    const __dict = __urlLoc && globalThis.__CM_I18N_MESSAGES__?.[__urlLoc] ? globalThis.__CM_I18N_MESSAGES__[__urlLoc] : null;
                    const __lblKey = \`content-manager.components.\${attribute.component}.\${field.name}\`;
                    const __phKey = \`content-manager.components.\${attribute.component}.\${field.name}.placeholder\`;
                    const translatedLabel = (__dict && __dict[__lblKey]) || formatMessage({
                        id: __lblKey,
                        defaultMessage: field.label
                    });
                    const translatedPlaceholder = field.placeholder ? ((__dict && __dict[__phKey]) || formatMessage({
                        id: __phKey,
                        defaultMessage: field.placeholder
                    })) : field.placeholder;`
              )
              .replace(
                /label: translatedLabel,/g,
                `label: translatedLabel,
                            placeholder: translatedPlaceholder,`
              );
            if (patched !== raw) {
              fs.writeFileSync(nonRepeatablePath, patched, 'utf8');
            }
          }
        }

        const repeatablePath = path.join(cmDist, `FormInputs/Component/Repeatable.${ext}`);
        if (fs.existsSync(repeatablePath)) {
          const raw = fs.readFileSync(repeatablePath, 'utf8');
          if (!raw.includes('__mosqueRepPlaceholderTranslated')) {
            const patched = raw
              .replace(
                /const translatedLabel = formatMessage\(\{\s*id: `content-manager\.components\.\$\{attributeComponent\}\.\$\{field\.name\}`,\s*defaultMessage: field\.label\s*\}\);/g,
                `const __mosqueRepPlaceholderTranslated = true;
                    const __urlLoc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plugins[i18n][locale]') : null;
                    const __dict = __urlLoc && globalThis.__CM_I18N_MESSAGES__?.[__urlLoc] ? globalThis.__CM_I18N_MESSAGES__[__urlLoc] : null;
                    const __lblKey = \`content-manager.components.\${attributeComponent}.\${field.name}\`;
                    const __phKey = \`content-manager.components.\${attributeComponent}.\${field.name}.placeholder\`;
                    const translatedLabel = (__dict && __dict[__lblKey]) || formatMessage({
                        id: __lblKey,
                        defaultMessage: field.label
                    });
                    const translatedPlaceholder = field.placeholder ? ((__dict && __dict[__phKey]) || formatMessage({
                        id: __phKey,
                        defaultMessage: field.placeholder
                    })) : field.placeholder;`
              )
              .replace(
                /label: translatedLabel,/g,
                `label: translatedLabel,
                            placeholder: translatedPlaceholder,`
              );
            if (patched !== raw) {
              fs.writeFileSync(repeatablePath, patched, 'utf8');
            }
          }
        }
      }
    } catch {
      // Ignore if read-only filesystem
    }

    // TODO(Patch B3): Remove when @frameless/preview-button localizes Panel title via formatMessage and ships es/ar/tr locales.
    // 2. Patch @frameless/preview-button so PreviewPanel title is localized via formatMessage
    try {
      const previewPkgPath = require.resolve('@frameless/preview-button/package.json');
      const previewAdminDir = path.join(path.dirname(previewPkgPath), 'dist/admin');
      for (const file of ['index.mjs', 'index.js']) {
        const p = path.join(previewAdminDir, file);
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const patched = raw
            .replace(
              /title: isPreviewSupported\.button_label \?\? "Live Preview",/g,
              `title: (globalThis.__CM_I18N_MESSAGES__?.[typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("plugins[i18n][locale]") : ""]?.["preview-button.panel.title"]) ?? isPreviewSupported.button_label ?? "Live Preview",`
            )
            .replace(/locale: locale \?\? "nl",/g, 'locale: locale ?? "es",');
          if (patched !== raw) {
            fs.writeFileSync(p, patched, 'utf8');
          }
        }
      }
    } catch {
      // Ignore if read-only filesystem
    }

    // TODO(Patch B4): Remove when strapi-plugin-navigation supports `plugin::*` UIDs for Content Manager shortcut icons & dropdowns.
    // 3. Patch strapi-plugin-navigation admin bundle so plugin::* content types also display
    // the Content Manager shortcut icon on navigation item cards and in settings dropdowns.
    try {
      const navPkgPath = require.resolve('strapi-plugin-navigation/package.json');
      const navAdminDir = path.join(path.dirname(navPkgPath), 'dist/admin');
      for (const file of ['index.mjs', 'index.js']) {
        const p = path.join(navAdminDir, file);
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const patched = raw
            .replace(
              /_e = ee\?\.uid\.includes\("api::"\)/g,
              '_e = Boolean(ee?.uid?.includes("api::") || ee?.uid?.includes("plugin::"))'
            )
            .replace(
              /\(r \? \["api::", \.\.\.i\] : a\)/g,
              '(r ? ["api::", "plugin::", ...i] : a)'
            );
          if (patched !== raw) {
            fs.writeFileSync(p, patched, 'utf8');
          }
        }
      }
    } catch {
      // Ignore if read-only filesystem
    }

    // TODO(Patch B1b): Remove dist patch when @strapi/i18n returns 200 { data: null } instead of 404 when AI localizations are disabled.
    // 4. Patch @strapi/i18n ai-localization-jobs controller so disabled AI localizations return
    // 200 { data: null } instead of 404 Not Found when Content Manager polls on mount.
    try {
      const i18nPkgPath = require.resolve('@strapi/i18n/package.json');
      const i18nCtrlDir = path.join(path.dirname(i18nPkgPath), 'dist/server/controllers');
      for (const file of ['ai-localization-jobs.mjs', 'ai-localization-jobs.js']) {
        const p = path.join(i18nCtrlDir, file);
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const patched = raw.replace(
            /if \(await aiLocalizationsService\.isEnabled\(\) === false\) \{\s*return ctx\.notFound\(\);\s*\}/g,
            `if (await aiLocalizationsService.isEnabled() === false) {
                ctx.body = { data: null };
                return;
            }`
          );
          if (patched !== raw) {
            fs.writeFileSync(p, patched, 'utf8');
          }
        }
      }
    } catch {
      // Ignore if read-only filesystem
    }
  } catch {
    // Resilient fallback
  }
}
