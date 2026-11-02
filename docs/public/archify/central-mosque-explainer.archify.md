# How is the Central Mosque of Bogotá platform architected and verified? {#central-mosque-overview}

The platform pairs an **offline-resilient Astro 7 SSR frontend** on port `4321` with a **Strapi v5 Headless CMS** on port `1337` across four locales (`es`, `en`, `ar`, `tr`).

- Ten Astro Content Layer loaders fetch Strapi v5 REST collections and fall back to deterministic 4-locale mocks when Strapi is unreachable.
- Server-only BFF endpoints validate contact, visit, service-desk, and donation payloads with Zod before forwarding to Strapi.
- Ten custom `@vicacha-strapi/*` plugins provide Tiptap rich text, QR generation, prayer CSV import, and editorial dashboards.
- A single TypeScript runner (`scripts/verify-all.ts`) enforces formatting, lint, types, 98% unit test coverage, Storybook build, and Starlight docs limits.

@answer scope="Central Mosque of Bogotá · Astro 7 SSR · Strapi v5 · 4 Locales (es, en, ar RTL, tr)"
@meta locale=en style=editorial

## How do the frontend, BFF, and CMS connect? {#system-topology}

@architecture id=mosque-topology title="Central Mosque Runtime Topology"
| visitor | Community Visitor | external |
| astro | Astro 7 SSR Server | frontend |
| loaders | Content & API Loaders | backend |
| bff | BFF API Endpoints | security |
| mocks | 4-Locale Mock Store | database |
| islamic | IslamicAPI Service | external |
| strapi | Strapi v5 CMS | backend |
| postgres | PostgreSQL 16 | database |
| visitor > astro | HTTPS SSR | emphasis |
| astro > loaders | getCollection | emphasis |
| astro > bff | POST /api | security |
| loaders > strapi | REST JSON | emphasis |
| loaders > mocks | fallback | dashed |
| loaders > islamic | live loader |
| bff > strapi | bearer token | security |
| strapi > postgres | SQL |

@steps id=topology-steps
| step-visitor | Community Visitor | Requests localized routes in Spanish, English, Arabic RTL, or Turkish. | mosque-topology | visitor |
| step-astro | Astro 7 SSR Server | Renders localized pages using Starwind UI and Tailwind CSS 4 logical properties. | mosque-topology | astro |
| step-loaders | Content & API Loaders | Queries Strapi v5 first and falls back to 4-locale mock fixtures on network error. | mosque-topology | loaders |
| step-bff | BFF API Endpoints | Validates form submissions with Zod and keeps `STRAPI_API_TOKEN` on the server. | mosque-topology | bff |
| step-strapi | Strapi v5 CMS | Manages 17 Content-Types and 10 custom `@vicacha-strapi/*` editorial plugins. | mosque-topology | strapi |

## How do SSR fallback and BFF form submissions execute? {#request-lifecycle}

@sequence id=ssr-bff-flow title="SSR Content Load & BFF Intake Sequence"
| actor browser | Visitor Browser | external |
| actor ssr | Astro 7 SSR & BFF | frontend |
| actor cms | Strapi v5 CMS | backend |
| actor mock | 4-Locale Mock Store | database |
| phase | 1. Resilient SSR Page Render |
| browser | ssr | GET /ar/islam-and-faith | emphasis |
| ssr | cms | GET /api/islam-faith-page?locale=ar |
| cms | ssr | 200 JSON or connection error | return |
| ssr | mock | Read fallback when CMS is offline | dashed |
| mock | ssr | Deterministic Arabic fixture | return |
| ssr | browser | 200 HTML (dir="rtl" lang="ar") | return |
| phase | 2. Server-Only BFF Form Submission |
| browser | ssr | POST /api/visits (JSON payload) | security |
| ssr | cms | POST /api/visit-bookings (Bearer token) | security |
| cms | ssr | 201 Created | return |
| ssr | browser | 200 OK receipt | return |

## How are the 17 Strapi v5 Content-Types and 10 plugins organized? {#cms-domain-matrix}

| Domain | Content-Types & Schemas | Custom Plugins & Capabilities | Resilience & Security |
| --- | --- | --- | --- |
| Global & Prayer | `global-setting`, `prayer-setting`, `health` | `strapi-prayer-csv-importer`, `strapi-hijri-datepicker` | 5-minute TTL cache + Bogotá fallback `{good:Always online}` |
| Institutional & Academy | `about-page`, `islam-faith-page`, `leader`, `article`, `faq` | `strapi-tiptap-editor`, `strapi-Callout`, `strapi-arabic-script-helper` | Sanitized HTML via `sanitize-html` `{good:Zero innerHTML}` |
| Events & Media | `event`, `community-service`, `media-highlight` | `strapi-media-hub`, `strapi-qr-generator` | Normalized media URLs + RSS feed |
| Community & Donations | `contact-page`, `donations-page`, `donation-campaign` | `strapi-mosque-dashboard`, `strapi-csv-exporter`, `strapi-audit-log` | Public read-only role seeded on boot |
| Intake Submissions | `contact-submission`, `visit-booking`, `donation-submission` | Admin CSV export + status workflow | Server-only BFF + Zod validation `{good:Token isolated}` |

## What must pass before merging a pull request? {#verification-checklist}

- [ ] Run `node ./scripts/verify-all.ts` from `central-mosque-bogota/` and confirm every documentation file in `docs/src/content/docs/` stays under 500 lines.
- [ ] Pass `pnpm --filter central-mosque-bogota format:check` (`oxfmt --check`) and `pnpm --filter central-mosque-bogota lint:check` (`eslint . --quiet`).
- [ ] Pass `pnpm --filter central-mosque-bogota check` (`astro check`) with 0 TypeScript or Astro template errors.
- [ ] Pass `pnpm --filter central-mosque-bogota test:coverage` with at least 98% statement coverage across all 92 unit test suites.
- [ ] Verify Arabic (`ar`) pages render with `dir="rtl"` and logical Tailwind properties (`ms-*`, `me-*`, `ps-*`, `pe-*`).
