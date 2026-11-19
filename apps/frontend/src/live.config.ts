import { prayerTimesLoader } from "@services/islamicAPI/loaders/prayerTimesLoader";
import { zakatNisabLoader } from "@services/islamicAPI/loaders/zakatNisabLoader";
import {
  prayerTimeEntrySchema,
  zakatNisabEntrySchema,
} from "@services/islamicAPI/schema";
import { defineLiveCollection } from "astro/content/config";

const prayerTimes = defineLiveCollection({
  loader: prayerTimesLoader(),
  schema: prayerTimeEntrySchema,
});

const zakatNisab = defineLiveCollection({
  loader: zakatNisabLoader(),
  schema: zakatNisabEntrySchema,
});

export const collections = {
  prayerTimes,
  zakatNisab,
};
