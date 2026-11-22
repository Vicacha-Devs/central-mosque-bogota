---
title: 10 Custom @vicacha-devs Extensions & Community Plugin Stack
description: Architecture, REST endpoints, and 4-locale admin internationalization of the 10 @vicacha-devs domain plugins and companion Strapi v5 plugins.
---

## 1. Custom `@vicacha-devs` Plugin Ecosystem Overview

In addition to core Strapi v5 schemas, `apps/backend/package.json` integrates **10 purpose-built `@vicacha-devs/strapi-plugin-*` extensions** (located in `../../strapi-v5-extensions/packages/`):

```mermaid
flowchart TB
  Strapi["Strapi v5 Core (:1337)"] --> P1["strapi-plugin-islam (Prayer, Zakat, Quran, Hadith, Qibla, Ramadan)"]
  Strapi --> P2["strapi-plugin-events (Events, Spotlights, Academy Courses, ICS)"]
  Strapi --> P3["strapi-plugin-donations (Campaigns, Utility Invoices, Receipts)"]
  Strapi --> P4["strapi-plugin-inbox (Contact Messages & 5 Service Desk Workflows)"]
  Strapi --> P5["strapi-plugin-bookings (Guided Tour & Group Visit Scheduling)"]
  Strapi --> P6["strapi-plugin-resources (PDF Publications, Glossary, Photo Galleries)"]
  Strapi --> P7["strapi-plugin-media-feeds (Audio/Video Archive & RSS 2.0 Syndication)"]
  Strapi --> P8["strapi-plugin-broadcasts (WhatsApp/Telegram Channels & Newsletter)"]
  Strapi --> P9["strapi-plugin-calendar (Hijri-Gregorian Observance Calendar)"]
  Strapi --> P10["strapi-plugin-certificates (Shahada, Nikah & Donation Certificates)"]
```

---

## 2. `@vicacha-devs` Plugin Reference & Frontend Integration Matrix

| Plugin Package | Strapi Config Key | REST Prefix | Frontend Consumer (`src/services/strapi/api.ts`) |
| :--- | :--- | :--- | :--- |
| `@vicacha-devs/strapi-plugin-islam` | `islam` | `/api/islam/*` | `fetchIslamSuiteFromStrapi` (`prayerTimesLoader`, `zakatNisabLoader`, `DailyDuaModal`, `FivePillarsSection`, `ScriptureExplorerSection`, `QiblaAndObservancesSection`, `RamadanScheduleBanner`, `UrgentAlertBanner`) |
| `@vicacha-devs/strapi-plugin-events` | `events` | `/api/events/*` | `fetchEventsFromStrapi`, `fetchAcademyCoursesFromStrapi`, `fetchEventSpotlightsFromStrapi`, `GET /api/events/feed.ics` |
| `@vicacha-devs/strapi-plugin-donations` | `donations` | `/api/donations/*` | `fetchUtilityInvoicesFromStrapi`, `POST /api/submissions` (`donation-submission`) |
| `@vicacha-devs/strapi-plugin-inbox` | `inbox` | `/api/inbox/*` | `fetchServiceDeskWorkflowsFromStrapi`, `POST /api/submissions` (`contact-message`, `service-desk-request`) |
| `@vicacha-devs/strapi-plugin-bookings` | `bookings` | `/api/bookings/*` | `POST /api/submissions` (`visit-booking`) |
| `@vicacha-devs/strapi-plugin-resources` | `resources` | `/api/resources/*` | `fetchPublicationsFromStrapi`, `fetchGlossaryFromStrapi`, `fetchPhotoGalleriesFromStrapi`, `GET /api/resources/publications/[slug]/download` |
| `@vicacha-devs/strapi-plugin-media-feeds` | `media-feeds` | `/api/media-feeds/*` | `fetchMediaArchiveFromStrapi`, `GET /api/media-feeds/rss.xml` |
| `@vicacha-devs/strapi-plugin-broadcasts` | `broadcasts` | `/api/broadcasts/*` | `fetchBroadcastsFromStrapi`, `POST /api/submissions` (`newsletter-subscription`), Email (Resend SMTP), Telegram Bot & WhatsApp (`meta-cloud` / self-hosted `rmyndharis/OpenWA`) |
| `@vicacha-devs/strapi-plugin-calendar` | `calendar` | `/api/calendar/*` | Hijri (`islamic-umalqura`) observance synchronization with `QiblaAndObservancesSection` |
| `@vicacha-devs/strapi-plugin-certificates` | `certificates` | `/api/certificates/*` | Official Mosque Ed25519-signed certificate generation, public QR verification, and self-hosted **DocuSeal** e-signatures (`ESIGN_PROVIDER=docuseal`, `send_email: false` branded template `501` via Resend SMTP, `POST /api/certificates/webhooks/docuseal`) |
| `@vicacha-devs/strapi-plugin-notes` | `notes` | `/api/notes/*` | Editorial entity notes (`plugin::notes.note`) with Audit Logs-style author/timestamp metadata, pinned notes, category badges & Global Notes Hub (10 locales) |

