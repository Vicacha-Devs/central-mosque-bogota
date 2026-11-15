const initializedBanners = new WeakSet<HTMLElement>();

export function initAlertBanner(): void {
  const bannerEl = document.getElementById("mosque-urgent-alert-banner");
  const dismissBtn = document.getElementById("mosque-alert-dismiss-btn");
  if (!bannerEl || initializedBanners.has(bannerEl)) return;
  initializedBanners.add(bannerEl);

  const code = bannerEl.getAttribute("data-alert-code") ?? "default";
  const storageKey = `mosque_alert_dismissed_${code}`;

  try {
    if (sessionStorage.getItem(storageKey) === "1") {
      bannerEl.classList.add("hidden");
    }
  } catch {
    // Ignore sessionStorage restrictions
  }

  dismissBtn?.addEventListener("click", () => {
    bannerEl.classList.add("hidden");
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore sessionStorage restrictions
    }
  });
}
