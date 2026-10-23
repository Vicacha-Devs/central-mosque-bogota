# Abu Bakr As-Siddiq — Central Mosque of Bogotá

Full-stack multilingual (`es`, `en`, `ar`, `tr`) web platform and bilingual (`en`, `es`) engineering documentation portal for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**.

---

## Monorepo Architecture

| Workspace | Path | Stack & Responsibilities | Default Port |
| :--- | :--- | :--- | :--- |
| **Frontend (`frontend`)** | [`./frontend`](./frontend/README.md) | **Astro 7 SSR** (`@astrojs/node`), Tailwind CSS v4, Starwind UI, `@sensinum/astro-strapi-loader`, `@vicacha-devs/astro-tiptap-blocks`, IslamicAPI prayer & Zakat engine, Vitest, and Storybook 10. | `http://localhost:4321` |
| **Backend (`@central-mosque-bogota/backend`)** | [`./backend`](./backend/README.md) | **Strapi v5 Headless CMS** (`^5.39.0`), SQLite (local dev) / PostgreSQL 16 (production), Cloudinary CDN, `@notum-cz/strapi-plugin-tiptap-editor`, and 10 custom `@vicacha-devs/strapi-plugin-*` domain extensions. | `http://127.0.0.1:1337` |
| **Docs (`@central-mosque-bogota/docs`)** | [`./docs`](./docs/README.md) | **Astro Starlight** bilingual (`en` + `es`) handbook with **Pele** (`https://pele.run/`) build-time SVG Mermaid diagrams, **Archify** interactive HTML explainers, and **TypeDoc** API reference generation (`<= 500 lines` per file). | `http://localhost:4322` |

---

## Interactive Architecture & Developer Portal Links

### Standalone Interactive Explainers (Archify)

- **System Architecture Explorer (Dark/Light + Motion)**: [`docs/public/archify/central-mosque-architecture.html`](./docs/public/archify/central-mosque-architecture.html)
- **One-Page Platform Explainer**: [`docs/public/archify/central-mosque-explainer.html`](./docs/public/archify/central-mosque-explainer.html)

### Bilingual Starlight Documentation (`/docs`)

| Guide | English (`en`) | Español (`es`) |
| :--- | :--- | :--- |
| **Jr. Dev 10-Minute Executive Summary** | [`01-getting-started/jr-dev-summary.md`](./docs/src/content/docs/en/01-getting-started/jr-dev-summary.md) | [`01-getting-started/jr-dev-summary.md`](./docs/src/content/docs/es/01-getting-started/jr-dev-summary.md) |
| **Step-by-Step Onboarding Guide** | [`01-getting-started/onboarding-guide.md`](./docs/src/content/docs/en/01-getting-started/onboarding-guide.md) | [`01-getting-started/onboarding-guide.md`](./docs/src/content/docs/es/01-getting-started/onboarding-guide.md) |
| **Environment Setup** | [`01-getting-started/environment-setup.md`](./docs/src/content/docs/en/01-getting-started/environment-setup.md) | [`01-getting-started/environment-setup.md`](./docs/src/content/docs/es/01-getting-started/environment-setup.md) |
| **System Overview & Data Flows** | [`02-architecture/system-overview.md`](./docs/src/content/docs/en/02-architecture/system-overview.md) | [`02-architecture/system-overview.md`](./docs/src/content/docs/es/02-architecture/system-overview.md) |
| **System Architecture ADRs (001–012)** | [`02-architecture/adrs.md`](./docs/src/content/docs/en/02-architecture/adrs.md) | [`02-architecture/adrs.md`](./docs/src/content/docs/es/02-architecture/adrs.md) |
| **Verification TODO Checklist** | [`05-quality-and-verification/verification-todo-checklist.md`](./docs/src/content/docs/en/05-quality-and-verification/verification-todo-checklist.md) | [`05-quality-and-verification/verification-todo-checklist.md`](./docs/src/content/docs/es/05-quality-and-verification/verification-todo-checklist.md) |
| **Mosque Staff Strapi v5 Handbook** | [`06-editorial-guide/cms-editor-handbook.md`](./docs/src/content/docs/en/06-editorial-guide/cms-editor-handbook.md) | [`06-editorial-guide/cms-editor-handbook.md`](./docs/src/content/docs/es/06-editorial-guide/cms-editor-handbook.md) |

---

## Core Platform Capabilities

1. **Offline-First Resilient Content Layer**:
   - Every Strapi v5 collection and single-type loader in [`frontend/src/services/strapi/loader.ts`](./frontend/src/services/strapi/loader.ts) and [`frontend/src/services/strapi/api.ts`](./frontend/src/services/strapi/api.ts) automatically falls back to deterministic 4-locale mocks in [`frontend/src/utils/`](./frontend/src/utils/) when Strapi is offline.
