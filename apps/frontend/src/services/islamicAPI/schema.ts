import { z } from "astro/zod";

export const prayerTimeEntrySchema = z.object({
  fetchedAt: z.string(),
  location: z.string(),
  currentDate: z.string(),
  hijriDate: z.string(),
  isToday: z.boolean().optional(),
  activePray: z.string().optional(),
  times: z.object({
    fajr: z.string(),
    sunrise: z.string(),
    dhuhr: z.string(),
    asr: z.string(),
    maghrib: z.string(),
    isha: z.string(),
  }),
});

export const zakatNisabEntrySchema = z.object({
  fetchedAt: z.string(),
  standard: z.enum(["classical", "common"]),
  currency: z.string(),
  weightUnit: z.string(),
  zakatRate: z.number(),
  gold: z.object({
    weightGrams: z.number(),
    unitPrice: z.number(),
    nisabAmount: z.number(),
  }),
  silver: z.object({
    weightGrams: z.number(),
    unitPrice: z.number(),
    nisabAmount: z.number(),
  }),
});
