import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
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
 * 3. [Patch B3 - strapi-plugin-preview-button `listViewColumn` default & `noBorder` prop]
 *    Remove the `plugin::preview-button` `listViewColumn: true` bootstrap default (lines 59-83)
 *    and section 4 (`noBorder: true` dist chunk patch) once `strapi-plugin-preview-button` merges
 *    the server `bootstrap` default and removes `noBorder` from `ListViewColumn`.
 * 4. [Patch B4 - strapi-plugin-navigation `plugin::*` content-type support]
 *    Remove section 2 (`strapi-plugin-navigation` dist patch) once `strapi-plugin-navigation` includes
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

      // TODO(Patch B3a): Remove when strapi-plugin-preview-button sets pluginOptions['preview-button'].listViewColumn = true in server bootstrap.
      // Enable strapi-plugin-preview-button listViewColumn (default: true per plugin docs)
      // for all content types configured in plugin::preview-button.contentTypes.
      try {
        const previewCfg = strapi.config.get("plugin::preview-button", { contentTypes: [] }) as {
          contentTypes?: Array<{ uid?: string }>;
        };
        const configuredUids = Array.isArray(previewCfg?.contentTypes)
          ? previewCfg.contentTypes.map((ct) => ct?.uid).filter((u): u is string => Boolean(u))
          : [];
        for (const uid of configuredUids) {
          const ct = (strapi.contentTypes as Record<string, any>)?.[uid];
          if (!ct) continue;
          for (const obj of [ct, ct.__schema__]) {
            if (!obj || typeof obj !== "object") continue;
            obj.pluginOptions = obj.pluginOptions || {};
            const existing = obj.pluginOptions["preview-button"] || {};
            if (existing.listViewColumn === undefined) {
              obj.pluginOptions["preview-button"] = {
                ...existing,
                listViewColumn: true,
              };
            }
          }
        }
      } catch {
        // Ignore if preview-button config is unavailable
      }
    }

    const nodeRequire =
      typeof require === 'function'
        ? require
        : createRequire(path.join(process.cwd(), 'package.json'));
    const resolvePaths = [process.cwd()];
    try {
      resolvePaths.push(path.dirname(nodeRequire.resolve('@strapi/strapi/package.json')));
    } catch {
      // Ignore if @strapi/strapi is not directly resolvable
    }

    // TODO(Patch B2): Remove when @strapi/content-manager localizes `field.placeholder` via formatMessage natively.
    // 1. Patch @strapi/content-manager FormLayout, NonRepeatable, and Repeatable so both
    // labels and placeholders are localized via formatMessage (and respect content locale / admin locale).
    try {
      const cmPkgPath = nodeRequire.resolve('@strapi/content-manager/package.json', {
        paths: resolvePaths,
      });
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

        const inputRendererPath = path.join(cmDist, `InputRenderer.${ext}`);
        if (fs.existsSync(inputRendererPath)) {
          const raw = fs.readFileSync(inputRendererPath, 'utf8');
          if (!raw.includes('__mosqueEnumTranslatedV2')) {
            const cleaned = raw.replace(
              /options:\s*props\.attribute\.enum\.map\(\(value\)=>\{[\s\S]*?return \{ value, label: __label \};\s*\}\)/g,
              'options: props.attribute.enum.map((value)=>({ value }))'
            );
            const patched = cleaned.replace(
              /options:\s*props\.attribute\.enum\.map\(\(value\)=>\(\{\s*value\s*\}\)\)/g,
              `options: props.attribute.enum.map((value)=>{
                        const __mosqueEnumTranslatedV2 = true;
                        const __urlLoc = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('plugins[i18n][locale]')) || (typeof localeKey === 'string' && localeKey !== 'default' ? localeKey : null);
                        const __adminLoc = typeof window !== 'undefined' ? (window.localStorage?.getItem('strapi-admin-language') || 'en').replace(/^"|"$/g, '') : 'en';
                        const __dict = (__urlLoc && globalThis.__CM_I18N_MESSAGES__?.[__urlLoc]) || globalThis.__CM_I18N_MESSAGES__?.[__adminLoc] || null;
                        const __enumKey = \`content-manager.enum.\${value}\`;
                        const __fallback = String(value).replace(/[_-]+/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase());
                        const __label = (__dict && (__dict[__enumKey] || __dict[value])) || __fallback;
                        return { value, label: __label };
                    })`
            );
            if (patched !== raw) {
              fs.writeFileSync(inputRendererPath, patched, 'utf8');
              const viteCacheDir = path.join(process.cwd(), 'node_modules', '.strapi', 'vite');
              if (fs.existsSync(viteCacheDir)) {
                fs.rmSync(viteCacheDir, { recursive: true, force: true });
              }
            }
          }
        }
      }

      const adminPkgPath = nodeRequire.resolve('@strapi/admin/package.json', {
        paths: resolvePaths,
      });
      const adminFormInputsDir = path.join(
        path.dirname(adminPkgPath),
        'dist/admin/admin/src/components/FormInputs'
      );
      for (const ext of ['mjs', 'js']) {
        const enumPath = path.join(adminFormInputsDir, `Enumeration.${ext}`);
        if (fs.existsSync(enumPath)) {
          const raw = fs.readFileSync(enumPath, 'utf8');
          if (!raw.includes('__mosqueEnumOptionLabel')) {
            const patched = raw.replace(
              /children:\s*label\s*\?\?\s*formatMessage\(\{\s*id:\s*value,\s*defaultMessage:\s*value\s*\}\)/g,
              `children: label ?? ((() => {
                                const __mosqueEnumOptionLabel = true;
                                const __urlLoc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plugins[i18n][locale]') : null;
                                const __dict = __urlLoc && globalThis.__CM_I18N_MESSAGES__?.[__urlLoc] ? globalThis.__CM_I18N_MESSAGES__[__urlLoc] : null;
                                const __enumKey = \`content-manager.enum.\${value}\`;
                                const __fallback = String(value).replace(/[_-]+/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase());
                                return (__dict && (__dict[__enumKey] || __dict[value])) || formatMessage({ id: __enumKey, defaultMessage: formatMessage({ id: value, defaultMessage: __fallback }) });
                            })())`
            );
            if (patched !== raw) {
              fs.writeFileSync(enumPath, patched, 'utf8');
              const viteCacheDir = path.join(process.cwd(), 'node_modules', '.strapi', 'vite');
              if (fs.existsSync(viteCacheDir)) {
                fs.rmSync(viteCacheDir, { recursive: true, force: true });
              }
            }
          }
        }
      }
    } catch {
      // Ignore if read-only filesystem
    }

    // TODO(Patch B4): Remove when strapi-plugin-navigation supports `plugin::*` UIDs for Content Manager shortcut icons & dropdowns.
    // 2. Patch strapi-plugin-navigation admin bundle so plugin::* content types also display
    // the Content Manager shortcut icon on navigation item cards and in settings dropdowns.
    try {
      const navPkgPath = nodeRequire.resolve('strapi-plugin-navigation/package.json', {
        paths: resolvePaths,
      });
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
    // 3. Patch @strapi/i18n ai-localization-jobs controller so disabled AI localizations return
    // 200 { data: null } instead of 404 Not Found when Content Manager polls on mount.
    try {
      const i18nPkgPath = nodeRequire.resolve('@strapi/i18n/package.json', {
        paths: resolvePaths,
      });
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

    // 4. Patch strapi-plugin-preview-button admin chunk to remove deprecated Design System v1
    // `noBorder: true` prop on IconButton in ListViewColumn (eliminating React DOM warnings).
    try {
      const previewPkgPath = nodeRequire.resolve('strapi-plugin-preview-button/package.json', {
        paths: resolvePaths,
      });
      const previewChunksDir = path.join(path.dirname(previewPkgPath), 'dist/_chunks');
      if (fs.existsSync(previewChunksDir)) {
        for (const file of fs.readdirSync(previewChunksDir)) {
          if (!file.startsWith('index-') || (!file.endsWith('.mjs') && !file.endsWith('.js'))) {
            continue;
          }
          const chunkPath = path.join(previewChunksDir, file);
          const raw = fs.readFileSync(chunkPath, 'utf8');
          const patched = raw.replace(/\bnoBorder:\s*true,\s*/g, '');
          if (patched !== raw) {
            fs.writeFileSync(chunkPath, patched, 'utf8');
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

