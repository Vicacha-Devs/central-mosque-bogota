import * as sensinumLoader from "@sensinum/astro-strapi-loader";
import type { LoaderContext } from "astro/loaders";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createResilientStrapiLoader,
  createStrapiSingleTypeLoader,
} from "./loader";

vi.mock("@sensinum/astro-strapi-loader", () => ({
  strapiLoader: vi.fn(),
}));

function makeLoaderContext() {
  const records = new Map<string, unknown>();
  const store = {
    clear: vi.fn(() => {
      records.clear();
    }),
    set: vi.fn((entry: { id: string; data: unknown }) => {
      records.set(entry.id, entry.data);
      return true;
    }),
  };
  const logger = {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
  const context = {
    store,
    logger,
    parseData: vi.fn(({ data }: { data: unknown }) => Promise.resolve(data)),
    generateDigest: vi.fn(() => "digest-1"),
  } as unknown as LoaderContext;

  return { context, records, store, logger };
}

describe("strapi resilient loader", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should load entries from Strapi and apply mapStrapiEntry when online", async () => {
    vi.mocked(sensinumLoader.strapiLoader).mockReturnValue({
      name: "mock-strapi",
      load: async (ctx: LoaderContext) => {
        ctx.store.clear();
        await ctx.parseData({ id: "doc-1", data: { title: "Hello" } });
        ctx.store.set({
          id: "doc-1",
          data: { slug: "hello", title: "Hello" },
        });
        ctx.store.set({
          id: "doc-2",
          data: { slug: "", title: "No Slug" },
        });
      },
    });

    const loader = createResilientStrapiLoader({
      contentType: "article",
      url: "http://127.0.0.1:1337/online-1",
      locales: ["es"],
      fallbackByLocale: () => [{ slug: "fb", title: "Fallback" }],
      mapStrapiEntry: (raw) => ({
        slug: typeof raw.slug === "string" ? raw.slug : "",
        title: typeof raw.title === "string" ? raw.title : "",
      }),
    });

    const { context, records } = makeLoaderContext();
    await loader.load(context);

    expect(records.has("es:hello")).toBe(true);
    expect(records.has("es:doc-2")).toBe(true);
  });

  it("should load raw entries and fall back when Strapi errors or offline cache is active", async () => {
    vi.mocked(sensinumLoader.strapiLoader)
      .mockReturnValueOnce({
        name: "mock-strapi-raw",
        load: (ctx: LoaderContext) => {
          ctx.store.set({
            id: "raw-1",
            data: { slug: "raw-slug" },
          });
          return Promise.resolve();
        },
      })
      .mockReturnValueOnce({
        name: "mock-strapi-fail",
        load: () => Promise.reject(new Error("Offline")),
      });

    const loader = createResilientStrapiLoader({
      contentType: "event",
      url: "http://127.0.0.1:1337/offline-test",
      locales: ["es", "en", "ar"],
      fallbackByLocale: () => [{ slug: "" }, { slug: "named" }],
    });

    const { context, records, logger } = makeLoaderContext();
    await loader.load(context);

    expect(records.has("es:raw-slug")).toBe(true);
    expect(records.has("en:event-0")).toBe(true);
    expect(records.has("en:named")).toBe(true);
    expect(records.has("ar:event-0")).toBe(true);
    expect(logger.warn).toHaveBeenCalled();
  });

  it("should fall back when strapiLoader times out and support single-type loaders", async () => {
    vi.useFakeTimers();
    vi.mocked(sensinumLoader.strapiLoader)
      .mockReturnValueOnce({
        name: "mock-timeout",
        load: () =>
          new Promise(() => {
            return;
          }),
      })
      .mockReturnValueOnce({
        name: "mock-single-default",
        load: (ctx: LoaderContext) => {
          ctx.store.set({
            id: "single-1",
            data: { heading: "From Strapi" },
          });
          return Promise.resolve();
        },
      })
      .mockReturnValueOnce({
        name: "mock-single-custom",
        load: (ctx: LoaderContext) => {
          ctx.store.set({
            id: "single-2",
            data: { heading: "Custom Mapped" },
          });
          return Promise.resolve();
        },
      });

    const timeoutLoader = createStrapiSingleTypeLoader({
      contentType: "about-page",
      url: "http://127.0.0.1:1337/timeout-url",
      locales: ["es"],
      fallbackByLocale: () => ({ heading: "Fallback Heading" }),
    });

    const { context, records } = makeLoaderContext();
    const loadPromise = timeoutLoader.load(context);
    await vi.advanceTimersByTimeAsync(3000);
    await loadPromise;
    expect(records.has("es:about-page")).toBe(true);

    const singleDefault = createStrapiSingleTypeLoader({
      contentType: "about-page",
      url: "http://127.0.0.1:1337/single-default",
      locales: ["es"],
      fallbackByLocale: () => ({ heading: "Default" }),
    });
    const ctx2 = makeLoaderContext();
    await singleDefault.load(ctx2.context);
    expect(ctx2.records.get("es:about-page")).toMatchObject({
      heading: "From Strapi",
      slug: "about-page",
    });

    const singleCustom = createStrapiSingleTypeLoader({
      contentType: "about-page",
      url: "http://127.0.0.1:1337/single-custom",
      locales: ["es"],
      fallbackByLocale: () => ({ heading: "Default" }),
      mapStrapiEntry: (raw) => ({ heading: `Mapped:${String(raw.heading)}` }),
    });
    const ctx3 = makeLoaderContext();
    await singleCustom.load(ctx3.context);
    expect(ctx3.records.get("es:about-page")).toMatchObject({
      heading: "Mapped:Custom Mapped",
      slug: "about-page",
    });
  });
});
