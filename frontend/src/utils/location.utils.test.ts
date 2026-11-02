import { fetchLocationData } from "@services/location/api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  BOGOTA_LOCATION,
  LOCATION_CONFIG,
  getClientLocation,
  invalidateLocationCache,
} from "./location.utils";

describe("location.utils and location api", () => {
  beforeEach(() => {
    invalidateLocationCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    invalidateLocationCache();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should fetch location metadata when Location API responds ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            city: "Medellín",
            country: "Colombia",
            timeZone: "America/Bogota",
          }),
      })
    );

    const data = await fetchLocationData();
    expect(data.city).toBe("Medellín");
  });

  it("should throw an error when Location API responds with non-ok status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      })
    );

    await expect(fetchLocationData()).rejects.toThrow(
      "Location API request failed (503)"
    );
  });

  it("should return fallback and cache result when navigator is undefined", async () => {
    vi.stubGlobal("navigator", undefined);

    const first = await getClientLocation();
    expect(first.city).toBe(BOGOTA_LOCATION.city);

    const second = await getClientLocation();
    expect(second).toBe(first);
  });

  it("should fall back to Bogota timezone when Intl timeZone is empty or throws", async () => {
    vi.stubGlobal("navigator", undefined);
    const dtfSpy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: "   " }),
        }) as unknown as Intl.DateTimeFormat
    );

    const first = await getClientLocation();
    expect(first.timeZone).toBe(BOGOTA_LOCATION.timeZone);

    invalidateLocationCache();
    dtfSpy.mockImplementation(() => {
      throw new Error("Intl failure");
    });

    const second = await getClientLocation();
    expect(second.timeZone).toBe(BOGOTA_LOCATION.timeZone);
  });

  it("should return fallback when window is undefined in browser check", async () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("navigator", {});

    const loc = await getClientLocation();
    expect(loc.lat).toBe(BOGOTA_LOCATION.lat);
  });

  it("should return fallback when geolocation error callback fires", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (
          _success: PositionCallback,
          error?: PositionErrorCallback
        ) => {
          error?.({} as GeolocationPositionError);
        },
      },
    });

    const loc = await getClientLocation();
    expect(loc.city).toBe(BOGOTA_LOCATION.city);
  });

  it("should return fallback when geolocation times out", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: () => {
          return;
        },
      },
    });

    const promise = getClientLocation();
    vi.advanceTimersByTime(LOCATION_CONFIG.DEFAULT_TIMEOUT_MS + 10);
    const loc = await promise;
    expect(loc.city).toBe(BOGOTA_LOCATION.city);
  });

  it("should enrich coordinates with Location API when geolocation succeeds", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: {
              latitude: 6.2442,
              longitude: -75.5812,
            } as GeolocationCoordinates,
          } as GeolocationPosition);
        },
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            city: "Medellín",
            country: "Colombia",
            timeZone: "America/Bogota",
          }),
      })
    );

    const loc = await getClientLocation();
    expect(loc.lat).toBe("6.2442");
    expect(loc.lon).toBe("-75.5812");
    expect(loc.city).toBe("Medellín");
  });

  it("should fall back to Bogota metadata when Location API fails after geolocation", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      return;
    });
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: {
              latitude: Number.NaN,
              longitude: Number.POSITIVE_INFINITY,
            } as GeolocationCoordinates,
          } as GeolocationPosition);
        },
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network offline"))
    );

    const loc = await getClientLocation();
    expect(loc.lat).toBe(BOGOTA_LOCATION.lat);
    expect(loc.lon).toBe(BOGOTA_LOCATION.lon);
    expect(loc.city).toBe(BOGOTA_LOCATION.city);
    expect(warnSpy).toHaveBeenCalled();
  });
});
