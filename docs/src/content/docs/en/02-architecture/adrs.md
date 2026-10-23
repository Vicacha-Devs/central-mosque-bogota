---
title: Architecture Decision Records (ADRs 001–012)
description: Authoritative Architecture Decision Records updated for the Astro 7 SSR + Strapi v5 + Custom Extensions stack.
---

> **Historical Note**: Early February 2026 exploration drafts (`Abu Bakr As-Sidik WebSite/`) evaluated Wagtail/Django. The records below document the **actual production architecture** implemented in `central-mosque-bogota/`.

---

## Summary Matrix (ADRs 001–012)

| ADR | Area | Selected Decision | Status |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Core Stack | **Astro 7 SSR (`@astrojs/node`) + Strapi v5 (`^5.39.0`)** full-stack TypeScript monorepo | Accepted |
| **ADR-002** | Rich Text Security | **`@vicacha-devs/astro-tiptap-blocks`** + `isomorphic-dompurify` (zero `set:html`) | Accepted |
| **ADR-003** | Content Loading | **`@sensinum/astro-strapi-loader`** + Astro Live Collections + 4-locale offline mocks | Accepted |
| **ADR-004** | Localization (i18n) | **4 Locales (`es`, `en`, `ar` RTL, `tr`)** in both Strapi `@strapi/i18n` and Astro routes | Accepted |
| **ADR-005** | Islamic Data Engine | **3-Tier Resolution**: `@vicacha-devs/strapi-plugin-islam` -> `IslamicAPI` -> Bogotá Fallback Mocks | Accepted |
| **ADR-006** | Domain Extensions | **10 Modular `@vicacha-devs/strapi-plugin-*` packages** for Mosque-specific workflows | Accepted |
| **ADR-007** | BFF & Form Security | Server-side Astro API routes (`/api/submissions`, `/api/events/feed.ics`, `/api/media-feeds/rss.xml`, `/api/resources/publications/[slug]/download`) | Accepted |
| **ADR-008** | Database & Media | Dual **SQLite (local) / PostgreSQL 16 (prod)** + **Cloudinary CDN** | Accepted |
| **ADR-009** | UI Primitives | **Tailwind CSS v4** + **Starwind UI** accessible primitives + logical RTL properties | Accepted |
| **ADR-010** | Site Search | Client-hydrated multi-domain index (`SiteSearchSection`) + `@juadariasmar/strapi-plugin-typesense` ready | Accepted |
| **ADR-011** | Quality & Testing | **Vitest 4** + Astro Container API (`>=90%` branch / `>=95%` function coverage) + **Storybook 10** | Accepted |
| **ADR-012** | Documentation | **Astro Starlight** (`en`/`es`) + **Pele** (`https://pele.run/`) SVG diagrams + **TypeDoc** | Accepted |

---

## Detailed Decisions

### ADR-001: Astro 7 SSR + Strapi v5 Full-Stack TypeScript Monorepo
- **Context**: Using a unified TypeScript toolchain across frontend, CMS, and plugins eliminates context switching between Python/Django and TypeScript.
- **Decision**: Adopt Astro 7 (`@astrojs/node` standalone adapter) paired with Strapi v5 (`@strapi/strapi` `^5.39.0`).

### ADR-002: Zero-`set:html` Rich Text Rendering
- **Context**: Rendering raw CMS HTML with `set:html` introduces XSS risks and inconsistent typography.
- **Decision**: Use `@notum-cz/strapi-plugin-tiptap-editor` in Strapi v5 and render blocks in Astro via `<TiptapContent />` (`@vicacha-devs/astro-tiptap-blocks`) backed by `tiptap-sanitizer.ts` (`isomorphic-dompurify`).

### ADR-003: Offline-Resilient Content Layer & Mocks
- **Context**: Frontend developers and CI pipelines must be able to build, test, and preview all 65 static routes and SSR pages without requiring a live Strapi instance or external API keys.
- **Decision**: Wrap `@sensinum/astro-strapi-loader` in `createResilientStrapiLoader` (`src/services/strapi/loader.ts`) and provide comprehensive 4-locale mock datasets in `src/utils/*-mocks.ts`.

### ADR-005: 3-Tier Islamic Data Engine (Prayer Times & Zakat Nisab)
- **Context**: Daily prayer times and Zakat Nisab thresholds are mission-critical for the Mosque community.
- **Decision**: Resolve data in three tiers:
  1. Strapi v5 `@vicacha-devs/strapi-plugin-islam` cached/override endpoint.
  2. Direct `IslamicAPI` v1 call (`prayer-time/`, `zakat-nisab/`).
  3. Deterministic Bogotá astronomical/nisab fallback (`buildFallbackMonth`, `FALLBACK_ZAKAT_NISAB`).

### ADR-007: Backend-for-Frontend (BFF) Endpoints
- **Context**: Submitting forms or downloading PDFs directly from browser JS to Strapi would expose API tokens or CORS surface area.
- **Decision**: Route all browser mutations and binary streams through Astro server endpoints (`src/pages/api/*`) with strict input validation, slug allow-listing (`/^[a-z0-9-]+$/`), magic-byte `%PDF-` verification, and `X-Content-Type-Options: nosniff`.
