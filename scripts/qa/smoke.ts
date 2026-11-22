const frontendUrl = process.env.MOSQUE_FRONTEND_URL || "http://127.0.0.1:4321";
const backendUrl = process.env.MOSQUE_BACKEND_URL || "";

interface SmokeTarget {
  name: string;
  url: string;
  expectedStatuses: number[];
}

const targets: SmokeTarget[] = [
  { name: "Frontend Spanish (/es)", url: `${frontendUrl}/es`, expectedStatuses: [200] },
  { name: "Frontend English (/en)", url: `${frontendUrl}/en`, expectedStatuses: [200] },
  { name: "Frontend Arabic RTL (/ar)", url: `${frontendUrl}/ar`, expectedStatuses: [200] },
  { name: "Frontend Turkish (/tr)", url: `${frontendUrl}/tr`, expectedStatuses: [200] },
  {
    name: "Prayer Calendar iCal (/api/prayer-calendar.ics)",
    url: `${frontendUrl}/api/prayer-calendar.ics`,
    expectedStatuses: [200],
  },
  {
    name: "Events Feed iCal (/api/events/feed.ics)",
    url: `${frontendUrl}/api/events/feed.ics`,
    expectedStatuses: [200],
  },
  {
    name: "Podcast RSS (/api/media-feeds/rss.xml)",
    url: `${frontendUrl}/api/media-feeds/rss.xml`,
    expectedStatuses: [200],
  },
];

if (backendUrl) {
  targets.push(
    { name: "Strapi /_health", url: `${backendUrl}/_health`, expectedStatuses: [200, 204] },
    {
      name: "Strapi Admin Auth Guard",
      url: `${backendUrl}/admin/users/me`,
      expectedStatuses: [401, 403],
    }
  );
}

let failed = 0;
for (const target of targets) {
  try {
    const res = await fetch(target.url, { redirect: "manual" });
    const ok = target.expectedStatuses.includes(res.status);
    process.stdout.write(
      `[${ok ? "PASS" : "FAIL"}] ${target.name} -> HTTP ${res.status}\n`
    );
    if (!ok) failed += 1;
  } catch (err) {
    console.error(`[FAIL] ${target.name} -> ${(err as Error).message}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`[qa:smoke] ${failed} smoke check(s) failed.`);
  process.exit(1);
}
process.stdout.write("[qa:smoke] All Central Mosque smoke checks passed.\n");
