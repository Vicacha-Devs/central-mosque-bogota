# Strapi v5 Patches Audit, Upstream Issue Texts & PR Prompts

This document catalogs every build-time Vite transform, `dist/` bundle patch, and runtime service patch in the **Central Mosque of Bogotá** backend, explains the technical root cause for each, provides ready-to-paste **GitHub Issue descriptions** and **AI Coding Prompts for opening upstream PRs**, and defines a **gradual patch removal checklist** linked to `TODO(upstream-patch-removal)` comments in the codebase.

---

## 1. Executive Summary Table

| Patch ID | Location in Project | Related Package / Plugin | Category | Root Cause Summary |
| :--- | :--- | :--- | :--- | :--- |
| **Patch A2** | [`src/admin/vite.config.ts#L31-L37`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L31-L37) | `strapi-5-sitemap-plugin` (`^1.0.8`) | Vite Admin Bundle Transform | Only ships `en.json` and logs noisy `console.warn` errors in `registerTrads` for every non-English admin locale (`es`, `ar`, `tr`) instead of falling back silently. |
| **Patch A3** | [`src/admin/vite.config.ts#L39-L44`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L39-L44) | `strapi-5-sitemap-plugin` (`^1.0.8`) | Vite Admin Bundle Transform | Registers its settings link with `to: '/settings/strapi-5-sitemap-plugin'` (producing `/settings/settings/...`) and uses `Component: async () =>` instead of `Component: () =>`. |
| **Patch A4** | [`src/admin/vite.config.ts#L46-L55`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L46-L55) | `@strapi/content-manager` & `@strapi/admin` (`5.59.0` — `InputRenderer` / `FormInputs/Renderer`) | Vite Admin Bundle Transform | `@strapi/content-manager`'s `EditView/components/InputRenderer.tsx` strips `unique` and `mainField` in its `default` branch before calling `@strapi/admin`'s generic `FormInputs/Renderer.tsx` (which only renders primitive inputs, never custom fields), but forgets to strip `attribute`, causing `StringInput` / `TextareaInput` to spread `attribute="[object Object]"` onto DOM `<input>` / `<textarea>` nodes. |
| **Patch A5** | [`src/admin/vite.config.ts#L57-L67`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L57-L67) | `@strapi/admin` (`5.59.0` — `hooks/useRBAC`) | Vite Admin Bundle Transform | Internal Strapi components pass a permissions object instead of an array to `useRBAC`, triggering a deprecation warning in the browser console. |
| **Patch A6** | [`src/admin/vite.config.ts#L69-L85`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L69-L85) | `@strapi/admin` (`5.59.0` — `router.mjs` & `StrapiApp.mjs`) | Vite Admin Bundle Transform | Initializes `createBrowserRouter` and `<RouterProvider>` without React Router v6.20+ `future: { v7_relativeSplatPath: true, v7_startTransition: true }` flags. |
| **Patch B1** | [`src/bootstrap/plugin-patches.ts#L22-L50`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L22-L50)<br/>[`src/bootstrap/plugin-patches.ts#L198-L223`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L198-L223) | `@strapi/i18n` (`5.59.0` — `ai-localization-jobs`) | Server Controller & Dist Patch | Content Manager polls `/i18n/ai-localization-jobs/...` on mount; when AI localizations are disabled, the controller returns `404 Not Found` instead of `200 { data: null }`, logging red 404 network errors. |
| **Patch B2** | [`src/bootstrap/plugin-patches.ts#L98-L212`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L98-L212) | `@strapi/content-manager` (`5.59.0` — `FormLayout`, `NonRepeatable`, `Repeatable`) | Admin Dist Patch | Translates `field.label` via `formatMessage`, but never passes `field.placeholder` through `formatMessage` for content types or components. |
| **Patch B3** | [`src/bootstrap/plugin-patches.ts#L59-L83`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L59-L83)<br/>[`src/bootstrap/plugin-patches.ts#L336-L359`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L336-L359) | `strapi-plugin-preview-button` (`^3.0.2`) | Server Bootstrap & Admin Dist Patch | Omits server `bootstrap` hook to set `pluginOptions['preview-button'].listViewColumn = true` (default per docs) on configured `contentTypes`, and passes deprecated Design System v1 `noBorder` prop to `<IconButton>` in `ListViewColumn`. |
| **Patch B4** | [`src/bootstrap/plugin-patches.ts#L215-L239`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L215-L239) | `strapi-plugin-navigation` (`^3.3.7`) | Admin Dist Patch | Checks `uid?.includes("api::")` exclusively when rendering Content Manager shortcut buttons and filtering content types, excluding `plugin::*` content types. |
| **Patch C1** | [`src/bootstrap/content-manager-organizer.ts#L100-L185`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/content-manager-organizer.ts#L100-L185) | `strapi-plugin-content-manager-organizer` (`^2.0.3`) | Runtime Service Override | Exposes internal hidden system plugin content types (`i18n`, `upload`, etc.) and keys items by `singularName` instead of `uid`, colliding when two plugins share a `singularName` (`campaign`). |

---

## 2. Detailed Patch Reports, GitHub Issue Texts & PR Prompts

---

### Patch A2 & A3 — `strapi-5-sitemap-plugin` Missing Locale Warning & Double `/settings/settings/...` Route
- **File**: [`backend/src/admin/vite.config.ts#L48-L61`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L48-L61)
- **Affected Plugin**: `strapi-5-sitemap-plugin` (`^1.0.8`)
- **Reason**:
  1. In `admin/src/index.ts`, `registerTrads` catches missing locale files (`es`, `ar`, `tr`) and logs `console.warn('[strapi-5-sitemap-plugin] Could not load translations for locale "...":', error)` on every page load, and only ships `en.json`.
  2. In `app.createSettingSection`, the settings link uses `to: `/settings/${PLUGIN_ID}`` (which Strapi v5 prefixes with `/settings/` again, resulting in `/settings/settings/strapi-5-sitemap-plugin`) and declares `Component: async () => { ... }` instead of `Component: () => import(...)`.

#### GitHub Issue Text (for `strapi-5-sitemap-plugin`)
```markdown
**Title:** fix(admin): use relative `to` path in `createSettingSection`, avoid `async` wrapper on `Component`, and silently fallback on missing locales in `registerTrads`

### Description
In Strapi v5 (`5.39+` / `5.59.0`), `strapi-5-sitemap-plugin` has three admin registration issues in `admin/src/index.ts`:
1. **Settings Route Double Prefix**: `app.createSettingSection` is called with `to: `/settings/${PLUGIN_ID}``. Because Strapi v5 automatically prefixes setting links with `/settings/`, use of a leading `/settings/` produces `/settings/settings/strapi-5-sitemap-plugin`. It should be `to: `${PLUGIN_ID}``.
2. **Async `Component` Factory**: `Component: async () => { const component = await import(...); return component; }` should be a synchronous function returning a Promise (`Component: () => import('./pages/App')`).
3. **Noisy `console.warn` in `registerTrads`**: When a host Strapi project enables locales not yet bundled in `admin/src/translations/` (e.g., `es`, `ar`, `tr`), `registerTrads` logs `console.warn('[strapi-5-sitemap-plugin] Could not load translations for locale ...')` for every unbundled locale on every page refresh instead of silently returning `{ data: {}, locale }` (as required by Strapi's plugin template).
```

#### Prompt for Making the PR
```markdown
You are fixing `admin/src/index.ts` and adding `es`, `ar`, and `tr` translations in `strapi-5-sitemap-plugin`:
1. In `admin/src/index.ts`:
   - In `app.createSettingSection`, change `to: `/settings/${PLUGIN_ID}`` to `to: `${PLUGIN_ID}``.
   - Change `Component: async () => { ... }` to `Component: () => import('./pages/App')`.
   - In `registerTrads`, remove the `console.warn` inside the `catch` block and cleanly return `{ data: {}, locale }`.
2. Add complete `es.json`, `ar.json`, and `tr.json` translation dictionaries under `admin/src/translations/` matching all keys in `admin/src/translations/en.json`.
3. Rebuild the plugin (`npm run build`) and verify `dist/` output.
```

---

### Patch A4, A5 & A6 — `@strapi/content-manager` / `@strapi/admin` Primitive Input `attribute` DOM Leak, `useRBAC` Warning & React Router v7 Future Flags
- **File**: [`backend/src/admin/vite.config.ts#L63-L102`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L63-L102)
- **Affected Packages**: `@strapi/content-manager` (`5.59.0`) & `@strapi/admin` (`5.59.0`)
- **Reason**:
  - **Patch A4 (Why stripping `attribute` in `@strapi/admin`'s `FormInputs/Renderer.tsx` is safe and does NOT affect custom fields)**:
    - In `@strapi/content-manager/src/pages/EditView/components/InputRenderer.tsx`:
      - **Lines 91–101**: Custom fields (`if (attributeHasCustomFieldProperty(props.attribute))`) are rendered directly via `<CustomInput {...props} {...field} hint={hint} disabled={fieldIsDisabled} />`. They **never** go through `@strapi/admin`'s `FormInputs/Renderer.tsx` (except when a custom field is unregistered/missing on line 102, which renders `NotSupportedField`), so **custom fields continue to receive `attribute` as documented**.
      - **Lines 180–203**: Non-custom standard fields (`case 'enumeration':` and `default:` for `string`, `text`, `email`, `integer`, `decimal`, `float`, `date`, `boolean`, etc.) delegate to `@strapi/admin`'s generic `InputRenderer` (`packages/core/admin/admin/src/components/FormInputs/Renderer.tsx`). On line 194 of `@strapi/content-manager`'s `InputRenderer.tsx`, the code has:
        ```ts
        // These props are not needed for the generic form input renderer.
        const { unique: _unique, mainField: _mainField, ...restProps } = props;
        ```
        It strips `unique` and `mainField` before calling `@strapi/admin`'s `InputRenderer`, **but forgets to strip `attribute`**!
      - Then in `@strapi/admin/src/components/FormInputs/Renderer.tsx` (which only renders built-in primitive inputs like `StringInput` and `TextareaInput`, never custom fields), `StringInput` (`String.tsx`) and `TextareaInput` (`Textarea.tsx`) destructure `{ name, required, label, hint, labelAction, ...props }` and spread `{...props}` directly onto `@strapi/design-system`'s `<TextInput>` / `<Textarea>`, leaking `attribute="[object Object]"` onto the underlying DOM `<input>` / `<textarea>` elements.
  - **Patch A5 (`hooks/useRBAC.mjs`)**: Internal Strapi callers invoke `useRBAC(permissionsObject)` with an object instead of an array, triggering `warnOnce('useRBAC: The first argument should be an array of permissions, not an object. This will be deprecated in the future.')`.
  - **Patch A6 (`core/apis/router.mjs` & `StrapiApp.mjs`)**: `createBrowserRouter(routes, opts)` and `<RouterProvider router={router} />` do not set React Router v6 `future: { v7_relativeSplatPath: true, v7_startTransition: true }`, logging two React Router v7 migration warnings on every page load.

#### GitHub Issue Text (for `strapi/strapi` — `@strapi/content-manager` & `@strapi/admin`)
```markdown
**Title:** fix(content-manager,admin): strip `attribute` before forwarding primitive fields to `FormInputs/Renderer`, enable React Router v7 future flags, and migrate internal `useRBAC` callers

### Description
In Strapi v5 (`v5.59.0`), three prop-forwarding / console warning issues occur out of the box on a clean Strapi v5 admin boot:
1. **`attribute="[object Object]"` Leaking onto Native DOM `<input>` / `<textarea>` Elements**:
   - In `packages/core/content-manager/admin/src/pages/EditView/components/InputRenderer.tsx`, custom fields are rendered early (lines 91–101: `<CustomInput {...props} ... />`) and rightly receive `props.attribute`.
   - However, in the `case 'enumeration':` (line 181) and `default:` (line 194: `// These props are not needed for the generic form input renderer. const { unique: _unique, mainField: _mainField, ...restProps } = props;`) branches for built-in primitive fields, `attribute` is NOT stripped before forwarding `restProps` to `@strapi/admin`'s generic `FormInputs/Renderer.tsx`.
   - Because `@strapi/admin`'s `FormInputs/String.tsx`, `Textarea.tsx`, `Email.tsx`, etc. spread `...props` onto `@strapi/design-system` inputs, `attribute="[object Object]"` is written directly onto the HTML `<input>` and `<textarea>` DOM nodes.
2. **React Router v7 Future Flag Warnings**:
   - `packages/core/admin/admin/src/core/apis/router.ts` calls `createBrowserRouter(routes, opts)` without `future: { v7_relativeSplatPath: true }`.
   - `packages/core/admin/admin/src/StrapiApp.tsx` renders `<RouterProvider router={router} />` without `future={{ v7_startTransition: true }}`.
3. **Internal `useRBAC` Object Deprecation Warning**:
   - Internal admin views still pass a permissions map object to `useRBAC`, triggering `useRBAC: The first argument should be an array of permissions, not an object.` in the console.
```

#### Prompt for Making the PR
```markdown
In the `strapi/strapi` monorepo:
1. **Keep `attribute` on Custom Fields, Strip `attribute` for Generic Primitive Inputs**:
   - In `packages/core/content-manager/admin/src/pages/EditView/components/InputRenderer.tsx`:
     - Leave the custom-field branch (`if (attributeHasCustomFieldProperty(props.attribute)) { return <CustomInput {...props} ... /> }`) untouched so custom fields continue to receive `attribute`.
     - In `case 'enumeration':` and `default:` (where `// These props are not needed for the generic form input renderer` already strips `unique` and `mainField` before rendering `@strapi/admin`'s `<InputRenderer>`), also destructure `attribute: _attribute` out of `props` so `attribute` is not forwarded to the generic primitive input renderer.
     - (Defense-in-depth) In `packages/core/admin/admin/src/components/FormInputs/Renderer.tsx` (which only renders primitive inputs `StringInput`, `TextareaInput`, etc., and never renders custom fields), destructure `attribute: _attribute` out of `props` before spreading `{...props}` to the primitive input components.
2. **Enable React Router v7 Future Flags**:
   - In `packages/core/admin/admin/src/core/apis/router.ts`, pass `future: { v7_relativeSplatPath: true, ...opts?.future }` to `createBrowserRouter(routes, opts)`.
   - In `packages/core/admin/admin/src/StrapiApp.tsx`, pass `future={{ v7_startTransition: true }}` to `<RouterProvider router={router} />`.
3. **Migrate Internal `useRBAC` Callers**:
   - Update remaining internal callers of `useRBAC` that pass an object map so they pass `Object.values(permissions).flat()` as an array.
```

---

### Patch B1 — `@strapi/i18n` `ai-localization-jobs` Returning `404 Not Found` When Disabled
- **File**: [`backend/src/bootstrap/plugin-patches.ts#L28-L55`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L28-L55) & [`L300-L334`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L300-L334)
- **Affected Package**: `@strapi/i18n` (`5.59.0`)
- **Reason**: When opening any localized entry in the Content Manager, the admin UI requests `GET /i18n/ai-localization-jobs/collection-types/:model/:documentId` (or `/single-types/:model`). When AI localizations are disabled (`await aiLocalizationsService.isEnabled() === false`), the server controller calls `return ctx.notFound()`, causing the browser to log a red `404 Not Found` network error on every Edit View load.

#### GitHub Issue Text (for `strapi/strapi` — `@strapi/i18n`)
```markdown
**Title:** fix(i18n): return `200 { data: null }` instead of `404 Not Found` in `ai-localization-jobs` when AI localizations are disabled

### Description
Whenever an editor opens an i18n-enabled entry in the Content Manager in Strapi v5 (`v5.59.0`), the admin frontend polls `/i18n/ai-localization-jobs/collection-types/:model/:documentId` (or `/single-types/:model`).

In `@strapi/i18n` (`server/src/controllers/ai-localization-jobs.ts`), both `getJobForSingleType` and `getJobForCollectionType` check:
```ts
if ((await aiLocalizationsService.isEnabled()) === false) {
  return ctx.notFound();
}
```
Because AI Localization is disabled by default on self-hosted instances, this produces a red `GET .../i18n/ai-localization-jobs/... 404 (Not Found)` error in the browser DevTools console on every single Content Manager Edit View mount.

### Expected Behavior
Return `ctx.body = { data: null }` (HTTP `200 OK`) when `aiLocalizationsService.isEnabled() === false` (or when no job exists), so the admin UI cleanly sees no active AI localization job without logging 404 network errors.
```

#### Prompt for Making the PR
```markdown
In `packages/plugins/i18n/server/src/controllers/ai-localization-jobs.ts`:
1. In `getJobForSingleType` and `getJobForCollectionType`, replace:
   ```ts
   if ((await aiLocalizationsService.isEnabled()) === false) {
     return ctx.notFound();
   }
   ```
   with:
   ```ts
   if ((await aiLocalizationsService.isEnabled()) === false) {
     ctx.body = { data: null };
     return;
   }
   ```
2. Update unit tests in `packages/plugins/i18n` to assert `ctx.body` is `{ data: null }` when `isEnabled()` returns `false`.
```

---

### Patch B2 — `@strapi/content-manager` Field `placeholder` Localization
- **File**: [`backend/src/bootstrap/plugin-patches.ts#L98-L212`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L98-L212)
- **Affected Package**: `@strapi/content-manager` (`5.59.0`)
- **Reason**: `@strapi/content-manager` localizes `field.label` in `FormLayout.tsx`, `FormInputs/Component/NonRepeatable.tsx`, and `FormInputs/Component/Repeatable.tsx` using `formatMessage({ id: 'content-manager.content-types.<uid>.<field>', defaultMessage: field.label })`, but passes `field.placeholder` raw without calling `formatMessage`. As a result, field placeholders configured in `metadatas.<field>.edit.placeholder` cannot be translated via admin i18n keys (`content-manager.content-types.<uid>.<field>.placeholder` and `content-manager.components.<uid>.<field>.placeholder`).

#### GitHub Issue Text (for `strapi/strapi` — `@strapi/content-manager`)
```markdown
**Title:** feat(content-manager): localize field `placeholder` via `formatMessage` alongside `label` in `FormLayout` and `Component` inputs

### Description
In `@strapi/content-manager`, `FormLayout.tsx`, `FormInputs/Component/NonRepeatable.tsx`, and `FormInputs/Component/Repeatable.tsx` pass `field.label` through `formatMessage`:
- `content-manager.content-types.${modelUid}.${field.name}`
- `content-manager.components.${attribute.component}.${field.name}`

However, `field.placeholder` is passed directly without `formatMessage`, making it impossible for multilingual Strapi admin panels to localize field placeholders via `src/admin/app.tsx` translations.

### Proposed Solution
Pass `field.placeholder` (when non-empty) through `formatMessage` using:
- `content-manager.content-types.${modelUid}.${field.name}.placeholder`
- `content-manager.components.${attribute.component}.${field.name}.placeholder`
with `defaultMessage: field.placeholder`.
```

#### Prompt for Making the PR
```markdown
In `packages/core/content-manager/admin/src/pages/EditView/components`:
1. In `FormLayout.tsx`, add a `getPlaceholder(name: string, placeholder?: string)` helper that calls `formatMessage({ id: `content-manager.content-types.${modelUid}.${name}.placeholder`, defaultMessage: placeholder })` when `placeholder` is truthy, and pass `placeholder: getPlaceholder(field.name, field.placeholder)` in the mapped field object.
2. In `FormInputs/Component/NonRepeatable.tsx` and `FormInputs/Component/Repeatable.tsx`, compute `translatedPlaceholder` via `formatMessage({ id: `content-manager.components.${componentUid}.${field.name}.placeholder`, defaultMessage: field.placeholder })` when `field.placeholder` is truthy, and pass `placeholder: translatedPlaceholder` to `<InputRenderer />`.
3. Add unit tests verifying that custom translation keys for `.placeholder` are rendered in the Edit View.
```

---

### Patch B3 — `strapi-plugin-preview-button` `listViewColumn` Default (`true`) & Deprecated `noBorder` Prop on `<IconButton>`
- **File**: [`backend/src/bootstrap/plugin-patches.ts#L59-L83`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L59-L83) & [`L336-L359`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L336-L359)
- **Affected Plugin**: `strapi-plugin-preview-button` (`^3.0.2`)
- **Reason**:
  1. Per the [`strapi-plugin-preview-button` documentation](https://github.com/mattmilburn/strapi-plugin-preview-button#plugin-options), `pluginOptions['preview-button'].listViewColumn` defaults to `true`. However, `admin/src/contentManagerHooks/addPreviewColumn.tsx` checks `get(layout, ['options', PLUGIN_ID, 'listViewColumn'], false) === true`, while `server/src/index.ts` has no `bootstrap` hook to set `pluginOptions['preview-button'].listViewColumn = true` on content types configured in `plugin::preview-button.contentTypes`.
  2. In `admin/src/components/ListViewColumn/index.tsx` (lines 89 and 111), both `<IconButton>` components pass the deprecated Design System v1 `noBorder` prop, which `@strapi/design-system` v2 forwards onto the DOM `<button>` element (`Warning: React does not recognize the noBorder prop on a DOM element`).

#### GitHub Issue Text (for `mattmilburn/strapi-plugin-preview-button`)
```markdown
**Title:** fix: default `listViewColumn` to `true` for configured content types and remove deprecated `noBorder` prop in `ListViewColumn`

### Description
In `strapi-plugin-preview-button@3.0.2` on Strapi v5, there are two issues with the Content Manager List View column:

1. **`listViewColumn` does not default to `true` for configured `contentTypes`**:
   - Per the [Plugin Options documentation](https://github.com/mattmilburn/strapi-plugin-preview-button#plugin-options) and `MIGRATION.md`, `pluginOptions['preview-button'].listViewColumn` is supposed to default to `true` for configured content types unless explicitly disabled with `listViewColumn: false` in the content-type `schema.json`.
   - On the frontend (`admin/src/contentManagerHooks/addPreviewColumn.tsx`), `addPreviewColumn` checks:
     ```ts
     const isSupported = get(layout, ['options', PLUGIN_ID, 'listViewColumn'], false) === true;
     ```
   - On the backend (`server/src/index.ts`), there is no `bootstrap` lifecycle method populating `pluginOptions['preview-button'].listViewColumn = true` for the UIDs listed in `plugin::preview-button`'s `contentTypes` config. As a result, `layout.options['preview-button']` is `undefined` and the Preview column never renders unless `"pluginOptions": { "preview-button": { "listViewColumn": true } }` is manually added to every `schema.json`.

2. **Deprecated Design System v1 `noBorder` prop on `<IconButton>` in `ListViewColumn`**:
   - In `admin/src/components/ListViewColumn/index.tsx` (lines 89 and 111), both `<IconButton>` elements pass `noBorder`.
   - In `@strapi/design-system` v2 (Strapi v5), `noBorder` was removed from `IconButton` and is spread onto the underlying `<button>` DOM node, logging `Warning: React does not recognize the noBorder prop on a DOM element` in the browser console.
```

#### Prompt for Making the PR
```markdown
In `strapi-plugin-preview-button`:
1. Create `server/src/bootstrap.ts` that retrieves the plugin config via `getService('config').get()` and, for each `{ uid }` in `config.contentTypes`, sets `contentType.pluginOptions[PLUGIN_ID].listViewColumn` to `get(contentType, ['pluginOptions', PLUGIN_ID, 'listViewColumn'], true)` so it defaults to `true` while respecting any explicit `listViewColumn: false` in `schema.json`.
2. Export `bootstrap` in `server/src/index.ts`.
3. Remove the deprecated `noBorder` prop from both `<IconButton>` components in `admin/src/components/ListViewColumn/index.tsx`.
4. Add unit tests for `server/src/bootstrap.ts` and verify `yarn test`, `yarn lint`, `yarn format`, and `yarn build`.
```

---

### Patch B4 — `strapi-plugin-navigation` Excluding `plugin::*` Content Types from Shortcut Links & Dropdowns
- **File**: [`backend/src/bootstrap/plugin-patches.ts#L215-L239`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L215-L239)
- **Affected Plugin**: `strapi-plugin-navigation` (`^3.3.7`)
- **Reason**: In `strapi-plugin-navigation`'s admin UI, the check that enables the "Go to Content Manager" shortcut link on navigation item cards and populates content-type filters checks `uid?.includes("api::")` and `["api::", ...]` exclusively. When navigation items link to plugin-provided collection types (`plugin::events.event`, `plugin::donations.campaign`, `plugin::resources.publication`, `plugin::media-feeds.media-item`), the Content Manager shortcut icon is hidden or disabled.

#### GitHub Issue Text (for `VirtusLab-Open-Source/strapi-plugin-navigation`)
```markdown
**Title:** feat(admin): support `plugin::*` content types alongside `api::*` for Content Manager shortcut links and selectable content types

### Description
In `strapi-plugin-navigation` (`v3.3.7`), when a navigation item is attached to a content type provided by a Strapi plugin (e.g., `plugin::events.event` or `plugin::resources.publication`), the admin UI hides the Content Manager redirection link on the navigation item card because the UID check only allows `uid?.includes("api::")`.

Similarly, content-type prefix filtering in the settings/admin state defaults to `["api::"]` instead of `["api::", "plugin::"]`.

### Expected Behavior
Navigation items linked to visible `plugin::*` collection/single types should display the Content Manager shortcut icon and navigate to `/content-manager/collection-types/<uid>/<documentId>` just like `api::*` content types.
```

#### Prompt for Making the PR
```markdown
In `strapi-plugin-navigation` (`admin/src`):
1. Locate where content-type UIDs are checked for `uid?.includes("api::")` (in navigation item card rendering and content-type prefix filters).
2. Update the check to allow both `api::` and `plugin::` UIDs: `Boolean(uid?.includes("api::") || uid?.includes("plugin::"))`, and include `"plugin::"` alongside `"api::"` in the allowed prefix list for visible Content Manager types.
3. Add a unit test verifying that a navigation item linked to `plugin::events.event` renders the Content Manager shortcut button.
```

---

### Patch C1 — `strapi-plugin-content-manager-organizer` Filtering System Plugins & Disambiguating Duplicate `singularName`s
- **File**: [`backend/src/bootstrap/content-manager-organizer.ts#L100-L185`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/content-manager-organizer.ts#L100-L185)
- **Affected Plugin**: `strapi-plugin-content-manager-organizer` (`^2.0.3`)
- **Reason**:
  1. `contentTypes.getContentTypes()` returns internal system plugin models (`plugin::i18n.locale`, `plugin::upload.file`, `plugin::upload.folder`, `plugin::navigation.*`, `plugin::content-manager-organizer.*`, `plugin::email-designer-5.*`, etc.) even when `pluginOptions['content-manager'].visible === false`.
  2. Group items are matched by `singularName` rather than `uid`. When two plugins define a model with the same `singularName` (such as `plugin::donations.campaign` and `plugin::broadcasts.campaign`, both having `singularName: "campaign"`), they collide in the organizer tree.

#### GitHub Issue Text (for `strapi-plugin-content-manager-organizer`)
```markdown
**Title:** fix(server): respect `pluginOptions['content-manager'].visible === false` and prevent collisions when two plugins share a `singularName`

### Description
In `strapi-plugin-content-manager-organizer` (`v2.0.3`):
1. `service('contentTypes').getContentTypes()` includes internal Strapi/plugin models (such as `plugin::i18n.locale`, `plugin::upload.file`, `plugin::content-releases.*`, and models with `pluginOptions['content-manager'].visible === false`), cluttering the Content Manager sidebar and organizer tree with non-editable internal tables.
2. Group `items` are matched using `singularName` alone instead of `uid` (or a qualified `<plugin>.<singularName>` identifier). When two plugins register content types with the same `singularName` (for example, `plugin::donations.campaign` and `plugin::broadcasts.campaign`), they collide and cannot be placed in separate sidebar groups.

### Expected Behavior
1. Exclude any content type where `schema.pluginOptions?.['content-manager']?.visible === false` as well as internal system plugin namespaces (`upload`, `i18n`, `content-releases`, `review-workflows`, `content-manager-organizer`, etc.).
2. Support full `uid` or `<pluginPrefix>.<singularName>` in group `items` when `singularName` is not unique across registered content types.
```

#### Prompt for Making the PR
```markdown
In `strapi-plugin-content-manager-organizer`:
1. In `server/src/services/contentTypes.ts` (`getContentTypes`):
   - Filter out content types where `schema?.pluginOptions?.['content-manager']?.visible === false` or `schema?.__schema__?.pluginOptions?.['content-manager']?.visible === false`.
   - Filter out internal system plugin prefixes (`upload`, `i18n`, `content-releases`, `review-workflows`, `content-manager-organizer`, `cloud`, `seo`, `navigation`, `publisher`, `notes`, `email-designer-5`, `strapi-5-sitemap-plugin`).
   - Detect when multiple content types share the same `singularName` and qualify `singularName` as `<pluginPrefix>.<singularName>` (or allow matching by full `uid` in both server and admin sidebar tree matching).
2. Add tests covering hidden `pluginOptions['content-manager'].visible = false` models and duplicate `singularName` models across plugins.
```

---

## 3. Gradual Patch Removal Checklist (`TODO(upstream-patch-removal)`)

Each item below corresponds to a `TODO(upstream-patch-removal)` comment added in the codebase. When an upstream package releases a fix and is upgraded in `package.json`:

- [ ] **Step 1 — `strapi-5-sitemap-plugin` (settings route & silent locale fallback)**:
  - Remove the `TODO(Patch A2)` and `TODO(Patch A3)` blocks in [`backend/src/admin/vite.config.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L31-L44) and remove `strapi-5-sitemap-plugin` from `ADMIN_BUNDLE_PATCH_PATTERN`.
- [ ] **Step 2 — `@strapi/admin` (`InputRenderer`, `useRBAC`, React Router v7 flags)**:
  - Remove `TODO(Patch A4)`, `TODO(Patch A5)`, `TODO(Patch A6a)`, and `TODO(Patch A6b)` in [`backend/src/admin/vite.config.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/admin/vite.config.ts#L46-L85). Once Steps 1–2 are complete, `normalizeAdminBundlesVitePlugin` can be removed entirely from `vite.config.ts`.
- [ ] **Step 3 — `@strapi/i18n` (`ai-localization-jobs` 200 `{ data: null }` when disabled)**:
  - Remove `TODO(Patch B1a)` and `TODO(Patch B1b)` in [`backend/src/bootstrap/plugin-patches.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L28-L55).
- [ ] **Step 4 — `@strapi/content-manager` (native `field.placeholder` localization)**:
  - Remove `TODO(Patch B2)` in [`backend/src/bootstrap/plugin-patches.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L98-L212).
- [ ] **Step 5 — `strapi-plugin-preview-button` (`listViewColumn` default `true` & `noBorder` removal)**:
  - Remove `TODO(Patch B3a)` and section 4 (`noBorder` dist chunk patch) in [`backend/src/bootstrap/plugin-patches.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L59-L83).
- [ ] **Step 6 — `strapi-plugin-navigation` (`plugin::*` Content Manager shortcut links)**:
  - Remove `TODO(Patch B4)` in [`backend/src/bootstrap/plugin-patches.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts#L215-L239). Once Steps 3–6 are complete, [`backend/src/bootstrap/plugin-patches.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/plugin-patches.ts) can be deleted completely.
- [ ] **Step 7 — `strapi-plugin-content-manager-organizer` (hidden system plugins & duplicate `singularName` disambiguation)**:
  - Remove `TODO(upstream-patch-removal) [Patch C1]` in [`backend/src/bootstrap/content-manager-organizer.ts`](file:///Users/sjoseluis/Projects/experiments/central-mosque-bogota/backend/src/bootstrap/content-manager-organizer.ts#L100-L185), keeping only the initial default group seed.
