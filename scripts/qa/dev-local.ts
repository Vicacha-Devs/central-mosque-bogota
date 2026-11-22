import type { ChildProcess } from "node:child_process";

import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { inspectCentralMosqueLinks } from "./link-plugins.ts";

interface ProcessSpec {
  label: string;
  bin: string;
  args: string[];
  cwd: string;
  env?: Record<string, string>;
}

const SLUG_RE = /^[a-z0-9-]+$/;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const strapiExtDir = resolve(repoRoot, "../strapi-v5-extensions");
const astroBlocksDir = resolve(repoRoot, "../astro-tiptap-blocks");

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const buildFirst = argv.includes("--build-first");
const backendOnly = argv.includes("--backend-only");
const frontendOnly = argv.includes("--frontend-only");
const skipWatch = argv.includes("--no-watch");

const pluginsFlag = argv.find((a) => a.startsWith("--plugins="));
const pluginSlugs = pluginsFlag
  ? pluginsFlag
      .slice("--plugins=".length)
      .split(",")
      .map((s) => s.trim().replace(/^strapi-plugin-/, ""))
      .filter(Boolean)
  : [];

for (const slug of pluginSlugs) {
  if (!SLUG_RE.test(slug)) {
    console.error(`[qa:dev:local] Invalid plugin slug "${slug}"`);
    process.exit(1);
  }
}

const links = inspectCentralMosqueLinks(repoRoot);
if (links.mode !== "local" || links.brokenLocalPaths.length > 0) {
  console.error(
    `[qa:dev:local] Expected clean local file: mode (current mode=${links.mode}, broken=${links.brokenLocalPaths.length}). Run "pnpm qa:link:local" first.`
  );
  process.exit(1);
}

const preBuilds: ProcessSpec[] = [];
if (buildFirst) {
  if (existsSync(strapiExtDir)) {
    const buildArgs =
      pluginSlugs.length > 0
        ? [
            ...pluginSlugs.flatMap((s) => [
              "--filter",
              `@vicacha-devs/strapi-plugin-${s}`,
            ]),
            "build",
          ]
        : ["build"];
    preBuilds.push({
      label: "build:strapi-plugins",
      bin: "pnpm",
      args: buildArgs,
      cwd: strapiExtDir,
    });
  }
  if (existsSync(astroBlocksDir)) {
    preBuilds.push({
      label: "build:astro-tiptap-blocks",
      bin: "pnpm",
      args: ["build"],
      cwd: astroBlocksDir,
    });
  }
}

const watchers: ProcessSpec[] = [];
if (!skipWatch && existsSync(strapiExtDir)) {
  const watchArgs =
    pluginSlugs.length > 0
      ? [
          ...pluginSlugs.flatMap((s) => [
            "--filter",
            `@vicacha-devs/strapi-plugin-${s}`,
          ]),
          "--parallel",
          "watch",
        ]
      : ["--filter", "./packages/strapi-plugin-*", "--parallel", "watch"];
  watchers.push({
    label: "watch:strapi-plugins",
    bin: "pnpm",
    args: watchArgs,
    cwd: strapiExtDir,
  });
}

if (!frontendOnly) {
  watchers.push({
    label: "mosque:backend",
    bin: "pnpm",
    args: ["dev:backend"],
    cwd: repoRoot,
  });
}

if (!backendOnly) {
  watchers.push({
    label: "mosque:frontend",
    bin: "pnpm",
    args: ["dev:frontend"],
    cwd: repoRoot,
  });
}

if (dryRun) {
  process.stdout.write(
    `[qa:dev:local] DRY RUN (mode=${links.mode}, linked=${links.localCount})\n`
  );
  for (const step of preBuilds) {
    process.stdout.write(
      `  [pre-build] (${step.label}) cwd=${step.cwd} -> ${step.bin} ${step.args.join(" ")}\n`
    );
  }
  for (const proc of watchers) {
    process.stdout.write(
      `  [spawn]     (${proc.label}) cwd=${proc.cwd} -> ${proc.bin} ${proc.args.join(" ")}\n`
    );
  }
  process.exit(0);
}

for (const step of preBuilds) {
  process.stdout.write(`[qa:dev:local] Running ${step.label}...\n`);
  execFileSync(step.bin, step.args, { cwd: step.cwd, stdio: "inherit" });
}

const children: ChildProcess[] = [];
let shuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (shuttingDown) return;
  shuttingDown = true;
  process.stdout.write(`\n[qa:dev:local] Stopping all processes (${signal})...\n`);
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

for (const proc of watchers) {
  process.stdout.write(`[qa:dev:local] Starting ${proc.label}...\n`);
  const child = spawn(proc.bin, proc.args, {
    cwd: proc.cwd,
    env: { ...process.env, ...(proc.env ?? {}) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);

  const prefix = `[${proc.label}] `;
  child.stdout?.on("data", (chunk: Buffer) => {
    for (const line of chunk.toString("utf8").split("\n")) {
      if (line.length > 0) process.stdout.write(`${prefix}${line}\n`);
    }
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    for (const line of chunk.toString("utf8").split("\n")) {
      if (line.length > 0) process.stderr.write(`${prefix}${line}\n`);
    }
  });
  child.on("exit", (code) => {
    if (!shuttingDown && code && code !== 0) {
      process.stderr.write(
        `[qa:dev:local] Process ${proc.label} exited with code ${code}\n`
      );
      shutdown("SIGTERM");
      process.exitCode = code;
    }
  });
}

if (watchers.length === 0) {
  process.stdout.write(
    `[qa:dev:local] No processes selected (checked ${join(repoRoot, "package.json")}).\n`
  );
}