2. **4-Locale & Native RTL Support (`es`, `en`, `ar`, `tr`)**:
   - Full UI dictionary parity, localized route slugs, and logical CSS layout properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`) with automatic `dir="rtl"` rendering for Arabic (`ar`).
3. **Zero-`set:html` Rich Text Rendering**:
   - Rich text content authored in `@notum-cz/strapi-plugin-tiptap-editor` is sanitized and rendered through native Astro components via `@vicacha-devs/astro-tiptap-blocks` ([`TiptapContent.astro`](./frontend/src/components/data/display/TiptapContent/TiptapContent.astro)).
4. **Islamic Prayer Engine, Qibla & Zakat Calculator**:
   - Real-time Bogotá prayer schedule calculation, Hijri calendar conversions, Qibla bearing & observances, and live Zakat Nisab gold/silver thresholds via [`frontend/src/services/islamicAPI/`](./frontend/src/services/islamicAPI/).
5. **Astro SSR BFF Endpoints (`/api/*`)**:
   - Unified form submissions proxy (`POST /api/submissions`) for contact messages, guided visit bookings, and donation pledges, plus `GET /api/prayer-calendar.ics`, `GET /api/events/feed.ics`, `GET /api/media-feeds/rss.xml`, and `GET /api/resources/publications/[slug]/download`.

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 24` (Frontend & Root) / `>= 18.18.0 <= 26.x.x` (Strapi Backend)
- **Package Manager**: `pnpm >= 10`

### 1. Start the Astro 7 Frontend (`/frontend`) — Works Offline Out-of-the-Box

```bash
pnpm --filter frontend install
pnpm run dev:frontend
```

Accessible at `http://localhost:4321` (automatically uses 4-locale domain mocks in `frontend/src/utils/*-mocks.ts` when Strapi is not running).

### 2. Start the Strapi v5 Backend (`/backend`)

```bash
cd backend
cp .env.example .env
pnpm install
pnpm run develop
```

Accessible at `http://127.0.0.1:1337/admin`. On first boot, Strapi automatically provisions the `es`, `en`, `ar`, and `tr` locales, configures least-privilege Public API permissions, and seeds initial multilingual content.

> **Docker Option**: Run `docker compose up --build` from the repository root to launch PostgreSQL 16 + Strapi v5 in containers.

### 3. Start the Bilingual Starlight + Pele + TypeDoc Docs Portal (`/docs`)

```bash
pnpm --filter @central-mosque-bogota/docs install
pnpm --filter @central-mosque-bogota/docs run typedoc
pnpm run dev:docs
```

Accessible at `http://localhost:4322`.

### 4. Run Full Monorepo Verification (`pnpm verify`)

```bash
pnpm run verify
```

Executes [`scripts/verify-all.ts`](./scripts/verify-all.ts), which enforces:

1. All documentation files in `docs/src/content/docs/` are `<= 500 lines`.
2. `oxfmt --check` formatting gate.
3. `eslint . --quiet` static analysis gate.
4. `astro check` TypeScript & Astro template diagnostics.
5. `vitest --project=unit --run --coverage` unit test & coverage gate.
6. `astro build` production SSR build.
7. `storybook build` component catalog build.
8. `docs` TypeDoc sync + Starlight production build.

---

## Root Workspace Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `pnpm dev:frontend` | `pnpm --filter frontend dev` | Start Astro 7 SSR dev server on `:4321` |
| `pnpm dev:backend` | `pnpm --filter @central-mosque-bogota/backend develop` | Start Strapi v5 CMS in watch mode on `:1337` |
| `pnpm dev:docs` | `pnpm --filter @central-mosque-bogota/docs dev` | Start Starlight documentation portal on `:4322` |
| `pnpm build:frontend` | `pnpm --filter frontend build` | Build Astro 7 SSR production bundle |
| `pnpm build:storybook` | `pnpm --filter frontend build:storybook` | Build static Storybook 10 catalog |
| `pnpm build:docs` | `pnpm --filter @central-mosque-bogota/docs build` | Sync TypeDoc API docs and build Starlight site |
| `pnpm test:unit` | `pnpm --filter frontend test:unit --run` | Run frontend unit & Astro Container test suite |
| `pnpm test:coverage` | `pnpm --filter frontend test:unit --run --coverage` | Run frontend unit tests with V8 coverage report |
| `pnpm verify` | `node ./scripts/verify-all.ts` | Run all monorepo formatting, lint, test, and build gates |

---

## License

**Private & Proprietary**
© Central Mosque of Bogotá (Abu Bakr As-Siddiq). All rights reserved.
