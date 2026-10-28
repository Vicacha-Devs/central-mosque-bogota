# Strapi v5 Patches & Upstream Tracking

Every build-time Vite transform, `dist/` bundle patch, and runtime service patch in the **Central Mosque of Bogotá** backend, why it exists, which upstream package owns the fix, and how to remove it. The upstream fixes are already submitted as PRs from our forks; this file tracks what is left to do once they are **merged and released**.

Each patch is marked in the code with a `TODO(upstream-patch-removal)` comment carrying its ID (for example `Patch B2`).

**Status legend**: ⏳ PR open in fork, waiting for merge + release · ✅ released and patch removed

---

## 1. Patch Inventory

| ID | Location | Upstream package | Root cause | Status |
| :-- | :-- | :-- | :-- | :-: |
| **A1** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `@frameless/strapi-plugin-env-label` `^1.0.3`, `@frameless/strapi-plugin-notes` `^1.1.2` | Both bundle their own copy of `styled-components` inside `dist/admin/index.js` instead of externalizing it, so several instances initialize at runtime. | ⏳ |
| **A2** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `strapi-5-sitemap-plugin` `^1.0.8` | Ships only `en.json` and `console.warn`s in `registerTrads` for every other admin locale instead of falling back silently. | ⏳ |
| **A3** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `strapi-5-sitemap-plugin` `^1.0.8` | Settings link uses `to: '/settings/<id>'` (Strapi prefixes `/settings/` again, giving `/settings/settings/...`) and `Component: async () =>` instead of `() => import(...)`. | ⏳ |
| **A4** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `@strapi/content-manager`, `@strapi/admin` `5.59.0` | `InputRenderer.tsx` strips `unique` and `mainField` but not `attribute` before the generic `FormInputs/Renderer`, so `attribute="[object Object]"` lands on DOM `<input>`/`<textarea>`. Custom fields are unaffected: they render earlier through `CustomInput`. | ⏳ |
| **A5** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `@strapi/admin` `5.59.0` (`hooks/useRBAC`) | Internal callers pass a permissions object instead of an array, triggering a deprecation warning. | ⏳ |
| **A6** | [`backend/src/admin/vite.config.ts`](./backend/src/admin/vite.config.ts) | `@strapi/admin` `5.59.0` (`router`, `StrapiApp`) | `createBrowserRouter` and `RouterProvider` lack the `v7_relativeSplatPath` and `v7_startTransition` future flags, logging two warnings per page load. | ⏳ |
| **B1** | [`backend/src/bootstrap/plugin-patches.ts`](./backend/src/bootstrap/plugin-patches.ts) | `@strapi/i18n` `5.59.0` (`ai-localization-jobs`) | With AI localizations disabled, the controller returns `404` instead of `200 { data: null }`, logging a red network error on every Edit View. | ⏳ |
| **B2** | [`backend/src/bootstrap/plugin-patches.ts`](./backend/src/bootstrap/plugin-patches.ts) | `@strapi/content-manager` `5.59.0` (`FormLayout`, `NonRepeatable`, `Repeatable`) | `field.label` goes through `formatMessage`, `field.placeholder` does not, so placeholders cannot be translated. | ⏳ |
| **B3** | [`backend/src/bootstrap/plugin-patches.ts`](./backend/src/bootstrap/plugin-patches.ts), [`backend/src/admin/translations.ts`](./backend/src/admin/translations.ts) | `@frameless/preview-button` `^2.2.2`, `@frameless/strapi-plugin-notes` `^1.1.2` | Hardcoded `"Live Preview"` panel title, locale fallback of `"nl"`, and only `en`/`nl` translations shipped. | ⏳ |
| **B4** | [`backend/src/bootstrap/plugin-patches.ts`](./backend/src/bootstrap/plugin-patches.ts) | `strapi-plugin-navigation` `^3.3.7` | Only checks `uid?.includes("api::")`, so `plugin::*` content types lose the Content Manager shortcut and filters. | ⏳ |
| **C1** | [`backend/src/bootstrap/content-manager-organizer.ts`](./backend/src/bootstrap/content-manager-organizer.ts) | `strapi-plugin-content-manager-organizer` `^2.0.3` | Exposes hidden system plugin content types and keys items by `singularName`, so two plugins sharing one (for example `campaign`) collide. | ⏳ |

---