---

## 3. Companion Editorial, Caching & Search Plugins (`apps/backend/config/plugins.ts`)

| Package | Version | Role & 4-Locale (`en`, `es`, `ar`, `tr`) Admin Support |
| :--- | :--- | :--- |
| `strapi-cache` | `^1.13.0` | LRU / Redis / Valkey REST API cache with automatic invalidation on content updates and native `en`, `es`, `ar`, `tr`, and `de` Admin UI translations |
| `@vicacha-devs/strapi-plugin-global-search` | `file:` | Spotlight `Cmd/Ctrl + K` global search across all `api::*` and `plugin::*` content types (`en`, `es`, `ar`, `tr`, `fr`) |
| `@vicacha-devs/strapi-plugin-tiptap-editor` | `file:` | TipTap v3 rich text editor with custom presets, theme, field bindings, and relational media/link sync (`en`, `es`, `ar`, `tr`, +7 locales) |
| `@vicacha-devs/strapi-plugin-seo` | `file:` | SEO metadata component, `autoPopulateOnSave` / localized generator hooks (`apps/backend/config/plugins/seo.plugin.ts`), & live SERP/JSON-LD analyzer (`en`, `es`, `ar`, `tr`, `fr`, `pt-BR`) |
| `@juadariasmar/strapi-plugin-typesense` | `^1.0.0` | Real-time Typesense search indexing across localized collections |
| `strapi-plugin-navigation` | `^3.4.2` | Hierarchical header/footer menu builder supporting both `api::*` and `plugin::*` items |
| `src/content-structure/groups.json` | Native | Strapi v5 native content-type sidebar folder grouping synced via `src/bootstrap/content-structure.ts` |
| `strapi-plugin-email-designer-5` | `^0.0.10` | Visual Unlayer template designer for 20 seeded branded transactional & DocuSeal signing emails (`101–104`, `201–204`, `301–304`, `401–404`, `501`, `901–903`) sent over Resend SMTP |
| `strapi-plugin-form-builder-cms` | `1.1.0-rc.2` | Visual form builder synchronized with `@vicacha-devs/strapi-plugin-inbox` (including `file` upload field metadata) |
| `@vicacha-devs/strapi-plugin-sitemap` | `file:` | Dynamic multilingual XML sitemap & sitemap index generator (`en`, `es`, `ar`, `tr`, `fr`, `pt-BR`) |
| `strapi-plugin-publisher` | `^2.0.9` | Scheduled publish/unpublish automation |
| `strapi-plugin-config-sync` | `^3.2.0` | Exports/imports Strapi configuration across environments (`en`, `es`, `ar`, `tr`, +18 locales) |
| `strapi-plugin-preview-button` | `^3.0.2` | Draft preview & live view buttons in Content Manager edit & list views (`en`, `es`, `tr`, `fr`, `ru`, `ja` native + `ar` in `src/admin/translations.ts`) |

---

## 4. Automated SEO Metadata Configuration (`apps/backend/config/plugins/seo.plugin.ts`)

`buildSeoPluginConfig(env)` configures `@vicacha-devs/strapi-plugin-seo` with `autoCreateComponent: true`, `autoPopulateOnSave: true`, and four localized generator hooks (`generateTitle`, `generateDescription`, `generateImage`, `generateURL`) using `PUBLIC_SITE_URL` and per-locale mosque brand names (`es`, `en`, `ar`, `tr`) across all static single types (`homepage`, `about-page`, `islam-faith-page`, `donations-page`, `contact-page`) and collection prefixes (`/articles`, `/services`, `/leaders`, `/events`, `/donations`, `/media`, `/media/series`, `/islam-and-faith`, `/gallery`, `/bookings`).
