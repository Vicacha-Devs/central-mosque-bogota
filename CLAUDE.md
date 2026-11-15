# CLAUDE.md — Central Mosque of Bogotá (`central-mosque-bogota`)

## Project Overview

Full-stack multilingual (`es`, `en`, `ar`, `tr`) web platform and bilingual (`en`, `es`) documentation monorepo for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**:
- **`apps/frontend/`**: Astro 7 SSR application (`@astrojs/node`), Tailwind CSS v4, Starwind UI, `@sensinum/astro-strapi-loader` (`src/content.config.ts` & `src/services/strapi/loader.ts`), typed Strapi v5 REST client (`src/services/strapi/api.ts`), `@vicacha-devs/astro-tiptap-blocks` (`TiptapContent.astro`), and IslamicAPI integration (`src/services/islamicAPI/`).
- **`apps/backend/`**: Strapi v5 (`5.61.1`) Headless CMS with 9 site-specific content schemas (`src/api/`), 7 shared components (`src/components/`), `strapi-cache` (`^1.13.0`), 15 custom `@vicacha-devs/strapi-plugin-*` domain and editorial extensions (including `tiptap-editor`, `seo`, `sitemap`, `global-search`, and `notes`), and Cloudinary media uploads.
- **`apps/docs/`**: Bilingual (`en` / `es`) Astro Starlight documentation portal with **Pele** (`https://pele.run/`) SVG Mermaid diagrams, **Archify** standalone HTML diagrams (`apps/docs/public/archify/`), and **TypeDoc** API reference generation.

---

## Architectural & Security Rules

1. **Rich Text Rendering (`@vicacha-devs/astro-tiptap-blocks`)**:
   - Always render Strapi Tiptap rich text content using `<TiptapContent content={...} />` (`apps/frontend/src/components/data/display/TiptapContent/TiptapContent.astro`), which delegates to `<TiptapBlocks />` from `@vicacha-devs/astro-tiptap-blocks` with zero raw `set:html`.
2. **Strapi Data Loading & Offline Mocks**:
   - Content Layer collections in `apps/frontend/src/content.config.ts` use `createStrapiCollectionLoader` and `createStrapiSingleTypeLoader` from `apps/frontend/src/services/strapi/loader.ts`.
   - Direct SSR queries in `apps/frontend/src/services/strapi/api.ts` and Content Layer loaders must gracefully fall back to deterministic 4-locale mocks in `apps/frontend/src/utils/*-mocks.ts` when Strapi is unreachable so local development and CI tests never fail offline.
3. **RTL & Multilingual Parity (`es`, `en`, `ar`, `tr`)**:
   - Use logical Tailwind properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `border-s-*`, `text-start`) so Arabic (`ar`, `dir="rtl"`) layouts mirror automatically.
   - Maintain 100% key parity across `apps/frontend/src/i18n/locales/{es,en,ar,tr}.ts`.
4. **Documentation Line Limit & Verification**:
   - Keep every markdown file in `apps/docs/src/content/docs/` `<= 500 lines`.
   - Run `pnpm verify` (`node ./scripts/verify-all.ts`) to validate doc line limits, `oxfmt --check`, `eslint`, `astro check`, `vitest --project=unit --run --coverage`, `astro build`, `storybook build`, and `docs` build.
