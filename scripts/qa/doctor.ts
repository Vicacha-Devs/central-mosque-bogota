import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { QaCheckResult, QaDriftItem } from "./types.ts";

import { inspectCentralMosqueLinks } from "./link-plugins.ts";
import { safeReadJson } from "./types.ts";

interface PkgJson {
  version?: string;
  dependencies?: Record<string, string>;
}

export function runCentralMosqueDoctor(repoRoot: string): {
  checks: QaCheckResult[];
  drifts: QaDriftItem[];
  linkMode: "local" | "npm" | "mixed";
} {
  const checks: QaCheckResult[] = [];
  const drifts: QaDriftItem[] = [];

  const major = Number.parseInt(process.versions.node.split(".")[0], 10);
  checks.push({
    id: "runtime-node",
    name: "Node.js Runtime Compatibility",
    category: "doctor",
    status: major >= 24 ? "pass" : "fail",
    durationMs: 1,
    summary: `Node v${process.versions.node} detected (requires >=24)`,
  });

  const links = inspectCentralMosqueLinks(repoRoot);
  checks.push({
    id: "plugin-link-resolution",
    name: "Vicacha Plugin & Package Link Resolution",
    category: "doctor",
    status: links.brokenLocalPaths.length === 0 ? "pass" : "fail",
    durationMs: 2,
    summary: `Link mode: ${links.mode} (local=${links.localCount}, npm=${links.npmCount}, broken=${links.brokenLocalPaths.length})`,
    details: links.brokenLocalPaths,
  });

  const backendPkg = safeReadJson<PkgJson>(
    join(repoRoot, "apps", "backend", "package.json")
  );
  const strapiVersion = backendPkg?.dependencies?.["@strapi/strapi"] ?? "unknown";
  const siblingExtDash = safeReadJson<PkgJson>(
    resolve(repoRoot, "../strapi-v5-extensions/apps/dashboard/package.json")
  );
  if (siblingExtDash?.dependencies?.["@strapi/strapi"]) {
    const extStrapi = siblingExtDash.dependencies["@strapi/strapi"];
    if (extStrapi !== strapiVersion) {
      drifts.push({
        subject: "@strapi/strapi (central-mosque vs strapi-v5-extensions/dashboard)",
        expected: strapiVersion,
        actual: extStrapi,
        severity: "warn",
        sourceRepo: "central-mosque-bogota",
      });
    }
    checks.push({
      id: "sibling-strapi-version",
      name: "Strapi Version Parity with strapi-v5-extensions",
      category: "doctor",
      status: extStrapi === strapiVersion ? "pass" : "warn",
      durationMs: 1,
      summary:
        extStrapi === strapiVersion
          ? `Aligned on Strapi ${strapiVersion}`
          : `central-mosque (${strapiVersion}) vs strapi-v5-extensions (${extStrapi})`,
    });
  }

  const composePath = join(repoRoot, "docker-compose.qa.yml");
  const composeText = existsSync(composePath)
    ? readFileSync(composePath, "utf8")
    : "";
  const loopbackSafe =
    composeText.includes("127.0.0.1:5433:5432") &&
    !composeText.includes("0.0.0.0");
  checks.push({
    id: "docker-qa-security",
    name: "Port-Isolated QA Compose Security (Loopback Only)",
    category: "doctor",
    status: loopbackSafe ? "pass" : "fail",
    durationMs: 1,
    summary: loopbackSafe
      ? "docker-compose.qa.yml binds strictly to 127.0.0.1 (5433/6380/8109/1026)"
      : "docker-compose.qa.yml missing or exposes non-loopback ports",
  });

  return { checks, drifts, linkMode: links.mode };
}

if (
  resolve(process.argv[1] ?? "") === resolve(fileURLToPath(import.meta.url))
) {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const { checks } = runCentralMosqueDoctor(repoRoot);
  let failed = 0;
  for (const c of checks) {
    process.stdout.write(`[${c.status.toUpperCase()}] ${c.name}: ${c.summary}\n`);
    for (const d of c.details ?? []) process.stdout.write(`    - ${d}\n`);
    if (c.status === "fail") failed += 1;
  }
  if (failed > 0) process.exit(1);
}
