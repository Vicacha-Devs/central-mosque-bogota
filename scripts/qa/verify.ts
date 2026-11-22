import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { QaCheckResult, QaRepoReport } from "./types.ts";

import { writeQaDashboard } from "./dashboard.ts";
import { runCentralMosqueDoctor } from "./doctor.ts";
import { runCentralMosqueJudges } from "./judges.ts";
import {
  discoverSiblingReports,
  summarizeChecks,
  writeQaReport,
} from "./types.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const strict = process.argv.includes("--strict");
const runFull = process.argv.includes("--full");

function runGate(
  id: string,
  name: string,
  bin: string,
  args: string[],
  cwd: string
): QaCheckResult {
  const start = Date.now();
  try {
    execFileSync(bin, args, { cwd, stdio: "pipe", encoding: "utf8" });
    return {
      id,
      name,
      category: "verify",
      status: "pass",
      durationMs: Date.now() - start,
      summary: `Passed in ${Date.now() - start}ms`,
    };
  } catch (err) {
    const out = String(
      (err as { stderr?: string; stdout?: string; message?: string }).stderr ||
        (err as { stdout?: string }).stdout ||
        (err as Error).message
    );
    return {
      id,
      name,
      category: "verify",
      status: "fail",
      durationMs: Date.now() - start,
      summary: `Failed (${Date.now() - start}ms)`,
      details: out.trim().split("\n").slice(-10),
    };
  }
}

const doctor = runCentralMosqueDoctor(repoRoot);
const judges = runCentralMosqueJudges(repoRoot);
const verifyChecks: QaCheckResult[] = [];

const backendDir = join(repoRoot, "apps", "backend");
const backendTestsDir = join(backendDir, "tests");
if (existsSync(backendTestsDir)) {
  const testFiles = readdirSync(backendTestsDir)
    .filter((f) => f.endsWith(".test.ts"))
    .sort()
    .map((f) => join("tests", f));
  if (testFiles.length > 0) {
    verifyChecks.push(
      runGate(
        "backend-plugin-runtime",
        "Backend Config, Lifecycle & 10-Plugin Runtime E2E Suite",
        process.execPath,
        ["--import", "./tests/register-ts-resolver.mts", "--test", ...testFiles],
        backendDir
      )
    );
  }
}

if (runFull) {
  verifyChecks.push(
    runGate(
      "monorepo-verify-all",
      "Full Monorepo Verify Gate (scripts/verify-all.ts)",
      process.execPath,
      [join(repoRoot, "scripts", "verify-all.ts")],
      repoRoot
    )
  );
} else {
  const vitestBin = join(
    repoRoot,
    "apps",
    "frontend",
    "node_modules",
    ".bin",
    "vitest"
  );
  if (existsSync(vitestBin)) {
    verifyChecks.push(
      runGate(
        "frontend-unit-tests",
        "Astro Frontend Vitest Unit Suite",
        vitestBin,
        ["--project=unit", "--run"],
        join(repoRoot, "apps", "frontend")
      )
    );
  } else {
    verifyChecks.push({
      id: "frontend-unit-tests",
      name: "Astro Frontend Vitest Unit Suite",
      category: "verify",
      status: "skip",
      durationMs: 0,
      summary: "Skipped (run pnpm install to enable frontend Vitest)",
    });
  }
}

const allChecks = [...doctor.checks, ...judges.checks, ...verifyChecks];
const report: QaRepoReport = {
  schemaVersion: "qa-report/v1",
  repoId: "central-mosque-bogota",
  repoName: "Central Mosque of Bogota",
  ecosystem: "project",
  repoPath: repoRoot,
  generatedAt: new Date().toISOString(),
  nodeVersion: process.versions.node,
  linkMode: doctor.linkMode,
  summary: summarizeChecks(allChecks, 0),
  checks: allChecks,
  plugins: [],
  drifts: doctor.drifts,
};

const reportPath = writeQaReport(repoRoot, report);
const siblingReports = discoverSiblingReports(repoRoot);
const dashPath = writeQaDashboard(
  repoRoot,
  siblingReports.length > 1
    ? "Vicacha Ecosystem QA Control Center"
    : `${report.repoName} QA Report`,
  siblingReports.length > 0 ? siblingReports : [report]
);

for (const c of allChecks) {
  process.stdout.write(
    `[${c.status.toUpperCase()}] ${c.name} (${c.durationMs}ms) — ${c.summary}\n`
  );
}
process.stdout.write(`\nReport: ${reportPath}\nDashboard: ${dashPath}\n`);

if (report.summary.fail > 0 || (strict && report.summary.warn > 0)) {
  process.exit(1);
}
