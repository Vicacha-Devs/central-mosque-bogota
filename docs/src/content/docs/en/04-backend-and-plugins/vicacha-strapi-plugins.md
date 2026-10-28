---
title: 10 Custom @vicacha-devs Extensions & Community Plugin Stack
description: Architecture, REST endpoints, and 4-locale admin internationalization of the 10 @vicacha-devs domain plugins and companion Strapi v5 plugins.
---

## 1. Custom `@vicacha-devs` Plugin Ecosystem Overview

In addition to core Strapi v5 schemas, `backend/package.json` integrates **10 purpose-built `@vicacha-devs/strapi-plugin-*` extensions** (located in `../../strapi-v5-extensions/packages/`):

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
| `@vicacha-devs/strapi-plugin-broadcasts` | `broadcasts` | `/api/broadcasts/*` | `fetchBroadcastsFromStrapi`, `POST /api/submissions` (`newsletter-subscription`) |
| `@vicacha-devs/strapi-plugin-calendar` | `calendar` | `/api/calendar/*` | Hijri (`islamic-umalqura`) observance synchronization with `QiblaAndObservancesSection` |
| `@vicacha-devs/strapi-plugin-certificates` | `certificates` | `/api/certificates/*` | Official Mosque Ed25519-signed certificate generation & verification (Shahada, Nikah, Donations) |

---

## 3. Companion Editorial, Caching & Search Plugins (`backend/config/plugins.ts`)

| Package | Version | Role & 4-Locale (`en`, `es`, `ar`, `tr`) Admin Support |
| :--- | :--- | :--- |
| `strapi-cache` | `^1.13.0` | LRU / Redis / Valkey REST API cache with automatic invalidation on content updates and native `en`, `es`, `ar`, `tr`, and `de` Admin UI translations |
| `strapi-global-search` | `2.x` (`file:`) | Spotlight `Cmd/Ctrl + K` global search across all `api::*` and `plugin::*` content types (`en`, `es`, `ar`, `tr`, `fr`) |
| `@notum-cz/strapi-plugin-tiptap-editor` | `file:` | TipTap v3 + Edifice IO WYSIWYG editor with 48 features and relational media/link sync (`en`, `es`, `ar`, `tr`, +7 locales) |
| `@notum-cz/strapi-plugin-seo` | `file:` | SEO metadata component & live SERP analyzer (`en`, `es`, `ar`, `tr`, `fr`, `pt-BR`) |
| `@juadariasmar/strapi-plugin-typesense` | `^1.0.0` | Real-time Typesense search indexing across localized collections |
| `strapi-plugin-navigation` | `^3.3.7` | Hierarchical header/footer menu builder supporting both `api::*` and `plugin::*` items |
| `strapi-plugin-content-manager-organizer` | `^2.0.3` | Groups the 28 visible collection and single types into 8 logical sidebar folders |
| `strapi-plugin-email-designer-5` | `^0.0.10` | Visual Unlayer template designer for transactional notification emails |
| `strapi-5-sitemap-plugin` | `^1.0.8` | Dynamic multilingual XML sitemap generation |
| `strapi-plugin-publisher` | `^2.0.9` | Scheduled publish/unpublish automation |
| `strapi-plugin-config-sync` | `^3.2.0` | Exports/imports Strapi configuration across environments (`en`, `es`, `ar`, `tr`, +18 locales) |
| `@frameless/preview-button` & `@frameless/strapi-plugin-notes` | `^2.2.2` / `^1.1.2` | Live frontend preview button & editorial notes (`es`, `ar`, `tr` injected via `src/admin/translations.ts`) |
