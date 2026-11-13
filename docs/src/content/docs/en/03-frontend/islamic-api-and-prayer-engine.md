---
title: IslamicAPI, Prayer Schedule & Zakat Nisab Engine
description: Deep dive into prayer time calculations, active prayer detection, Hijri date formatting, and Zakat Nisab loaders.
---

## 1. 3-Tier Prayer Times Loader (`prayerTimesLoader.ts`)

Registered in `frontend/src/live.config.ts` as the `prayerTimes` Live Collection, `prayerTimesLoader` supports both **daily** (`loadEntry`) and **monthly** (`loadCollection` with `YYYY-MM`) queries:

```mermaid
flowchart TD
  Req["getLiveEntry('prayerTimes', { date, languageCode })"] --> Loc["Resolve Coordinates: getClientLocation() or Strapi defaultLat/defaultLon (4.6663, -74.0725)"]
  Loc --> Tier1["Tier 1: Strapi v5 /api/islam/prayer-times/today (or /month)"]
  Tier1 --> T1Ok{"Valid Times Returned?"}
  T1Ok -- "Yes" --> Adapt["buildPrayerData() -> Active Prayer + Hijri Date"]
  T1Ok -- "No" --> Tier2["Tier 2: IslamicAPI v1 /prayer-time/"]
  Tier2 --> T2Ok{"HTTP 200?"}
  T2Ok -- "Yes" --> Adapt
  T2Ok -- "No / Offline" --> Tier3["Tier 3: Deterministic Bogotá Fallback Schedule"]
  Tier3 --> Adapt
```

---

## 2. Active Prayer Calculation (`src/utils/islamic.utils.ts`)

`calculateActivePrayer(times: TPrayerTimes, currentMinutes?: number)` determines which obligatory prayer (`fajr`, `dhuhr`, `asr`, `maghrib`, `isha`) is currently active in Bogotá (`America/Bogota` timezone):

1. **Buffer Window Before Sunrise (`BUFFER_MINUTES_BEFORE_SUNRISE = 45`)**:
   - Between `Sunrise` and `Dhuhr` (specifically once `currentMinutes >= sunriseMinutes - 45` and `< dhuhrMinutes`), `calculateActivePrayer` returns `undefined` because Sunrise (`shuruq`) is a transition boundary rather than an obligatory prayer window.
2. **Midnight Wrap-Around for Isha**:
   - If `currentMinutes >= ishaMinutes` OR `currentMinutes < fajrMinutes` (after midnight before Fajr), `isha` remains the active prayer.
3. **Only Today Highlights an Active Prayer**:
   - `buildPrayerData` (`src/services/islamicAPI/adaptor/buildPrayerData.ts`) checks `isSameDay(date, new Date())` and only sets `activePray` when rendering today's entry.

---

## 3. Zakat Nisab Loader & Calculator (`zakatNisabLoader.ts`)

Registered in `frontend/src/live.config.ts` as `zakatNisab`, supporting:
- **Calculation Standards**: `"common"` (85g Gold / 595g Silver) and `"classical"` (87.48g Gold / 612.36g Silver).
- **Currencies**: `"cop"` (Colombian Peso default), `"usd"`, `"eur"`, `"try"`, `"sar"`.
- **Client Controller (`zakat-calculator.controller.ts`)**:
  - Computes `totalAssets = cash + gold + investments + receivables`.
  - Computes `netWealth = Math.max(0, totalAssets - liabilities)`.
  - Compares `netWealth` against the selected Nisab basis (`silver` recommended for broader community benefit, or `gold`) and calculates `zakatDue = netWealth * 0.025` (2.5%) when `netWealth >= nisabThreshold`.
