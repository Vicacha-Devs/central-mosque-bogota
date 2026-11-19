import { fetchIslamSuiteFromStrapi } from "@services/strapi";
import type { TIslamicApiZakatNisabResponse } from "@utils/models/islamic";
import type { LiveLoader } from "astro/loaders";

import { fetchIslamicData } from "../api";

export type TZakatNisabEntry = {
  fetchedAt: string;
  standard: "classical" | "common";
  currency: string;
  weightUnit: string;
  zakatRate: number;
  gold: {
    weightGrams: number;
    unitPrice: number;
    nisabAmount: number;
  };
  silver: {
    weightGrams: number;
    unitPrice: number;
    nisabAmount: number;
  };
};

type ZakatFilter = {
  standard?: "classical" | "common";
  currency?: "cop" | "usd";
  unit?: "g" | "oz";
};

const FALLBACK_RATES: Record<
  "cop" | "usd",
  { goldUnit: number; silverUnit: number }
> = {
  cop: { goldUnit: 385000, silverUnit: 4400 },
  usd: { goldUnit: 92.5, silverUnit: 1.05 },
};

function buildFallbackZakatNisab(
  standard: "classical" | "common" = "common",
  currency: "cop" | "usd" = "cop"
): TZakatNisabEntry {
  const goldWeight = standard === "classical" ? 87.48 : 85;
  const silverWeight = standard === "classical" ? 612.36 : 595;
  const rates = FALLBACK_RATES[currency];

  return {
    fetchedAt: new Date().toISOString(),
    standard,
    currency,
    weightUnit: "gram",
    zakatRate: 0.025,
    gold: {
      weightGrams: goldWeight,
      unitPrice: rates.goldUnit,
      nisabAmount: Math.round(goldWeight * rates.goldUnit * 100) / 100,
    },
    silver: {
      weightGrams: silverWeight,
      unitPrice: rates.silverUnit,
      nisabAmount: Math.round(silverWeight * rates.silverUnit * 100) / 100,
    },
  };
}

/**
 * Astro 7 LiveLoader for `@vicacha-devs/strapi-plugin-islam` (`/api/islam/nisab`)
 * and IslamicAPI `zakat-nisab/` endpoint (`https://islamicapi.com/api/v1/zakat-nisab/`).
 * Supports Colombian Peso (`cop`) and USD (`usd`) with automatic fallback when offline.
 */
export function zakatNisabLoader(): LiveLoader<
  TZakatNisabEntry,
  ZakatFilter,
  ZakatFilter
> {
  return {
    name: "zakat-nisab-loader",

    loadCollection: async ({ filter }) => {
      const standard = filter?.standard ?? "common";
      const unit = filter?.unit ?? "g";
      const currencies: Array<"cop" | "usd"> = ["cop", "usd"];

      const entries = await Promise.all(
        currencies.map(async (currency) => {
          try {
            const strapiNisab =
              await fetchIslamSuiteFromStrapi<TZakatNisabEntry>("nisab", {
                standard,
                currency: currency.toUpperCase(),
                unit,
              });
            if (strapiNisab?.gold.nisabAmount) {
              return {
                id: `${standard}-${currency}`,
                data: {
                  ...strapiNisab,
                  currency,
                },
              };
            }

            const res = await fetchIslamicData<TIslamicApiZakatNisabResponse>(
              "zakat-nisab/",
              { standard, currency, unit }
            );
            return {
              id: `${standard}-${currency}`,
              data: {
                fetchedAt: res.updated_at || new Date().toISOString(),
                standard: res.calculation_standard,
                currency: res.currency || currency,
                weightUnit: res.weight_unit || "gram",
                zakatRate: 0.025,
                gold: {
                  weightGrams: res.data.nisab_thresholds.gold.weight,
                  unitPrice: res.data.nisab_thresholds.gold.unit_price,
                  nisabAmount: res.data.nisab_thresholds.gold.nisab_amount,
                },
                silver: {
                  weightGrams: res.data.nisab_thresholds.silver.weight,
                  unitPrice: res.data.nisab_thresholds.silver.unit_price,
                  nisabAmount: res.data.nisab_thresholds.silver.nisab_amount,
                },
              },
            };
          } catch {
            return {
              id: `${standard}-${currency}`,
              data: buildFallbackZakatNisab(standard, currency),
            };
          }
        })
      );

      return { entries };
    },

    loadEntry: async ({ filter }) => {
      const standard = filter.standard ?? "common";
      const currency = filter.currency ?? "cop";
      const unit = filter.unit ?? "g";

      try {
        const strapiNisab = await fetchIslamSuiteFromStrapi<TZakatNisabEntry>(
          "nisab",
          {
            standard,
            currency: currency.toUpperCase(),
            unit,
          }
        );
        if (strapiNisab?.gold.nisabAmount) {
          return {
            id: `${standard}-${currency}`,
            data: {
              ...strapiNisab,
              currency,
            },
          };
        }

        const res = await fetchIslamicData<TIslamicApiZakatNisabResponse>(
          "zakat-nisab/",
          { standard, currency, unit }
        );
        return {
          id: `${standard}-${currency}`,
          data: {
            fetchedAt: res.updated_at || new Date().toISOString(),
            standard: res.calculation_standard,
            currency: res.currency || currency,
            weightUnit: res.weight_unit || "gram",
            zakatRate: 0.025,
            gold: {
              weightGrams: res.data.nisab_thresholds.gold.weight,
              unitPrice: res.data.nisab_thresholds.gold.unit_price,
              nisabAmount: res.data.nisab_thresholds.gold.nisab_amount,
            },
            silver: {
              weightGrams: res.data.nisab_thresholds.silver.weight,
              unitPrice: res.data.nisab_thresholds.silver.unit_price,
              nisabAmount: res.data.nisab_thresholds.silver.nisab_amount,
            },
          },
        };
      } catch {
        return {
          id: `${standard}-${currency}`,
          data: buildFallbackZakatNisab(standard, currency),
        };
      }
    },
  };
}
