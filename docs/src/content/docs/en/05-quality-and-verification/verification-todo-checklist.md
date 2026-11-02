---
title: Comprehensive Verification TODO Checklist
description: Step-by-step automated and manual verification checklist to confirm all Central Mosque features, locales, RTL layouts, and APIs work as expected.
---

Use this checklist before cutting a release or merging a major feature branch. To run all automated gates in a single command from `central-mosque-bogota/`, execute:

```bash
pnpm verify
```

---

## 1. Automated Static Analysis & Build Gates

- [ ] **Formatting (`oxfmt`)**: `./node_modules/.bin/oxfmt --check` in `frontend/` exits with `0` (all files adhere to the 80-column print width).
- [ ] **Linting (`eslint`)**: `./node_modules/.bin/eslint . --quiet` in `frontend/` exits with `0` errors across `.astro`, `.ts`, `.json`, `.css`, and `.md` files.
- [ ] **TypeScript & Astro Diagnostics (`astro check`)**: `./node_modules/.bin/astro check` reports `0 errors` across all 477+ files.
- [ ] **Unit Test Suite & Coverage (`vitest`)**: `./node_modules/.bin/vitest --project=unit --run --coverage` passes all 92 test files (201+ tests) and exceeds global coverage thresholds:
  - [ ] Statements `>= 80%` (currently **98.26%**)
  - [ ] Branches `>= 90%` (currently **90.93%**)
  - [ ] Functions `>= 95%` (currently **98.96%**)
  - [ ] Lines `>= 80%` (currently **99.28%**)
- [ ] **Production SSR & Static Build (`astro build`)**: `./node_modules/.bin/astro build` succeeds and generates all 65 static localized pages + SSR entrypoints + `sitemap-index.xml`.
- [ ] **Storybook Static Build (`storybook build`)**: `./node_modules/.bin/storybook build` compiles `storybook-static/` with 0 errors.
- [ ] **Documentation Build & Line Limit Gate**: `pnpm --filter @central-mosque-bogota/docs build` generates TypeDoc references, verifies every doc file is `<= 500 lines`, and builds `docs/dist/`.

---

## 2. 4-Locale Routing & Arabic RTL Verification

Start `pnpm dev` in `frontend/` (`http://localhost:4321`) and verify each route in **Spanish (`es`)**, **English (`en`)**, **Arabic (`ar`)**, and **Turkish (`tr`)**:

- [ ] **Root Redirect (`/`)**: Visiting `http://localhost:4321/` redirects cleanly to `/es`.
- [ ] **Homepage (`/[lang]`)**:
  - [ ] `HeroHijri` displays localized Hijri & Gregorian dates.
  - [ ] `UrgentAlertBanner` appears at the top and persists dismissal in `localStorage`.
  - [ ] `DailyPrayTime` highlights the active Bogotá prayer and opens `DailyDuaModal` on click.
  - [ ] `EventSpotlightDock` renders in the bottom corner, switches spotlight tabs, opens the poster lightbox dialog, and minimizes to a pill.
- [ ] **Arabic RTL Mirroring (`/ar`, `/ar/about-us`, `/ar/islam-and-faith`, `/ar/donate`)**:
  - [ ] `<html lang="ar" dir="rtl">` is set on the document root.
  - [ ] Header navigation, LanguagePicker dropdown, breadcrumbs, card borders (`border-s-*`), and form inputs flow right-to-left without horizontal overflow.
- [ ] **Localized Prayer Information SSR Route**:
  - [ ] `/es/horarios-de-oracion`
  - [ ] `/en/prayer-information`
  - [ ] `/ar/مواقيت-الصلاة`
  - [ ] `/tr/namaz-vakitleri`
  - [ ] Clicking **Show More / Show Less** expands and collapses the monthly prayer table (`MonthlyPrayTime`), and **Download PDF** exports a landscape A4 PDF.

---

## 3. Domain Interactive Features Verification

- [ ] **Islam & Faith (`/[lang]/islam-and-faith`)**:
  - [ ] `ScriptureExplorerSection` filters Quran Ayahs and Hadiths by topic.
  - [ ] `TasbihCounterCard` increments counter on click, switches presets (`33` / `99`), and resets cleanly.
  - [ ] `QiblaAndObservancesSection` displays Bogotá Qibla bearing (`65.24° ENE`) and upcoming Hijri dates.
- [ ] **Events & Academy (`/[lang]/events-and-programs` & `/[lang]/events/[slug]`)**:
  - [ ] `EventsCatalogSection` filters events by category and search query.
  - [ ] Clicking **Enroll** on an Academy course opens `CourseEnrollmentForm` modal with the course slug pre-selected.
- [ ] **Community Services (`/[lang]/community-services`)**:
  - [ ] Clicking a service workflow button opens `ServiceDeskIntakeSection` modal and switches dynamic fields for `khutbah`, `nikah`, `janazah`, `shahada`, and `certificate`.
- [ ] **Donations & Zakat (`/[lang]/donate`)**:
  - [ ] `ZakatCalculatorSection` calculates net zakatable wealth and `2.5%` Zakat due against Gold/Silver Nisab thresholds.
  - [ ] `PaymentChannelsSection` copies Bancolombia / Nequi / Bre-B account numbers to the clipboard.
  - [ ] `UtilityInvoicesSection` opens `DonationSubmissionForm` pre-filled with the selected utility bill reference.
- [ ] **Media & Resources (`/[lang]/media`)**:
  - [ ] `MediaArchiveSection` filters items by media type (`video`, `audio`, `document`) and topic.
  - [ ] `PublicationsAndGlossarySection` filters Islamic glossary terms by letter/search and downloads PDF guides.

---

## 4. BFF API Endpoints & Security Verification

- [ ] **`POST /api/submissions`**:
  - [ ] Submitting with a non-empty `website_url` honeypot silently returns `{ ok: true, spamFiltered: true }`.
  - [ ] Submitting invalid email or missing required fields returns `400 Bad Request` with `X-Content-Type-Options: nosniff`.
  - [ ] Valid submissions return `200` (when Strapi is online) or `202` (`mode: "local-fallback"` when Strapi is offline) with a tracking `referenceCode`.
- [ ] **`GET /api/events/feed.ics?lang=es`**: Returns `200 OK` with `Content-Type: text/calendar; charset=utf-8` and valid `BEGIN:VCALENDAR` / `BEGIN:VEVENT` blocks.
- [ ] **`GET /api/media-feeds/rss.xml?lang=es`**: Returns `200 OK` with `Content-Type: application/rss+xml; charset=utf-8` and valid `<rss version="2.0">` XML.
- [ ] **`GET /api/resources/publications/guia-bienvenida-visita-mezquita/download?locale=es`**: Returns `200 OK` with `Content-Type: application/pdf`, `Content-Disposition: attachment`, and valid `%PDF-1.4` bytes; requests with `../` slug traversal return `400 Bad Request`.
