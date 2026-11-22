import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { assertWithinDir, safeReadJson } from "./types.ts";

interface ManifestWithDeps {
  dependencies?: Record<string, string>;
  pnpm?: { overrides?: Record<string, string> };
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const rootPkgPath = assertWithinDir(join(repoRoot, "package.json"), repoRoot);
const backendPkgPath = assertWithinDir(
  join(repoRoot, "apps", "backend", "package.json"),
  repoRoot
);
const frontendPkgPath = assertWithinDir(
  join(repoRoot, "apps", "frontend", "package.json"),
  repoRoot
);
const versionsPath = assertWithinDir(
  join(repoRoot, ".qa-plugin-versions.json"),
  repoRoot
);

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const mode = args.has("--npm")
  ? "npm"
  : args.has("--local")
    ? "local"
    : args.has("--check-ci")
      ? "check-ci"
      : "status";

export function inspectCentralMosqueLinks(root: string): {
  mode: "local" | "npm" | "mixed";
  localCount: number;
  npmCount: number;
  brokenLocalPaths: string[];
} {
  const bPkg = safeReadJson<ManifestWithDeps>(
    join(root, "apps", "backend", "package.json")
  );
  const fPkg = safeReadJson<ManifestWithDeps>(
    join(root, "apps", "frontend", "package.json")
  );
  let localCount = 0;
  let npmCount = 0;
  const brokenLocalPaths: string[] = [];

  const checkMap = (pkgDir: string, deps?: Record<string, string>) => {
    for (const [name, spec] of Object.entries(deps ?? {})) {
      if (!name.startsWith("@vicacha-devs/")) continue;
      if (spec.startsWith("file:")) {
        localCount += 1;
        const target = resolve(pkgDir, spec.slice("file:".length));
        if (!existsSync(target)) {
          brokenLocalPaths.push(`${name} -> ${spec}`);
        }
      } else {
        npmCount += 1;
      }
    }
  };

  checkMap(join(root, "apps", "backend"), bPkg?.dependencies);
  checkMap(join(root, "apps", "frontend"), fPkg?.dependencies);

  const resolvedMode =
    localCount > 0 && npmCount === 0
      ? "local"
      : npmCount > 0 && localCount === 0
        ? "npm"
        : "mixed";
  return { mode: resolvedMode, localCount, npmCount, brokenLocalPaths };
}

function resolveLocalSpec(pkgName: string, scope: "root" | "app"): string {
  const prefix = scope === "root" ? "file:.." : "file:../../..";
  if (pkgName === "@vicacha-devs/astro-tiptap-blocks") {
    return `${prefix}/astro-tiptap-blocks`;
  }
  const folder = pkgName.replace(/^@vicacha-devs\//, "");
  return `${prefix}/strapi-v5-extensions/packages/${folder}`;
}

function readTargetNpmVersions(): Record<string, string> {
  const base = safeReadJson<Record<string, string>>(versionsPath) ?? {};
  const siblingExt = resolve(repoRoot, "../strapi-v5-extensions/packages");
  const merged = { ...base };
  for (const name of Object.keys(merged)) {
    if (name === "@vicacha-devs/astro-tiptap-blocks") {
      const siblingPkg = safeReadJson<{ version?: string }>(
        resolve(repoRoot, "../astro-tiptap-blocks/package.json")
      );
      if (siblingPkg?.version) merged[name] = `^${siblingPkg.version}`;
    } else {
      const folder = name.replace(/^@vicacha-devs\//, "");
      const siblingPkg = safeReadJson<{ version?: string }>(
        join(siblingExt, folder, "package.json")
      );
      if (siblingPkg?.version) merged[name] = `^${siblingPkg.version}`;
    }
  }
  return merged;
}

if (
  resolve(process.argv[1] ?? "") === resolve(fileURLToPath(import.meta.url))
) {
  const state = inspectCentralMosqueLinks(repoRoot);
  if (mode === "status") {
    process.stdout.write(
      `[qa:link] mode=${state.mode} (local=${state.localCount}, npm=${state.npmCount})\n`
    );
    for (const broken of state.brokenLocalPaths) {
      process.stdout.write(`  [BROKEN] ${broken}\n`);
    }
    process.exit(state.brokenLocalPaths.length > 0 ? 1 : 0);
  }

  if (mode === "check-ci") {
    if (state.brokenLocalPaths.length > 0) {
      console.error(
        `[qa:link] CI check failed: ${state.brokenLocalPaths.length} unresolved local file: link(s). Run \`pnpm qa:link:npm\` or check out sibling repos.`
      );
      process.exit(1);
    }
    process.stdout.write(
      `[qa:link] CI check OK (mode=${state.mode}, 0 broken paths).\n`
    );
    process.exit(0);
  }

  const versions = readTargetNpmVersions();
  const rootPkg = JSON.parse(
    readFileSync(rootPkgPath, "utf8")
  ) as ManifestWithDeps;
  const backendPkg = JSON.parse(
    readFileSync(backendPkgPath, "utf8")
  ) as ManifestWithDeps;
  const frontendPkg = JSON.parse(
    readFileSync(frontendPkgPath, "utf8")
  ) as ManifestWithDeps;

  const changes: string[] = [];
  const rewrite = (
    label: string,
    map: Record<string, string> | undefined,
    scope: "root" | "app"
  ) => {
    if (!map) return;
    for (const [name, current] of Object.entries(map)) {
      if (!name.startsWith("@vicacha-devs/")) continue;
      const next =
        mode === "local"
          ? resolveLocalSpec(name, scope)
          : (versions[name] ?? "^1.0.0");
      if (current !== next) {
        map[name] = next;
        changes.push(`${label} ${name}: ${current} -> ${next}`);
      }
    }
  };

  rewrite("root.overrides", rootPkg.pnpm?.overrides, "root");
  rewrite("backend.deps", backendPkg.dependencies, "app");
  rewrite("frontend.deps", frontendPkg.dependencies, "app");

  if (dryRun) {
    process.stdout.write(
      `[qa:link] DRY RUN (${mode}) — ${changes.length} change(s):\n`
    );
    for (const c of changes) process.stdout.write(`  ~ ${c}\n`);
    process.exit(0);
  }

  writeFileSync(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`, "utf8");
  writeFileSync(
    backendPkgPath,
    `${JSON.stringify(backendPkg, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(
    frontendPkgPath,
    `${JSON.stringify(frontendPkg, null, 2)}\n`,
    "utf8"
  );
  process.stdout.write(
    `[qa:link] Switched to ${mode} mode (${changes.length} updates). Run \`pnpm install\` to refresh lockfile.\n`
  );
}
