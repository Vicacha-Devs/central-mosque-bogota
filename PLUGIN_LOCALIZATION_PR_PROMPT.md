# Prompt: Strapi v5 Plugin Localization & Admin Modernization PRs (`en`, `es`, `ar`, `tr`)

## Audit:

Here is the audit of all Strapi plugins in

backend/package.json
against our 4 configured admin locales (en, es, ar, tr):

1. Plugins with NO translations at all (no registerTrads)
   Package Notes
   strapi-5-sitemap-plugin Admin UI strings are hardcoded in English (no registerTrads).
   strapi-plugin-content-manager-organizer Admin organizer modal is hardcoded in English (no registerTrads).
   strapi-v5-plugin-populate-deep Server-only middleware/query plugin (no Admin UI).
2. Plugins with partial translations (missing es, ar, or tr)
   Package Bundled Locales Missing Locales
   strapi-plugin-preview-button en, es, fr, ja, ru, tr ar (provided in `translations.ts`)
   @juadariasmar/strapi-plugin-typesense en es, ar, tr
   strapi-plugin-publisher de, en, fr, nl es, ar, tr
   strapi-plugin-email-designer-5 de, en, es, fr ar, tr
   strapi-plugin-navigation ca, en, es, fr, tr ar
   @strapi/plugin-cloud cs, en, es, fr, it, ja, ko, nl, pl, ru, sk, tr, uk ar
3. Plugins with complete en, es, ar, tr translations
   All 11 @vicacha-devs/strapi-plugin-* packages (bookings, broadcasts, calendar, certificates, donations, events, inbox, islam, media-feeds, notes, resources)
   @notum-cz/strapi-plugin-seo (ar, en, es, fr, pt-BR, tr)
   @notum-cz/strapi-plugin-tiptap-editor (ar, cs, de, en, es, fr, it, nl, pl, pt, tr)
   strapi-global-search (ar, en, es, fr, tr)
   strapi-cache (ar, de, en, es, tr — updated in v1.13.0)
   strapi-plugin-config-sync (22 locales including en, es, ar, tr)
   @strapi/plugin-users-permissions (25 locales including en, es, ar, tr)

Copy and paste the prompt below into the agent working on your forked plugin repositories:

---

````markdown
You are tasked with adding complete 4-locale internationalization (`en`, `es`, `ar`, `tr`) and fixing Strapi v5 Admin SDK deprecations across our forked Strapi v5 plugins so we can open upstream Pull Requests (and use the built packages locally).

## Target Locales

Every plugin MUST support and bundle at least these 4 locales in its Admin panel:

- `en` (English)
- `es` (Spanish / Español)
- `ar` (Arabic / العربية — Modern Standard Arabic, RTL-friendly phrasing)
- `tr` (Turkish / Türkçe)

(Preserve any existing locales the plugin already ships with, such as `nl`, `de`, `fr`, `ca`, etc.)

---

## Global Technical Rules for All Plugins (CRITICAL)

1. **Vite-Compatible `registerTrads` (No Broken Variable Dynamic Imports)**
   - In Strapi v5 (Vite), `import(\`./translations/\${locale}.json\`)`inside pre-bundled`dist/`packages throws at runtime when a locale is missing or when Rollup/tsup does not inline the dynamic import map:`Error: Unknown variable dynamic import: ./translations/es.json`
   - **Fix**: Explicitly import the JSON translation dictionaries (or use a static lookup map) inside `admin/src/index.ts` (or `registerTrads`) and export both unprefixed and `${PLUGIN_ID}.*` prefixed keys (using `prefixPluginTranslations` or a helper loop) so both `formatMessage({ id: getTrad('...') })` and `intlLabel: { id: '${PLUGIN_ID}.plugin.name' }` resolve cleanly:
     ```ts
     import en from "./translations/en.json";
     import es from "./translations/es.json";
     import ar from "./translations/ar.json";
     import tr from "./translations/tr.json";

     const TRAD_MAP: Record<string, Record<string, string>> = {
       en,
       es,
       ar,
       tr,
       // keep any existing locales (e.g., nl, de, fr)
     };
     ```

2. **Fix Strapi v5 `addMenuLink` & `addSettingsLink` Async `Component` Deprecation**
   - Do **NOT** use `async Component() { const { App } = await import(...); return App; }`.
   - Use a synchronous loader returning a dynamic import Promise with a `{ default }` export shape:
     ```ts
     Component: () =>
       import('./pages/App').then((mod) => ({
         default: mod.default ?? mod.App,
       })),
     ```

3. **Fix Strapi v5 `useRBAC` Deprecation**
   - Where `useRBAC(permissionsObject)` is called with an object (e.g. `strapi-plugin-publisher`), pass an array of permission objects (e.g. `Object.values(permissions)` or `permissionsArray`) as the first argument so Strapi v5 does not log:
     `useRBAC: The first argument should be an array of permissions, not an object.`

---

## Plugin-by-Plugin Checklist & Tasks

### Group A: Plugins with Partial Translations (Add Missing Locale JSON Files)

#### 1. `strapi-plugin-preview-button`

