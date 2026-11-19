# Product — Central Mosque of Bogotá (`apps/frontend`)

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Daily Worshippers**: Muslims in Bogotá needing instant next-prayer visibility, live countdowns, `Passed / Now / Up Next` status cues, Qibla bearing, and Makruh/solar prayer window awareness.
- **Community & Students**: Families and learners browsing events by category or monthly calendar (`Lista | Calendario`), enrolling in Arabic/Quran classes, booking community services (Nikah, Shahada, Janazah, consular certificates), and watching or reading Khutbahs.
- **Donors & Zakat Payers**: Supporters calculating Zakat al-Mal, Fitr, Fidyah, or Kaffarah in COP with sticky live totals and clear 90%/10% allocation transparency.
- **First-Time Visitors & Institutions**: Schools, universities, and guests looking for mosque etiquette, guided visit booking, and TransMilenio transit directions.

## Product Purpose

Multilingual (`es`, `en`, `ar`, `tr`) digital sanctuary and community hub for the Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq) — delivering accurate daily/monthly prayer schedules, event calendars, Islamic educational resources, multimedia/podcast feeds, community service intake, and transparent donation stewardship.

## Positioning

Purpose-built for Bogotá's Muslim community and Spanish-speaking visitors with full 4-locale parity (`es`, `en`, `ar`, `tr`, including RTL Arabic), Bogotá-specific astronomical/Qibla/Hijri calculations, and deterministic offline fallback so critical prayer times and guidance remain available even when the Strapi v5 CMS is unreachable.

## Operating Context

- **Runtime & Stack**: Astro 7 SSR (`@astrojs/node`), Tailwind CSS v4, Starwind UI, and Strapi v5 CMS (`src/services/strapi`).
- **Daily & Liturgical Workflows**: Live prayer-time schedule (`DailyPrayTime`), monthly prayer calendar (`MonthlyPrayTime`), Qibla compass & Makruh windows (`QiblaAndObservancesSection`), Ramadan Suhoor/Iftar/Taraweeh schedule, and Friday Jumu'ah congregation times.
- **Community Intake & Stewardship**: Service-desk casework intake (`ServiceDeskIntakeSection`), contact & guided visit forms (`ContactAndVisitFormsSection`), Zakat calculator in COP (`ZakatCalculatorSection`), and campaign impact tracking (`DonationImpactSection`).
- **Content & Media**: Strapi Tiptap rich text, downloadable PDF/ePub publications, photo galleries, RSS 2.0 podcast feeds, and `.ics` calendar exports.

## Capabilities and Constraints

- **RTL & 4-Locale Parity**: All UI uses logical CSS properties (`ps-*`, `pe-*`, `border-e`, `text-start`) and maintains 100% key parity across `es`, `en`, `ar`, and `tr`.
- **Offline Resilience**: Every CMS-backed surface falls back to deterministic localized mocks (`src/utils/*.mocks.ts`) when Strapi is unreachable.
- **Rich Text Safety**: Strapi Tiptap blocks render exclusively via `<TiptapContent />` with zero raw `set:html`.
- **Anti-Spam & Form Safety**: Public intake and newsletter forms include honeypot fields and `POST /api/submissions` or `/api/service-desk` handlers.

## Brand Commitments

- **Name**: Central Mosque of Bogotá / Mezquita Central de Bogotá (Mezquita Abu Bakr As-Siddiq).
- **Financial Transparency**: Explicit 90% programs / 10% administration breakdown on donation impact surfaces.
- **Bilingual Jumu'ah**: Bilingual Arabic/Spanish Khutbah (12:15 PM) and prayer (12:45 PM) schedule prominently surfaced.

## Evidence on Hand

- **Design System**: Documented in `apps/frontend/DESIGN.md` and `src/styles/global.css`.
- **Content & Mocks**: Localized collections and deterministic fallbacks in `src/i18n/locales/{es,en,ar,tr}.ts` and `src/utils/`.
- **Automated Verification**: Vitest unit test suite (`pnpm test:unit --run`) and Storybook stories (`*.stories.ts`) across components.

## Product Principles

1. **Clarity for Daily Worship**: Prayer times, active prayer status, and Jumu'ah schedules must be scannable in seconds on both mobile and desktop.
2. **Equal Craft Across 4 Locales**: Spanish, English, Arabic (RTL), and Turkish receive identical functional parity and layout integrity.
3. **Graceful Offline Continuity**: CMS outages must never break prayer schedules, publications, or community guidance.
4. **Transparent Stewardship**: Donation and Zakat flows pair live calculations with explicit program/admin allocation.
5. **Safe & Accessible Web Standards**: Rich text is sanitized through `<TiptapContent />`, numerals use `tabular-nums`, and mobile layouts never force multi-column cramping.

## Accessibility & Inclusion

- Full RTL (`dir="rtl"`) and Arabic typography (`--font-arabic`, `--font-arabic-serif`) support alongside LTR (`es`, `en`, `tr`).
- Keyboard focus-visible outlines, semantic landmarks, `aria-pressed` filter controls, and responsive single-column mobile stacking (`--breakpoint-sm: 40rem`).
