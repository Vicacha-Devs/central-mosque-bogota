import { expect, test } from "@playwright/test";

const PRIMARY_ROUTES = [
  "/es/about-us",
  "/es/events-and-programs",
  "/es/donate",
  "/es/media",
  "/es/community-services",
  "/es/contact-and-visit",
  "/es/islam-and-faith",
  "/es/search",
];

test.describe("Central Mosque — Core User Journeys & Feeds", () => {
  for (const route of PRIMARY_ROUTES) {
    test(`renders ${route} with HTTP 200 and non-empty main landmark`, async ({
      page,
    }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }

  test("serves valid iCalendar & Podcast RSS API endpoints", async ({
    request,
  }) => {
    const prayerIcs = await request.get("/api/prayer-calendar.ics");
    expect(prayerIcs.status()).toBe(200);
    expect(await prayerIcs.text()).toContain("BEGIN:VCALENDAR");

    const eventsIcs = await request.get("/api/events/feed.ics");
    expect(eventsIcs.status()).toBe(200);
    expect(await eventsIcs.text()).toContain("BEGIN:VCALENDAR");

    const rss = await request.get("/api/media-feeds/rss.xml");
    expect(rss.status()).toBe(200);
    expect(await rss.text()).toContain("<rss");
  });
});
