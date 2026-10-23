# CLAUDE.md — Central Mosque of Bogotá (`central-mosque-bogota`)

## Project Overview

Full-stack multilingual (`es`, `en`, `ar`, `tr`) web platform and bilingual (`en`, `es`) documentation monorepo for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**:
- **`frontend/`**: Astro 7 SSR application (`@astrojs/node`), Tailwind CSS v4, Starwind UI, `@sensinum/astro-strapi-loader` (`src/content.config.ts` & `src/services/strapi/loader.ts`), typed Strapi v5 REST client (`src/services/strapi/api.ts`), `@vicacha-devs/astro-tiptap-blocks` (`TiptapContent.astro`), and IslamicAPI integration (`src/services/islamicAPI/`).
- **`backend/`**: Strapi v5 (`^5.39.0`) Headless CMS with 17 content schemas, `@notum-cz/strapi-plugin-tiptap-editor`, 10 custom `@vicacha-devs/strapi-plugin-*` domain extensions, and Cloudinary media uploads.
- **`docs/`**: Bilingual (`en` / `es`) Astro Starlight documentation portal with **Pele** (`https://pele.run/`) SVG Mermaid diagrams, **Archify** standalone HTML diagrams (`docs/public/archify/`), and **TypeDoc** API reference generation.

---

## Architectural & Security Rules

1. **Rich Text Rendering (`@vicacha-devs/astro-tiptap-blocks`)**:
   - Always render Strapi Tiptap rich text content using `<TiptapContent content={...} />` (`frontend/src/components/data/display/TiptapContent/TiptapContent.astro`), which delegates to `<TiptapBlocks />` from `@vicacha-devs/astro-tiptap-blocks` with zero raw `set:html`.
2. **Strapi Data Loading & Offline Mocks**:
   - Content Layer collections in `frontend/src/content.config.ts` use `createStrapiCollectionLoader` and `createStrapiSingleTypeLoader` from `frontend/src/services/strapi/loader.ts`.
   - Direct SSR queries in `frontend/src/services/strapi/api.ts` and Content Layer loaders must gracefully fall back to deterministic 4-locale mocks in `frontend/src/utils/*-mocks.ts` when Strapi is unreachable so local development and CI tests never fail offline.
3. **RTL & Multilingual Parity (`es`, `en`, `ar`, `tr`)**:
   - Use logical Tailwind properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `border-s-*`, `text-start`) so Arabic (`ar`, `dir="rtl"`) layouts mirror automatically.
   - Maintain 100% key parity across `frontend/src/i18n/locales/{es,en,ar,tr}.ts`.
4. **Documentation Line Limit & Verification**:
   - Keep every markdown file in `docs/src/content/docs/` `<= 500 lines`.
   - Run `pnpm verify` (`node ./scripts/verify-all.ts`) to validate doc line limits, `oxfmt --check`, `eslint`, `astro check`, `vitest --project=unit --run --coverage`, `astro build`, `storybook build`, and `docs` build.
