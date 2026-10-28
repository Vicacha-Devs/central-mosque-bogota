---
title: 10 Extensiones @vicacha-devs y Ecosistema de Plugins en Strapi v5
description: Arquitectura, rutas REST y localización en 4 idiomas de los 10 plugins de dominio @vicacha-devs y plugins complementarios.
---

## 1. Ecosistema de Plugins Propios `@vicacha-devs`

Además de los esquemas nativos de Strapi v5, `backend/package.json` integra **10 extensiones `@vicacha-devs/strapi-plugin-*`** (ubicadas en `../../strapi-v5-extensions/packages/`):

```mermaid
flowchart TB
  Strapi["Strapi v5 Core (:1337)"] --> P1["strapi-plugin-islam (Oración, Zakat, Corán, Hadiz, Qibla, Ramadán)"]
  Strapi --> P2["strapi-plugin-events (Eventos, Spotlights, Cursos Academia, ICS)"]
  Strapi --> P3["strapi-plugin-donations (Campañas, Facturas Servicios, Comprobantes)"]
  Strapi --> P4["strapi-plugin-inbox (Mensajes Contacto y 5 Flujos de Ventanilla)"]
  Strapi --> P5["strapi-plugin-bookings (Agendamiento de Visitas Guiadas y Colegios)"]
  Strapi --> P6["strapi-plugin-resources (Publicaciones PDF, Glosario, Galerías)"]
  Strapi --> P7["strapi-plugin-media-feeds (Archivo Audio/Video y Sindicación RSS 2.0)"]
  Strapi --> P8["strapi-plugin-broadcasts (Canales WhatsApp/Telegram y Boletín)"]
  Strapi --> P9["strapi-plugin-calendar (Calendario de Efemérides Hijri-Gregoriano)"]
  Strapi --> P10["strapi-plugin-certificates (Certificados de Shahada, Nikah y Donación)"]
```

---

## 2. Matriz de Integración con el Frontend

| Paquete del Plugin | Llave Config | Prefijo REST | Consumidor Frontend (`src/services/strapi/api.ts`) |
| :--- | :--- | :--- | :--- |
| `@vicacha-devs/strapi-plugin-islam` | `islam` | `/api/islam/*` | `fetchIslamSuiteFromStrapi` (`prayerTimesLoader`, `zakatNisabLoader`, `DailyDuaModal`, `FivePillarsSection`, `ScriptureExplorerSection`, `QiblaAndObservancesSection`, `RamadanScheduleBanner`, `UrgentAlertBanner`) |
| `@vicacha-devs/strapi-plugin-events` | `events` | `/api/events/*` | `fetchEventsFromStrapi`, `fetchAcademyCoursesFromStrapi`, `fetchEventSpotlightsFromStrapi`, `GET /api/events/feed.ics` |
| `@vicacha-devs/strapi-plugin-donations` | `donations` | `/api/donations/*` | `fetchUtilityInvoicesFromStrapi`, `POST /api/submissions` (`donation-submission`) |
| `@vicacha-devs/strapi-plugin-inbox` | `inbox` | `/api/inbox/*` | `fetchServiceDeskWorkflowsFromStrapi`, `POST /api/submissions` (`contact-message`, `service-desk-request`) |
| `@vicacha-devs/strapi-plugin-bookings` | `bookings` | `/api/bookings/*` | `POST /api/submissions` (`visit-booking`) |
| `@vicacha-devs/strapi-plugin-resources` | `resources` | `/api/resources/*` | `fetchPublicationsFromStrapi`, `fetchGlossaryFromStrapi`, `fetchPhotoGalleriesFromStrapi`, `GET /api/resources/publications/[slug]/download` |
| `@vicacha-devs/strapi-plugin-media-feeds` | `media-feeds` | `/api/media-feeds/*` | `fetchMediaArchiveFromStrapi`, `GET /api/media-feeds/rss.xml` |
| `@vicacha-devs/strapi-plugin-broadcasts` | `broadcasts` | `/api/broadcasts/*` | `fetchBroadcastsFromStrapi`, `POST /api/submissions` (`newsletter-subscription`) |
| `@vicacha-devs/strapi-plugin-calendar` | `calendar` | `/api/calendar/*` | Sincronización de efemérides Hijri (`islamic-umalqura`) con `QiblaAndObservancesSection` |
| `@vicacha-devs/strapi-plugin-certificates` | `certificates` | `/api/certificates/*` | Emisión y verificación de certificados firmados con Ed25519 (Shahada, Nikah y Donaciones) |

---

## 3. Plugins Complementarios de Edición, Caché y Búsqueda (`backend/config/plugins.ts`)

| Paquete | Versión | Función y Soporte de Idiomas (`en`, `es`, `ar`, `tr`) |
| :--- | :--- | :--- |
| `strapi-cache` | `^1.13.0` | Caché REST LRU / Redis / Valkey con invalidación automática al publicar y traducciones nativas del Admin en `en`, `es`, `ar`, `tr` y `de` |
| `strapi-global-search` | `2.x` (`file:`) | Búsqueda global tipo Spotlight (`Cmd/Ctrl + K`) en todos los tipos `api::*` y `plugin::*` (`en`, `es`, `ar`, `tr`, `fr`) |
| `@notum-cz/strapi-plugin-tiptap-editor` | `file:` | Editor TipTap v3 + Edifice IO con 48 funciones y sincronización relacional de medios/enlaces (`en`, `es`, `ar`, `tr` +7 idiomas) |
| `@notum-cz/strapi-plugin-seo` | `file:` | Componente SEO y analizador SERP en vivo (`en`, `es`, `ar`, `tr`, `fr`, `pt-BR`) |
| `@juadariasmar/strapi-plugin-typesense` | `^1.0.0` | Indexación en tiempo real hacia Typesense |
| `strapi-plugin-navigation` | `^3.3.7` | Constructor de menús jerárquicos compatible con modelos `api::*` y `plugin::*` |
| `strapi-plugin-content-manager-organizer` | `^2.0.3` | Organiza los 28 modelos visibles en 8 carpetas temáticas en la barra lateral |
| `strapi-plugin-email-designer-5` | `^0.0.10` | Diseñador visual Unlayer para plantillas de correo transaccional |
| `strapi-5-sitemap-plugin` | `^1.0.8` | Generación dinámica de sitemap XML multilingüe |
| `strapi-plugin-publisher` | `^2.0.9` | Publicación y despublicación programada |
| `strapi-plugin-config-sync` | `^3.2.0` | Sincronización de configuración entre entornos (`en`, `es`, `ar`, `tr` +18 idiomas) |
| `@frameless/preview-button` y `@frameless/strapi-plugin-notes` | `^2.2.2` / `^1.1.2` | Botón de vista previa en vivo y notas editoriales (`es`, `ar`, `tr` inyectados vía `src/admin/translations.ts`) |
