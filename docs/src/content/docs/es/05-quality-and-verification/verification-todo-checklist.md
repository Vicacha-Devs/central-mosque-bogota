---
title: Checklist TODO de Verificación Integral
description: Lista de verificación paso a paso (automatizada y manual) para confirmar que todas las funcionalidades, idiomas, diseños RTL y APIs funcionen correctamente.
---

Utiliza este checklist antes de publicar un release o integrar una rama importante. Para ejecutar todas las validaciones automatizadas en un solo comando desde `central-mosque-bogota/`, corre:

```bash
pnpm verify
```

---

## 1. Compuertas Automatizadas de Análisis Estático y Build

- [ ] **Formato (`oxfmt`)**: `./node_modules/.bin/oxfmt --check` en `frontend/` finaliza con código `0` (máximo 80 columnas por línea).
- [ ] **Linting (`eslint`)**: `./node_modules/.bin/eslint . --quiet` en `frontend/` finaliza con `0` errores en archivos `.astro`, `.ts`, `.json`, `.css` y `.md`.
- [ ] **Diagnósticos TypeScript y Astro (`astro check`)**: `./node_modules/.bin/astro check` reporta `0 errors` en los 477+ archivos.
- [ ] **Pruebas Unitarias y Cobertura (`vitest`)**: `./node_modules/.bin/vitest --project=unit --run --coverage` aprueba los 92 archivos de prueba (201+ tests) y supera los umbrales globales:
  - [ ] Statements `>= 80%` (actualmente **98.26%**)
  - [ ] Branches `>= 90%` (actualmente **90.93%**)
  - [ ] Functions `>= 95%` (actualmente **98.96%**)
  - [ ] Lines `>= 80%` (actualmente **99.28%**)
- [ ] **Build de Producción SSR y Estático (`astro build`)**: `./node_modules/.bin/astro build` genera las 65 páginas estáticas localizadas + puntos de entrada SSR + `sitemap-index.xml`.
- [ ] **Build Estático de Storybook (`storybook build`)**: `./node_modules/.bin/storybook build` compila `storybook-static/` con 0 errores.
- [ ] **Build de Documentación y Límite de Líneas**: `pnpm --filter @central-mosque-bogota/docs build` genera las referencias TypeDoc, verifica que cada archivo `.md`/`.mdx` tenga `<= 500 líneas` y construye `docs/dist/`.

---

## 2. Verificación de Rutas en 4 Idiomas y Diseño RTL Árabe

Inicia `pnpm dev` en `frontend/` (`http://localhost:4321`) y verifica cada ruta en **Español (`es`)**, **Inglés (`en`)**, **Árabe (`ar`)** y **Turco (`tr`)**:

- [ ] **Redirección Raíz (`/`)**: Visitar `http://localhost:4321/` redirige limpiamente a `/es`.
- [ ] **Página de Inicio (`/[lang]`)**:
  - [ ] `HeroHijri` muestra las fechas Hijri y Gregoriana localizadas.
  - [ ] `UrgentAlertBanner` aparece en la parte superior y guarda su cierre en `localStorage`.
  - [ ] `DailyPrayTime` resalta la oración activa en Bogotá y abre `DailyDuaModal` al hacer clic.
  - [ ] `EventSpotlightDock` aparece en la esquina inferior, cambia entre pestañas de convocatorias, abre el póster en pantalla completa y se minimiza.
- [ ] **Espejado RTL en Árabe (`/ar`, `/ar/about-us`, `/ar/islam-and-faith`, `/ar/donate`)**:
  - [ ] `<html lang="ar" dir="rtl">` está presente en el elemento raíz.
  - [ ] El menú de navegación, el selector de idioma, los bordes laterales (`border-s-*`) y los formularios fluyen de derecha a izquierda sin desbordamiento horizontal.
- [ ] **Ruta SSR Localizada de Horarios de Oración**:
  - [ ] `/es/horarios-de-oracion`
  - [ ] `/en/prayer-information`
  - [ ] `/ar/مواقيت-الصلاة`
  - [ ] `/tr/namaz-vakitleri`
  - [ ] El botón **Ver más / Ver menos** expande y contrae la tabla mensual (`MonthlyPrayTime`) y **Descargar PDF** exporta el horario en formato A4 horizontal.

---

## 3. Verificación de Funcionalidades Interactivas de Dominio

- [ ] **Islam y Fe (`/[lang]/islam-and-faith`)**:
  - [ ] `ScriptureExplorerSection` filtra aleyas del Corán y hadices por tema.
  - [ ] `TasbihCounterCard` incrementa el contador al hacer clic, alterna metas (`33` / `99`) y se reinicia correctamente.
  - [ ] `QiblaAndObservancesSection` muestra el rumbo Qibla desde Bogotá (`65.24° ENE`) y las próximas fechas Hijri.
- [ ] **Eventos y Academia (`/[lang]/events-and-programs` y `/[lang]/events/[slug]`)**:
  - [ ] `EventsCatalogSection` filtra eventos por categoría y texto de búsqueda.
  - [ ] Hacer clic en **Inscribirse** en un curso abre `CourseEnrollmentForm` con el curso preseleccionado.
- [ ] **Servicios Comunitarios (`/[lang]/community-services`)**:
  - [ ] Hacer clic en un servicio abre `ServiceDeskIntakeSection` y adapta los campos dinámicos según el flujo (`khutbah`, `nikah`, `janazah`, `shahada`, `certificate`).
- [ ] **Donaciones y Zakat (`/[lang]/donate`)**:
  - [ ] `ZakatCalculatorSection` calcula el patrimonio neto sujeto a Zakat y el `2.5%` a pagar según el Nisab de Oro o Plata.
  - [ ] `PaymentChannelsSection` copia al portapapeles los números de cuenta de Bancolombia / Nequi / Bre-B.
  - [ ] `UtilityInvoicesSection` abre `DonationSubmissionForm` pre-llenando la referencia del recibo seleccionado.

---

## 4. Verificación de Endpoints BFF y Seguridad

- [ ] **`POST /api/submissions`**:
  - [ ] Enviar el campo honeypot `website_url` lleno retorna silenciosamente `{ ok: true, spamFiltered: true }`.
  - [ ] Enviar un correo inválido o campos vacíos retorna `400 Bad Request` con cabecera `X-Content-Type-Options: nosniff`.
  - [ ] Envíos válidos retornan `200` (con Strapi encendido) o `202` (`mode: "local-fallback"` con Strapi apagado) e incluyen un `referenceCode`.
- [ ] **`GET /api/events/feed.ics?lang=es`**: Retorna `200 OK` con `Content-Type: text/calendar; charset=utf-8` y bloques `VCALENDAR` / `VEVENT` válidos.
- [ ] **`GET /api/media-feeds/rss.xml?lang=es`**: Retorna `200 OK` con `Content-Type: application/rss+xml; charset=utf-8` y XML `<rss version="2.0">` válido.
- [ ] **`GET /api/resources/publications/guia-bienvenida-visita-mezquita/download?locale=es`**: Retorna `200 OK` con `Content-Type: application/pdf` y bytes `%PDF-1.4` válidos; slugs con `../` retornan `400 Bad Request`.
