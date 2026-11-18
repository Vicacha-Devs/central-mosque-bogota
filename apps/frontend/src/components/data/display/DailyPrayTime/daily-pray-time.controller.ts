import { calculateActivePrayer, CONFIG } from "@utils/islamic.utils";
import type { TDailyPrayer } from "@utils/models/types";
import { getCurrentMinutes, parseTimeToMinutes } from "@utils/time.utils";
import { DAILY_PRAYERS } from "@utils/ui.constants";

let updateTimer: number | null = null;

function updateUI(root: HTMLElement): void {
  const timeZone = root.dataset.timezone ?? "America/Bogota";
  const sunriseStr = root.dataset.sunrise;
  const now = getCurrentMinutes(timeZone);

  const times: Record<TDailyPrayer, number | null> = {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
  };

  const prayerNodes = new Map<
    TDailyPrayer,
    { el: HTMLElement; label: HTMLElement | null }
  >();

  for (const el of root.querySelectorAll<HTMLElement>("[data-prayer-item]")) {
    const key = el.getAttribute("data-prayer");
    if (!key || !DAILY_PRAYERS.includes(key as TDailyPrayer)) continue;

    const timeStr = el.getAttribute("data-time");
    const label = el.querySelector<HTMLElement>("[data-prayer-label]");

    times[key as TDailyPrayer] = parseTimeToMinutes(timeStr);
    prayerNodes.set(key as TDailyPrayer, { el, label });
  }

  const sunriseMin = parseTimeToMinutes(sunriseStr);
  const activeKey = calculateActivePrayer(now, times, sunriseMin);

  const orderedTimes = DAILY_PRAYERS.map((k) => times[k]).filter(
    (v): v is number => v !== null
  );
  const nextToday = orderedTimes.find((t) => t > now);
  const nextPrayerKey
    = DAILY_PRAYERS.find((k) => times[k] === nextToday) ?? null;

  const passedLabel = root.dataset.statusPassed ?? "Passed";
  const nowLabel = root.dataset.statusNow ?? "Now";
  const nextLabel = root.dataset.statusNext ?? "Up next";

  for (const [key, node] of prayerNodes.entries()) {
    const isActive = key === activeKey;

    node.el.toggleAttribute("data-prayer-item-active", isActive);

    if (isActive) node.el.setAttribute("aria-current", "time");
    else node.el.removeAttribute("aria-current");

    if (node.label) {
      node.label.toggleAttribute("data-prayer-label-active", isActive);
    }

    const statusEl = node.el.querySelector<HTMLElement>("[data-prayer-status]");
    if (statusEl) {
      const tVal = times[key];
      if (isActive) {
        statusEl.textContent = nowLabel;
        statusEl.className = "mt-1.5 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-primary-foreground uppercase";
      } else if (key === nextPrayerKey) {
        statusEl.textContent = nextLabel;
        statusEl.className = "mt-1.5 inline-block rounded-full bg-secondary/12 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-secondary uppercase dark:bg-secondary-accent/15 dark:text-secondary-accent";
      } else if (tVal !== null && tVal < now) {
        statusEl.textContent = passedLabel;
        statusEl.className = "mt-1.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase";
      } else {
        statusEl.textContent = "";
        statusEl.className = "hidden";
      }
    }
  }

  const countdownEl = root.querySelector<HTMLElement>("[data-prayer-countdown]");
  const countdownValEl = root.querySelector<HTMLElement>(
    "[data-prayer-countdown-value]"
  );
  if (countdownEl && countdownValEl && orderedTimes.length > 0) {
    const diffMin
      = nextToday !== undefined
        ? nextToday - now
        : 1440 - now + orderedTimes[0];
    const hrs = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    countdownValEl.textContent = `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
    countdownEl.classList.remove("hidden");
    countdownEl.classList.add("inline-flex");
  }
}

export function initDailyPrayerTimes(): void {
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-prayer-schedule]")
  );
  if (roots.length === 0) return;

  for (const root of roots) updateUI(root);

  if (updateTimer !== null) window.clearInterval(updateTimer);
  updateTimer = window.setInterval(() => {
    const nextRoots = Array.from(
      document.querySelectorAll<HTMLElement>("[data-prayer-schedule]")
    );
    for (const root of nextRoots) updateUI(root);
  }, CONFIG.updateIntervalMs);
}
