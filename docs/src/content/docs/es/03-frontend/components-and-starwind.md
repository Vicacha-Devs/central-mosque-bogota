---
title: Taxonomía de Componentes, Controladores y Starwind UI
description: Catálogo completo de componentes Astro, controladores DOM del lado del cliente y primitivas Starwind UI en frontend/src/components/.
---

## 1. Jerarquía del Directorio de Componentes

Todos los componentes UI en `frontend/src/components/` se organizan en 5 capas funcionales:

```mermaid
flowchart TD
  Components["frontend/src/components/"] --> Actions["actions/ (Formularios, Modales, Descarga PDF, Enlaces)"]
  Components --> Display["data/display/ (Secciones y Tarjetas de Dominio)"]
  Components --> Layout["layout/ (Header, Footer, HeroHijri, HomeSection)"]
  Components --> Nav["navigation/ (LanguagePicker)"]
  Components --> Starwind["starwind/ (Primitivas Accesibles: Dialog, Sheet, Table, Tabs, Select, Accordion)"]
```

---

## 2. Componentes de Acción (`src/components/actions/`)

| Componente | Controlador (`*.controller.ts`) | Propósito |
| :--- | :--- | :--- |
| `ContactAndVisitFormsSection` | `contact-and-visit-forms.controller.ts` | Formulario con pestañas para mensajes de contacto (`contact-message`) y reservas de visitas guiadas (`visit-booking`), conectado a `POST /api/submissions` |
| `CourseEnrollmentForm` | `course-enrollment-form.controller.ts` | Modal (`Starwind Dialog`) abierto desde las tarjetas de `AcademyCoursesSection` (`data-enroll-course-slug`), enviando `course-enrollment` |
| `DonationSubmissionForm` | `donation-submission-form.controller.ts` | Modal para registrar comprobantes de donación (`donation-submission`), pre-llenando la campaña o factura de servicio público |
| `ServiceDeskIntakeSection` | `service-desk-intake.controller.ts` | Modal dinámico para los 5 flujos de atención (`service-desk-request`: Khutbah, Nikah, Janazah, Shahada o Certificados) |
| `DownloadPDF` | `download-pdf.controller.ts` | Captura `#pdf-table-content` con `html2canvas-pro` + `jspdf` para exportar el horario mensual de oración en PDF A4 horizontal |
| `Link` | — | Botón/enlace polimórfico con variantes CVA (`primary`, `secondary`, `ghost`) y soporte de íconos |

---

## 3. Componentes de Visualización de Dominio (`src/components/data/display/`)

| Grupo de Dominio | Componentes | Características Clave |
| :--- | :--- | :--- |
| **Oración y Calendario Hijri** | `DailyPrayTime`, `MonthlyPrayTime`, `DailyDuaModal`, `QiblaAndObservancesSection`, `RamadanScheduleBanner` | Resaltado en vivo de la oración activa, audio de pronunciación de la súplica diaria, tabla mensual desplegable, rumbo Qibla (`65.24° ENE`) |
| **Eventos y Spotlights** | `NextEventsSection`, `EventsCatalogSection`, `EventDetailSection`, `EventVerticalCard`, `EventSpotlightDock` | Filtros por categoría/audiencia, exportación `.ics`, dock flotante en esquina con visor de póster y cuenta regresiva |
| **Academia y Fe** | `AcademyCoursesSection`, `ArticleDetailSection`, `FivePillarsSection`, `ScriptureExplorerSection`, `VisitorEtiquetteSection`, `FaqAccordionSection` | Explorador de aleyas y hadices por tema, contador interactivo Tasbih 33/99 (`scripture-explorer.controller.ts`), bloques Tiptap |
| **Donaciones y Zakat** | `DonationImpactSection`, `DonationCampaignsSection`, `ZakatCalculatorSection`, `PaymentChannelsSection`, `UtilityInvoicesSection` | Calculadora de Nisab en Oro/Plata (`zakat-calculator.controller.ts`), copiado de cuentas bancarias en un clic, apadrinamiento de recibos |
| **Medios, Recursos y Comunidad** | `MediaHighlightsSection`, `MediaArchiveSection`, `PublicationsAndGlossarySection`, `PhotoGalleriesSection`, `CommunityBroadcastChannelsSection`, `CommunityServicesSection`, `AboutInstitutionalSections`, `SiteSearchSection`, `UrgentAlertBanner`, `TiptapContent` | Búsqueda y filtros en cliente, canales de WhatsApp/Telegram, banner de alerta urgente persistente en `localStorage` |

---

## 4. Patrón de Controladores Cliente (`*.controller.ts`)

1. **Inicialización Idempotente**: Todo controlador exporta `init*(root: ParentNode = document)` y evita doble enlace mediante `dataset.*Initialized = "true"`.
2. **Manipulación Segura del DOM**: Utiliza `textContent`, `setAttribute`, `classList` y `DOMParser`, nunca `innerHTML`.
3. **Pruebas Unitarias Directas**: Al recibir `root`, las pruebas en Vitest renderizan el componente con `renderAstroComponentToDom()` e invocan `init*(root)` directamente en Happy DOM.
