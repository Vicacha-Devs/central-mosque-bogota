# PRODUCT.md — Central Mosque of Bogotá (`apps/frontend`)

## Product Identity
- **Name**: Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)
- **Purpose**: Multilingual (`es`, `en`, `ar`, `tr`) digital sanctuary and community hub for daily prayer schedules, events & programs, Islamic education, media/khutbahs, visitor guidance, and Zakat/donation stewardship in Bogotá, Colombia.
- **Tech Stack**: Astro 7 SSR (`@astrojs/node`), Tailwind CSS v4, Starwind UI, Strapi v5 CMS with deterministic 4-locale offline mocks.

## Audience & Modes
- **Daily Worshippers**: Need instant next-prayer visibility, live countdowns, and `Passed / Now / Up Next` status cues (`Operate`).
- **Community & Students**: Browse events by category or monthly calendar (`Lista | Calendario`), register for Arabic/Quran classes, and watch/read Khutbahs (`Operate` / `Read`).
- **Donors & Zakat Payers**: Calculate Zakat al-Mal / Fitr / Fidyah / Kaffarah in COP with sticky live totals and clear 90%/10% financial transparency (`Persuade` / `Operate`).
- **First-Time Visitors**: Understand mosque etiquette, visiting hours, and TransMilenio transit access (`Read`).

## Core Invariants
1. **RTL & 4-Locale Parity**: All UI uses logical CSS properties (`ps-*`, `pe-*`, `border-e`, `text-start`) and maintains 100% key parity across `es`, `en`, `ar`, and `tr`.
2. **Offline Resilience**: Every CMS-backed surface falls back to deterministic localized mocks when Strapi is unreachable.
3. **Rich Text Safety**: Strapi Tiptap blocks render exclusively via `<TiptapContent />` with zero raw `set:html`.
