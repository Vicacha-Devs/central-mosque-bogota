---
title: Visión General de la Arquitectura del Sistema
description: Topología completa, flujo de datos y pilares arquitectónicos de la plataforma de la Mezquita Central de Bogotá.
---

## 1. Topología de la Plataforma

La plataforma web de la **Mezquita Central de Bogotá** combina un CMS Headless (**Strapi v5**) con un frontend **Astro 7 SSR**, respaldados por una capa Backend-for-Frontend (BFF) y mocks multilingües para resiliencia offline.

```mermaid
flowchart TB
  subgraph Client["Navegador del Visitante (ES / EN / AR RTL / TR)"]
    UI["HTML Renderizado por Astro + Tailwind v4"]
    Controllers["Controladores DOM Ligeros (*.controller.ts)"]
  end

  subgraph AstroServer["Servidor Node.js Astro 7 (:4321)"]
    Pages["Páginas Localizadas (src/pages/[lang]/*)"]
    Content["Content Layer (content.config.ts)"]
    Live["Live Collections (live.config.ts)"]
    BFF["Endpoints BFF (/api/submissions, /api/events/feed.ics, /api/media-feeds/rss.xml, /api/resources/publications/[slug]/download)"]
    Mocks["Mocks en 4 Idiomas (src/utils/*-mocks.ts)"]
  end

  subgraph CMS["CMS Headless Strapi v5 (:1337)"]
    CoreAPI["17 Esquemas Content-Type"]
    Plugins["10 Extensiones @vicacha-devs/strapi-plugin-*"]
    DB[("SQLite (Dev) / PostgreSQL 16 (Prod)")]
  end

  subgraph External["Servicios Externos"]
    IslamicAPI["IslamicAPI v1 (Horarios de Oración y Zakat Nisab)"]
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

## 2. Pilares Arquitectónicos

| Pilar | Implementación | Beneficio |
| :--- | :--- | :--- |
| **Híbrido Estático + SSR en Vivo** | Páginas institucionales pre-renderizadas (`getStaticPaths`) + rutas SSR (`prerender = false`) para horarios de oración y endpoints BFF | TTFB menor a 50ms en páginas de contenido y datos en tiempo real para oración y formularios |
| **Resiliencia en 3 Capas** | `Caché Plugin Strapi v5` -> `API Externa (IslamicAPI)` -> `Mocks Localizados Deterministas` | Cero caídas incluso si Strapi o IslamicAPI no están disponibles temporalmente |
| **Backend-for-Frontend (BFF)** | Endpoints de servidor en `src/pages/api/*` para formularios, descargas PDF, RSS e ICS | Mantiene `STRAPI_API_TOKEN` e `ISLAMIC_API_KEY` estrictamente en el servidor |
| **Seguridad Cero-`set:html`** | `@vicacha-devs/astro-tiptap-blocks` + `isomorphic-dompurify` (`tiptap-sanitizer.ts`) | Elimina vectores XSS provenientes del contenido enriquecido del CMS |
| **Soporte Nativo 4 Idiomas y RTL** | Propiedades lógicas CSS (`ps-*`, `pe-*`, `start-*`, `end-*`) + diccionarios (`es`, `en`, `ar`, `tr`) | Espejado automático derecha-a-izquierda en árabe (`ar`) sin duplicar plantillas |