## 2. Plugin Admin Localization (`en`, `es`, `ar`, `tr`)

The admin panel supports four locales. Audit of `backend/package.json` plugins against them:

### No translations at all

Hardcoded English, no `registerTrads`:

- `strapi-5-sitemap-plugin`
- `strapi-plugin-content-manager-organizer`
- `strapi-v5-plugin-populate-deep` is server-only, so it needs nothing.

### Partial translations

| Package | Bundled locales | Missing |
| :-- | :-- | :-- |
| `@frameless/preview-button` | en, nl | es, ar, tr (patched in `translations.ts`) |
| `@frameless/strapi-plugin-notes` | en, nl | es, ar, tr (patched in `translations.ts`) |
| `@frameless/strapi-plugin-env-label` | en, nl | es, ar, tr |
| `@juadariasmar/strapi-plugin-typesense` | en | es, ar, tr |
| `strapi-plugin-publisher` | de, en, fr, nl | es, ar, tr |
| `strapi-plugin-email-designer-5` | de, en, es, fr | ar, tr |
| `strapi-plugin-navigation` | ca, en, es, fr, tr | ar |
| `@strapi/plugin-cloud` | 13 locales incl. es, tr | ar |

### Complete

the 10 `@vicacha-devs/strapi-plugin-*` packages, `@notum-cz/strapi-plugin-seo`, `@notum-cz/strapi-plugin-tiptap-editor`, `strapi-global-search`, `strapi-cache` (since `1.13.0`), `strapi-plugin-config-sync`, `@strapi/plugin-users-permissions`.

### Rules the forks follow

Use these when reviewing or re-doing a PR.

1. `registerTrads` uses a static import map (`en`, `es`, `ar`, `tr`, plus any existing locales). Variable dynamic imports of `./translations/<locale>.json` fail inside pre-bundled `dist/` with `Unknown variable dynamic import`.
2. `addMenuLink` and `addSettingsLink` use `Component: () => import('./pages/App').then((m) => ({ default: m.default ?? m.App }))`, not an `async` wrapper.
3. `useRBAC` receives an array of permissions, not an object (for example in `strapi-plugin-publisher`'s `Action.tsx`).
4. Verify with the plugin build, `tsc --noEmit`, and `registerTrads({ locales: ['en', 'es', 'ar', 'tr'] })` resolving without errors. Commit message: `feat(i18n): add es, ar, and tr admin translations`.

---

## 3. Removal Checklist

When an upstream package releases a fix: bump it in `backend/package.json`, delete the matching `TODO(upstream-patch-removal)` block, and run `pnpm verify`.

- [ ] **A1** `@frameless/strapi-plugin-env-label`, `@frameless/strapi-plugin-notes`: remove the `Patch A1` block in `vite.config.ts` and the `@frameless/strapi-plugin-(env-label|notes)` entry from `ADMIN_BUNDLE_PATCH_PATTERN`.
- [ ] **A2, A3** `strapi-5-sitemap-plugin`: remove the `Patch A2` and `Patch A3` blocks and its entry in `ADMIN_BUNDLE_PATCH_PATTERN`.
- [ ] **A4, A5, A6** `@strapi/admin` and `@strapi/content-manager`: remove `Patch A4`, `A5`, `A6a`, `A6b`. Once A1 to A6 are done, delete `normalizeAdminBundlesVitePlugin` from `vite.config.ts`.
- [ ] **B1** `@strapi/i18n`: remove `Patch B1a` and `B1b` in `plugin-patches.ts`.
- [ ] **B2** `@strapi/content-manager`: remove `Patch B2` in `plugin-patches.ts`.
- [ ] **B3** `@frameless/preview-button`, `@frameless/strapi-plugin-notes`: remove `Patch B3` in `plugin-patches.ts` and `THIRD_PARTY_PLUGIN_TRANSLATIONS` in `src/admin/translations.ts`.
- [ ] **B4** `strapi-plugin-navigation`: remove `Patch B4` in `plugin-patches.ts`. Once B1 to B4 are done, delete `plugin-patches.ts` and its calls in `src/index.ts`.
- [ ] **C1** `strapi-plugin-content-manager-organizer`: remove `Patch C1` in `content-manager-organizer.ts`, keeping only the default group seed.

Also drop the `es`/`ar`/`tr` entries from the localization tables above as each plugin release lands.
