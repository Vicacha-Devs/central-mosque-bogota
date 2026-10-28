# Central Mosque of Bogotá — Astro 7 SSR Frontend (`/frontend`)

Multilingual (`es`, `en`, `ar`, `tr`) SSR web application for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**, built with **Astro 7** (`@astrojs/node`), **Tailwind CSS v4**, **Starwind UI**, [`@sensinum/astro-strapi-loader`](https://github.com/VirtusLab-Open-Source/astro-strapi-loader), and `@vicacha-devs/astro-tiptap-blocks`.

---

## Key Features & Integrations

1. **Resilient Strapi v5 Content Layer & Direct SSR Client (`src/services/strapi/`)**:
   - [`src/content.config.ts`](./src/content.config.ts) & [`src/services/strapi/loader.ts`](./src/services/strapi/loader.ts): Wraps `@sensinum/astro-strapi-loader` with multi-locale fetching (`es`, `en`, `ar`, `tr`), deep population, schema normalization, and automatic offline fallback.
   - [`src/services/strapi/api.ts`](./src/services/strapi/api.ts): Typed Strapi v5 REST client and domain fetchers for articles, events, community services, leadership, FAQs, media highlights, donation campaigns, utility invoices, and single-type pages, falling back seamlessly to `src/utils/*-mocks.ts` when Strapi is unreachable.
2. **Native Astro Tiptap Block Rendering (`@vicacha-devs/astro-tiptap-blocks`)**:
   - [`src/components/data/display/TiptapContent/TiptapContent.astro`](./src/components/data/display/TiptapContent/TiptapContent.astro) & [`src/services/strapi/tiptap-sanitizer.ts`](./src/services/strapi/tiptap-sanitizer.ts): Renders rich text from `@notum-cz/strapi-plugin-tiptap-editor` (ProseMirror JSON AST, HTML, or fallback paragraph arrays) using native Astro components with zero raw `set:html`.
3. **IslamicAPI Prayer, Qibla & Zakat Engine (`src/services/islamicAPI/`)**:
   - [`src/services/islamicAPI/api.ts`](./src/services/islamicAPI/api.ts), [`adaptor/buildPrayerData.ts`](./src/services/islamicAPI/adaptor/buildPrayerData.ts), and [`loaders/`](./src/services/islamicAPI/loaders/): Daily Bogotá prayer schedule, Hijri dates, Qibla bearing & Islamic observances, and live Zakat Nisab gold/silver thresholds with resilient fallbacks.
4. **Full 4-Locale & RTL Support (`src/i18n/`)**:
   - Complete UI translation dictionaries for Spanish (`es`), English (`en`), Arabic (`ar` with logical RTL properties and `dir="rtl"`), and Turkish (`tr`).

---

## Localized Pages & BFF API Endpoints

### Localized SSR Pages (`src/pages/[lang]/`)

| Route                         | File                                         | Description                                                                                      |
| :---------------------------- | :------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `/[lang]`                     | `src/pages/[lang]/index.astro`               | Homepage with urgent alert banner, prayer times widget, featured spotlight, events, and services |
| `/[lang]/[prayerInformation]` | `src/pages/[lang]/[prayerInformation].astro` | Dedicated monthly prayer timetable, Jumu'ah schedule, Qibla compass, and PDF/ICS export          |
| `/[lang]/islam-and-faith`     | `src/pages/[lang]/islam-and-faith.astro`     | Pillars of Islam, faith foundations, Shahada certificate verification, and educational resources |
| `/[lang]/about-us`            | `src/pages/[lang]/about-us.astro`            | Mosque history, mission, leadership directory, and institutional governance                      |
| `/[lang]/events-and-programs` | `src/pages/[lang]/events-and-programs.astro` | Upcoming community events, recurring study circles, and ICS calendar subscription                |
| `/[lang]/events/[slug]`       | `src/pages/[lang]/events/[slug].astro`       | Individual event detail page with Tiptap rich text body and registration details                 |
| `/[lang]/articles/[slug]`     | `src/pages/[lang]/articles/[slug].astro`     | Khutbah & article detail page with Tiptap rich text rendering and author metadata                |
| `/[lang]/staff/[slug]`        | `src/pages/[lang]/staff/[slug].astro`        | Imam, scholar, and board member profile page with biography and authored articles                |
| `/[lang]/community-services`  | `src/pages/[lang]/community-services.astro`  | Nikah, Janazah, Shahada, counseling, and educational service offerings                           |
| `/[lang]/media`               | `src/pages/[lang]/media.astro`               | Audio/video khutbah highlights, livestream broadcasts, publications library, and RSS feed        |
| `/[lang]/donate`              | `src/pages/[lang]/donate.astro`              | Active donation campaigns, utility invoice transparency, Zakat calculator, and pledge form       |
| `/[lang]/contact-and-visit`   | `src/pages/[lang]/contact-and-visit.astro`   | General contact form, guided visit booking form, visitor etiquette, and directions               |
| `/[lang]/search`              | `src/pages/[lang]/search.astro`              | Cross-collection multilingual search across articles, events, services, and FAQs                 |

### Astro BFF API Endpoints (`src/pages/api/`)

| Endpoint                                          | File                                                      | Purpose                                                                                                      |
| :------------------------------------------------ | :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `POST /api/submissions`                           | `src/pages/api/submissions.ts`                            | Validates, sanitizes, and forwards contact, visit-booking, donation, and newsletter submissions to Strapi v5 |
| `GET /api/prayer-calendar.ics`                    | `src/pages/api/prayer-calendar.ics.ts`                    | Generates an iCalendar (`.ics`) feed of daily prayer times for Bogotá                                        |
| `GET /api/events/feed.ics`                        | `src/pages/api/events/feed.ics.ts`                        | Generates a localized iCalendar (`.ics`) feed of upcoming mosque events                                      |
| `GET /api/media-feeds/rss.xml`                    | `src/pages/api/media-feeds/rss.xml.ts`                    | Generates an RSS 2.0 XML feed of articles and media broadcasts                                               |
| `GET /api/resources/publications/[slug]/download` | `src/pages/api/resources/publications/[slug]/download.ts` | Tracks download metrics and redirects/streams downloadable mosque publications                               |

---

## Directory Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── actions/                # Interactive forms (Contact, Visit, Donation, Prayer PDF/ICS, Search)
│   │   ├── data/display/           # Domain display sections (TiptapContent, Prayer, Qibla, Zakat, Events, etc.)
│   │   ├── layout/                 # Header, Footer, Hero, UrgentAlertBanner
│   │   ├── navigation/             # Navbar, LanguagePicker, Breadcrumbs
│   │   └── starwind/               # Starwind UI primitives (Button, Card, Input, Select, Tabs, etc.)
│   ├── i18n/                       # Locale dictionaries (es, en, ar, tr) & translation utilities
│   ├── layouts/                    # Base Layout.astro with SEO metadata, RTL dir, and theme support
│   ├── pages/
│   │   ├── [lang]/                 # Localized SSR pages (es, en, ar, tr)
│   │   └── api/                    # Astro SSR BFF endpoints (submissions, ICS feeds, RSS, downloads)
│   ├── services/
│   │   ├── islamicAPI/             # Prayer times, Qibla, Hijri, and Zakat Nisab API client & loaders
│   │   └── strapi/                 # Strapi v5 REST client (api.ts), Content Layer loader.ts, and tiptap-sanitizer.ts
│   ├── content.config.ts           # Astro Content Layer collections
│   └── utils/                      # Domain types, Hijri/date helpers, and 4-locale offline mocks (*-mocks.ts)
├── astro.config.ts
├── eslint.config.ts
├── package.json
└── vitest.config.ts
```

---

## Scripts

| Command                | Description                                                               |
| :--------------------- | :------------------------------------------------------------------------ |
| `pnpm install`         | Install frontend dependencies                                             |
| `pnpm dev`             | Start local Astro SSR dev server at `http://localhost:4321`               |
| `pnpm build`           | Build production Node SSR bundle to `./dist/`                             |
| `pnpm preview`         | Preview production SSR build locally                                      |
| `pnpm test:unit`       | Run unit and Astro Container tests via Vitest (`--project=unit`)          |
| `pnpm test:coverage`   | Run unit tests with V8 coverage thresholds                                |
| `pnpm storybook`       | Launch Storybook 10 component explorer on `http://localhost:6006`         |
| `pnpm build:storybook` | Build static Storybook bundle to `./storybook-static/`                    |
| `pnpm lint`            | Run ESLint (`eslint .`) across TypeScript, Astro, CSS, JSON, and Markdown |
| `pnpm format:check`    | Verify formatting with `oxfmt --check`                                    |
