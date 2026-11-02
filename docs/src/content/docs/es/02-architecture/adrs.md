---
title: Registros de Decisiones de Arquitectura (ADRs 001–012)
description: Decisiones de arquitectura autoritativas actualizadas para el stack Astro 7 SSR + Strapi v5 + Extensiones Propias.
---

> **Nota Histórica**: Los borradores preliminares de febrero de 2026 (`Abu Bakr As-Sidik WebSite/`) evaluaron Wagtail/Django. Los registros a continuación documentan la **arquitectura real de producción** implementada en `central-mosque-bogota/`.

---

## Matriz Resumen (ADRs 001–012)

| ADR | Área | Decisión Seleccionada | Estado |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Stack Principal | Monorepo TypeScript **Astro 7 SSR (`@astrojs/node`) + Strapi v5 (`5.59.0`)** | Aceptado |
| **ADR-002** | Seguridad Rich Text | **`@vicacha-devs/astro-tiptap-blocks`** + `isomorphic-dompurify` (cero `set:html`) | Aceptado |
| **ADR-003** | Carga de Contenido | **`@sensinum/astro-strapi-loader`** + Astro Live Collections + Mocks offline en 4 idiomas | Aceptado |
| **ADR-004** | Localización (i18n) | **4 Idiomas (`es`, `en`, `ar` RTL, `tr`)** tanto en `@strapi/i18n` como en rutas Astro | Aceptado |
| **ADR-005** | Motor de Datos Islámicos | **Resolución en 3 Capas**: `@vicacha-devs/strapi-plugin-islam` -> `IslamicAPI` -> Mocks Bogotá | Aceptado |
| **ADR-006** | Extensiones de Dominio | **10 paquetes modulares `@vicacha-devs/strapi-plugin-*`** para flujos de la Mezquita | Aceptado |
| **ADR-007** | Seguridad BFF y Formularios | Rutas Astro de servidor (`/api/submissions`, `/api/events/feed.ics`, `/api/media-feeds/rss.xml`, `/api/resources/publications/[slug]/download`) | Aceptado |
| **ADR-008** | Base de Datos y Media | Modo dual **SQLite (local) / PostgreSQL 16 (prod)** + **Cloudinary CDN** | Aceptado |
| **ADR-009** | Primitivas UI | **Tailwind CSS v4** + primitivas accesibles **Starwind UI** + clases lógicas RTL | Aceptado |
| **ADR-010** | Buscador del Sitio | Índice transversal hidratado en cliente (`SiteSearchSection`) + soporte Typesense | Aceptado |
| **ADR-011** | Calidad y Pruebas | **Vitest 4** + Astro Container API (`>=90%` branches / `>=95%` functions) + **Storybook 10** | Aceptado |
| **ADR-012** | Documentación | **Astro Starlight** (`en`/`es`) + diagramas SVG **Pele** (`https://pele.run/`) + **TypeDoc** | Aceptado |

---

## Detalle de Decisiones Clave

### ADR-001: Monorepo TypeScript con Astro 7 SSR y Strapi v5
- **Contexto**: Unificar todo el stack en TypeScript elimina la fricción entre lenguajes y permite compartir contratos de datos entre el CMS, los plugins y el frontend.
- **Decisión**: Adoptar Astro 7 (`@astrojs/node` standalone) junto con Strapi v5 (`@strapi/strapi` `5.59.0`).

### ADR-002: Renderizado de Texto Enriquecido sin `set:html`
- **Contexto**: Inyectar HTML crudo del CMS con `set:html` expone la aplicación a riesgos XSS.
- **Decisión**: Usar `@notum-cz/strapi-plugin-tiptap-editor` en Strapi v5 y renderizar los bloques en Astro mediante `<TiptapContent />` (`@vicacha-devs/astro-tiptap-blocks`) respaldado por `tiptap-sanitizer.ts`.

### ADR-003: Capa de Contenido Resiliente Offline
- **Contexto**: Los desarrolladores y los pipelines de CI deben poder compilar, probar y previsualizar las 65 rutas estáticas y las páginas SSR sin depender de una instancia activa de Strapi ni de llaves externas.
- **Decisión**: Envolver `@sensinum/astro-strapi-loader` en `createResilientStrapiLoader` (`src/services/strapi/loader.ts`) con respaldo automático a `src/utils/*-mocks.ts`.

### ADR-007: Endpoints Backend-for-Frontend (BFF)
- **Contexto**: Enviar formularios o descargar PDFs directamente desde el navegador hacia Strapi expondría tokens o ampliaría la superficie CORS.
- **Decisión**: Canalizar todas las mutaciones y descargas a través de endpoints de servidor en Astro (`src/pages/api/*`) con validación de slugs (`/^[a-z0-9-]+$/`), verificación de magic-bytes `%PDF-` y cabecera `X-Content-Type-Options: nosniff`.
