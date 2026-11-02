import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface LineViolation {
  file: string;
  lines: number;
}

interface VerificationStep {
  name: string;
  bin: string;
  args: string[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");
const docsDir = path.join(rootDir, "docs");
const docsContentDir = path.join(docsDir, "src/content/docs");
const MAX_DOC_LINES = 500;

function collectDocFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectDocFiles(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

function verifyDocLineLimits(): void {
  const files = collectDocFiles(docsContentDir);
  const violations: LineViolation[] = [];
  for (const filePath of files) {
    const lineCount = fs.readFileSync(filePath, "utf-8").split("\n").length;
    if (lineCount > MAX_DOC_LINES) {
      violations.push({
        file: path.relative(rootDir, filePath),
        lines: lineCount,
      });
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `Documentation line limit (${MAX_DOC_LINES}) exceeded:\n` +
        violations.map((v) => `  - ${v.file}: ${v.lines} lines`).join("\n")
    );
  }
  process.stdout.write(
    `[OK] Verified ${files.length} documentation files are <= ${MAX_DOC_LINES} lines.\n`
  );
}

const backendTestFiles = fs
  .readdirSync(path.join(backendDir, "tests"))
  .filter((name) => name.endsWith(".test.ts"))
  .sort()
  .map((name) => path.join("tests", name));

const BACKEND_STEPS: VerificationStep[] = [
  {
    name: "tsc --noEmit (backend)",
    bin: path.join(backendDir, "node_modules/.bin/tsc"),
    args: ["--noEmit"],
  },
  {
    name: "node --test backend & 10-plugin suite",
    bin: process.execPath,
    args: [
      "--import",
      "./tests/register-ts-resolver.mjs",
      "--test",
      ...backendTestFiles,
    ],
  },
];

const FRONTEND_STEPS: VerificationStep[] = [
  {
    name: "oxfmt --check",
    bin: path.join(frontendDir, "node_modules/.bin/oxfmt"),
    args: ["--check"],
  },
  {
    name: "eslint . --quiet",
    bin: path.join(frontendDir, "node_modules/.bin/eslint"),
    args: [".", "--quiet"],
  },
  {
    name: "astro check",
    bin: path.join(frontendDir, "node_modules/.bin/astro"),
    args: ["check"],
  },
  {
    name: "vitest unit coverage",
    bin: path.join(frontendDir, "node_modules/.bin/vitest"),
    args: ["--project=unit", "--run", "--coverage"],
  },
  {
    name: "astro build",
    bin: path.join(frontendDir, "node_modules/.bin/astro"),
    args: ["build"],
  },
  {
    name: "storybook build",
    bin: path.join(frontendDir, "node_modules/.bin/storybook"),
    args: ["build"],
  },
];

verifyDocLineLimits();

for (const step of BACKEND_STEPS) {
  process.stdout.write(`\n=== Running Backend Gate: ${step.name} ===\n`);
  execFileSync(step.bin, step.args, { cwd: backendDir, stdio: "inherit" });
}

for (const step of FRONTEND_STEPS) {
  process.stdout.write(`\n=== Running Frontend Gate: ${step.name} ===\n`);
  execFileSync(step.bin, step.args, { cwd: frontendDir, stdio: "inherit" });
}

const docsAstroBin = path.join(docsDir, "node_modules/.bin/astro");
if (fs.existsSync(docsAstroBin)) {
  process.stdout.write("\n=== Running Docs Gate: sync-typedoc & astro build ===\n");
  execFileSync(process.execPath, ["./scripts/sync-typedoc.ts"], {
    cwd: docsDir,
    stdio: "inherit",
  });
  verifyDocLineLimits();
  execFileSync(docsAstroBin, ["build"], { cwd: docsDir, stdio: "inherit" });
}

process.stdout.write("\n[SUCCESS] All Central Mosque verification gates passed!\n");