- **Upstream Repo**: `mattmilburn/strapi-plugin-preview-button`
- **Existing Locales**: `en`, `es`, `fr`, `ja`, `ru`, `tr`
- **Missing Locales to Add**: `ar.json`
- **Tasks**:
  - Add `admin/src/translations/ar.json` translating all keys from `en.json` (`form.button.draft`, `form.button.published`, `form.button.copy-link`, `list-view.column.header`, etc.).

#### 2. `@juadariasmar/strapi-plugin-typesense`

- **Upstream Repo**: `juadariasmar/strapi-plugin-typesense`
- **Existing Locales**: `en`
- **Missing Locales to Add**: `es.json`, `ar.json`, `tr.json`
- **Tasks**:
  - Add `admin/src/translations/es.json`, `ar.json`, and `tr.json` translating all keys from `en.json` (search settings, indexing status, collection sync actions, notifications).
  - Fix any `addMenuLink` / `addSettingsLink` async `Component` wrapper in `admin/src/index.ts`.

#### 3. `strapi-plugin-publisher`

- **Upstream Repo**: `PluginPal/strapi-plugin-publisher`
- **Existing Locales**: `de`, `en`, `fr`, `nl`
- **Missing Locales to Add**: `es.json`, `ar.json`, `tr.json`
- **Tasks**:
  - Add `admin/src/translations/es.json`, `ar.json`, and `tr.json` translating all 19 keys in `admin/src/translations/en.json` (`action.header.publish.title`, `action.header.unpublish.title`, `action.footer.*`, `action.notification.*`, `plugin.name`).
  - Fix `useRBAC` in `Action.tsx` (pass an array of permissions instead of a permission map object).

#### 4. `strapi-plugin-email-designer-5`

- **Upstream Repo**: `BayBreezy/strapi-plugin-email-designer-5`
- **Existing Locales**: `de`, `en`, `es`, `fr`
- **Missing Locales to Add**: `ar.json`, `tr.json`
- **Tasks**:
  - Add `admin/src/translations/ar.json` and `tr.json` translating all keys from `admin/src/translations/en.json` (`page.*`, `designer.*`, `input.*`, `tooltip.*`, `confirm.*`, `error.*`, `success.*`, table headers, and tabs).
  - Register `ar` and `tr` in `admin/src/translations/index.ts` / `admin/src/index.ts`.

#### 5. `strapi-plugin-navigation`

- **Upstream Repo**: `VirtusLab/strapi-plugin-navigation`
- **Existing Locales**: `ca`, `en`, `es`, `fr`, `tr`
- **Missing Locales to Add**: `ar.ts` (or `ar.json`)
- **Tasks**:
  - Create `admin/src/translations/ar.ts` matching the nested schema in `admin/src/translations/en.ts` (`plugin`, `header`, `submit`, `empty`, `popup`, `view`, `components`, `notification`, `pages.settings`).
  - Export `ar` in `admin/src/translations/index.ts`.

---

### Group B: Plugins with Hardcoded English UI (Extract Strings & Implement `registerTrads`)

#### 6. `strapi-5-sitemap-plugin`

- **Upstream Repo**: `DigitalMoonrise-UG/strapi-5-sitemap-plugin`
- **Current State**: No `translations/` directory and no `registerTrads` in `admin/src/index.ts`; all Admin UI labels/tabs/buttons/notifications are hardcoded in English.
- **Tasks**:
  - Create `admin/src/translations/{en,es,ar,tr}.json` and `admin/src/utils/getTrad.ts`.
  - Implement `registerTrads` in `admin/src/index.ts` and localize `intlLabel` in `addMenuLink` / `createSettingSection`.
  - Replace hardcoded English strings across `admin/src/pages/*` and `admin/src/components/*` (Content Types tab, Custom URLs tab, Settings tab, Generate Sitemap button, Priority/Frequency selects, notifications) with `useIntl().formatMessage({ id: getTrad('...') })`.

#### 7. `strapi-plugin-content-manager-organizer`

- **Upstream Repo**: `chetanhasarmani1724/strapi-content-manager-organizer`
- **Current State**: No `translations/` directory and no `registerTrads`; sidebar organizer actions, folder/group modals, buttons, and notifications are hardcoded in English.
- **Tasks**:
  - Create `admin/src/translations/{en,es,ar,tr}.json` and `admin/src/utils/getTrad.ts`.
  - Implement `registerTrads` in `admin/src/index.ts` and localize `intlLabel` in `addMenuLink`.
  - Replace hardcoded strings in `admin/src/components/*` and `admin/src/pages/*` with `useIntl().formatMessage`.

---

## Verification Steps Before Opening Each PR

1. Run the plugin's build command (`npm run build` / `pnpm build` / `yarn build`) and `tsc --noEmit` to verify `dist/` compiles cleanly with all JSON translation files bundled.
2. Verify that `registerTrads({ locales: ['en', 'es', 'ar', 'tr'] })` resolves all 4 locale objects without throwing dynamic import errors.
3. Commit with a clean conventional commit message: `feat(i18n): add es, ar, and tr admin translations`.
````
