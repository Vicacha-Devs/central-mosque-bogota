---
title: System Architecture Overview
description: End-to-end architecture, component topology, and request data flows of the Central Mosque of Bogotá platform.
---

## 1. Platform Topology

The **Central Mosque of Bogotá** web platform is architected as a decoupled, resilient Headless CMS + SSR Frontend system with offline-first fallbacks and a server-side Backend-for-Frontend (BFF) layer.

```mermaid
flowchart TB
  subgraph Client["Browser Client (ES / EN / AR RTL / TR)"]
    UI["Astro Server-Rendered HTML + Tailwind v4"]
    Controllers["Lightweight DOM Controllers (*.controller.ts)"]
  end

  subgraph AstroServer["Astro 7 Node.js Server (:4321)"]
    Pages["Localized Pages (src/pages/[lang]/*)"]
    Content["Build-Time Content Layer (content.config.ts)"]
    Live["Live Collections (live.config.ts)"]
    BFF["BFF Endpoints (/api/submissions, /api/events/feed.ics, /api/media-feeds/rss.xml, /api/resources/publications/[slug]/download)"]
    Mocks["4-Locale Fallback Mocks (src/utils/*-mocks.ts)"]
  end

  subgraph CMS["Strapi v5 Headless CMS (:1337)"]
    CoreAPI["17 Content-Type Schemas"]
    Plugins["10 @vicacha-devs/strapi-plugin-* Extensions"]
    DB[("SQLite (Dev) / PostgreSQL 16 (Prod)")]
  end

  subgraph External["External Services"]
    IslamicAPI["IslamicAPI v1 (Prayer Times & Zakat Nisab)"]
    Cloudinary["Cloudinary Media CDN"]
  end

  UI --> Pages
  Controllers --> BFF
  Pages --> Content
  Pages --> Live
  Content --> CoreAPI
  Content --> Plugins
  Content -. "Fallback" .-> Mocks
  Live --> Plugins
  Live --> IslamicAPI
  Live -. "Fallback" .-> Mocks
  BFF --> CoreAPI
  BFF --> Plugins
  CoreAPI --> DB
  Plugins --> DB
  CoreAPI --> Cloudinary
```

---

## 2. Core Architectural Pillars

| Pillar | Implementation | Benefit |
| :--- | :--- | :--- |
| **Hybrid Static + Live SSR** | Static pre-rendering (`getStaticPaths`) for institutional/catalog pages + `prerender = false` SSR for dynamic prayer schedules and BFF API routes | Sub-50ms TTFB on content pages while keeping prayer countdowns and form submissions dynamic |
| **3-Tier Data Resilience** | `Strapi v5 Plugin Cache` -> `Upstream API (IslamicAPI)` -> `Deterministic Localized Mocks` | Zero downtime even if Strapi or IslamicAPI is temporarily unreachable |
| **Backend-for-Frontend (BFF)** | Server-side Astro API routes (`src/pages/api/*`) proxy submissions, PDF downloads, RSS, and ICS feeds | Keeps `STRAPI_API_TOKEN` and `ISLAMIC_API_KEY` strictly on the server |
| **Zero-`set:html` Security** | `@vicacha-devs/astro-tiptap-blocks` + `isomorphic-dompurify` (`tiptap-sanitizer.ts`) | Eliminates XSS vectors from CMS rich-text fields |
| **Native 4-Locale & RTL** | Logical CSS properties (`ps-*`, `pe-*`, `start-*`, `end-*`) + locale dictionaries (`es`, `en`, `ar`, `tr`) | Seamless right-to-left mirroring for Arabic (`ar`) without duplicate templates |
