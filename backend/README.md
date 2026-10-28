# Central Mosque of Bogotá — Strapi v5 Headless CMS (`/backend`)

Headless CMS backend for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**, powered by **Strapi v5** (`@strapi/strapi` `5.59.0`), `@notum-cz/strapi-plugin-tiptap-editor`, `@notum-cz/strapi-plugin-seo`, `strapi-global-search`, `strapi-cache` (`^1.13.0`), and 10 custom `@vicacha-devs/strapi-plugin-*` domain extensions.

---

## Key Capabilities

1. **9 Site-Specific Content Types, 7 Shared Components & Health Check (`src/api/` & `src/components/`)**:
   - **Collection Types (4)**: `article`, `community-service`, `faq`, `leader`.
   - **Single Types (5)**: `about-page`, `contact-page`, `donations-page`, `global-setting`, `islam-faith-page`.
   - **Shared Components (7)**: `content.internal-links`, `donation.impact-stat`, `donation.payment-channel`, `faith.pillar-card`, `institution.value-card`, `shared.link`, `shared.seo`.
   - **Operational Endpoint**: `health` (`GET /api/health`).
2. **10 Custom `@vicacha-devs` Domain Plugins (`config/vicachaPlugins.ts`)**:
   - `@vicacha-devs/strapi-plugin-bookings` — Bookable resources (`plugin::bookings.resource`) & guided visit reservations (`plugin::bookings.booking`)
   - `@vicacha-devs/strapi-plugin-broadcasts` — Omnichannel campaigns (`plugin::broadcasts.campaign`), automation rules & delivery logs
   - `@vicacha-devs/strapi-plugin-calendar` — Hijri (`islamic-umalqura`) & Gregorian multi-source calendar and `.ics` feeds
   - `@vicacha-devs/strapi-plugin-certificates` — Ed25519 cryptographically signed Shahada, Nikah & tax certificates (`plugin::certificates.template`, `plugin::certificates.certificate`)
   - `@vicacha-devs/strapi-plugin-donations` — Crowdfunding campaigns (`plugin::donations.campaign`), pledges (`plugin::donations.pledge`) & utility invoice sponsorship
   - `@vicacha-devs/strapi-plugin-events` — Events (`plugin::events.event`), registrations (`plugin::events.registration`), corner spotlights & academy courses
   - `@vicacha-devs/strapi-plugin-inbox` — Visual form builder (`plugin::inbox.form`), service-desk submissions (`plugin::inbox.submission`), subscribers & alert banners
   - `@vicacha-devs/strapi-plugin-islam` — Salah/Iqamah calculation engine, Qibla, Hijri/Hilal announcements (`plugin::islam.hilal-announcement`), Scripture (`plugin::islam.scripture-entry`) & Zakat/Nisab calculators
   - `@vicacha-devs/strapi-plugin-media-feeds` — Audio/video archive (`plugin::media-feeds.media-item`, `plugin::media-feeds.media-series`), YouTube sync & Podcast RSS 2.0
   - `@vicacha-devs/strapi-plugin-resources` — Downloadable PDFs (`plugin::resources.publication`), photo galleries (`plugin::resources.gallery-album`) & Islamic glossary (`plugin::resources.glossary-term`)
3. **Editorial Productivity, Caching & Search Plugins (`config/plugins.ts`)**:
   - `strapi-cache` (`^1.13.0`) — LRU/Redis/Valkey REST response caching with automatic cache invalidation and localized (`en`, `es`, `ar`, `tr`, `de`) admin purge controls
   - `strapi-global-search` — Spotlight `Cmd/Ctrl + K` global search across all `api::*` and `plugin::*` content types (`en`, `es`, `ar`, `tr`, `fr`)
   - `@notum-cz/strapi-plugin-tiptap-editor` — TipTap v3 + Edifice IO rich text editor with 48 features and relational media/link sync
   - `@notum-cz/strapi-plugin-seo` — Multilingual SEO analysis and meta tag preview (`en`, `es`, `ar`, `tr`)
   - `@juadariasmar/strapi-plugin-typesense` — Real-time Typesense search indexing
   - `strapi-plugin-navigation`, `strapi-plugin-email-designer-5`, `strapi-plugin-content-manager-organizer`, `strapi-5-sitemap-plugin`, `strapi-plugin-publisher`, `strapi-plugin-config-sync`, `@frameless/preview-button`, `@frameless/strapi-plugin-notes`, `@frameless/strapi-plugin-env-label`
4. **Zero-Touch First-Boot Bootstrap (`src/index.ts`, `src/bootstrap/`, & `src/seed/`)**:
   - Automatically registers all 4 supported locales (`es`, `en`, `ar`, `tr`) with `es` as default.
   - Configures least-privilege Public role permissions (read-only access on public content types and plugin endpoints; write-only `create` access on `plugin::inbox.submission`, `plugin::bookings.booking`, and `plugin::donations.pledge`).
   - Seeds Content Manager Organizer sidebar groups, TipTap presets, Navigation menus, Sitemap config, Email Designer templates, Media Library folders, and 4-locale initial content idempotently.

---

## Quick Start

### Local Development (SQLite)

```bash
cd backend
cp .env.example .env
pnpm install
pnpm run develop
```

The Strapi Admin Panel will be available at `http://127.0.0.1:1337/admin`.

### Docker Compose (PostgreSQL 16 + Strapi v5)

From the monorepo root:

```bash
docker compose up --build
```

---

## Scripts

| Command | Description |
| :--- | :--- |
| `pnpm develop` | Start Strapi v5 in development watch mode on `http://127.0.0.1:1337` |
| `pnpm build` | Build the Strapi Admin Panel bundle |
| `pnpm start` | Run Strapi v5 in production mode |
| `pnpm typecheck` | Run TypeScript compiler validation (`tsc --noEmit`) |
| `pnpm test` | Run backend unit, integration, and 10-plugin E2E test suites |
| `pnpm config-sync` | Export/import Strapi configuration via `strapi-plugin-config-sync` |
