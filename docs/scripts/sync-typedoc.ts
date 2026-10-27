import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(docsRoot, "..");
const frontendDir = path.join(repoRoot, "frontend");
const typedocOut = path.join(docsRoot, ".typedoc-out");
const enApiDir = path.join(docsRoot, "src/content/docs/en/api");
const esApiDir = path.join(docsRoot, "src/content/docs/es/api");

const ENTRY_FILES = [
  "src/i18n/ui.ts",
  "src/i18n/utils.ts",
  "src/utils/islamic.utils.ts",
  "src/utils/location.utils.ts",
  "src/utils/maths.utils.ts",
  "src/utils/positioning.utils.ts",
  "src/utils/string.utils.ts",
  "src/utils/styles.utils.ts",
  "src/utils/time.utils.ts",
  "src/services/strapi/tiptap-sanitizer.ts",
  "src/services/islamicAPI/api.ts",
];

const typedocBin = path.join(docsRoot, "node_modules/.bin/typedoc");

if (fs.existsSync(typedocBin)) {
  execFileSync(typedocBin, ["--options", "typedoc.json"], {
    cwd: docsRoot,
    stdio: "inherit",
  });
}

fs.mkdirSync(enApiDir, { recursive: true });
fs.mkdirSync(esApiDir, { recursive: true });

function resolveTypeScript(): typeof import("typescript") {
  for (const pkgDir of [docsRoot, frontendDir, path.join(repoRoot, "backend")]) {
    try {
      const req = createRequire(path.join(pkgDir, "package.json"));
      return req("typescript") as typeof import("typescript");
    } catch {
      // try next workspace package
    }
  }
  throw new Error("Could not resolve typescript in workspace");
}

function extractAstSummaries(): string[] {
  const ts = resolveTypeScript();
  const sections: string[] = [];

  for (const relPath of ENTRY_FILES) {
    const absPath = path.join(frontendDir, relPath);
    if (!fs.existsSync(absPath)) continue;
    const sourceText = fs.readFileSync(absPath, "utf-8");
    const sourceFile = ts.createSourceFile(
      relPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const items: string[] = [];
    sourceFile.forEachChild((node) => {
      const modifiers = ts.canHaveModifiers(node)
        ? ts.getModifiers(node)
        : undefined;
      const isExported = modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (!isExported) return;

      if (ts.isFunctionDeclaration(node) && node.name) {
        const params = node.parameters
          .map((p) => p.getText(sourceFile))
          .join(", ");
        const ret = node.type ? node.type.getText(sourceFile) : "unknown";
        items.push(`- \`function ${node.name.text}(${params}): ${ret}\``);
      } else if (ts.isTypeAliasDeclaration(node)) {
        items.push(`- \`type ${node.name.text}\``);
      } else if (ts.isInterfaceDeclaration(node)) {
        items.push(`- \`interface ${node.name.text}\``);
      } else if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            items.push(`- \`const ${decl.name.text}\``);
          }
        }
      }
    });

    if (items.length > 0) {
      sections.push(`### \`${relPath}\`\n\n${items.join("\n")}`);
    }
  }

  return sections;
}

const moduleSections = extractAstSummaries();
const combinedModules = moduleSections.join("\n\n").split("\n").slice(0, 400).join("\n");

const enOverview = `---
title: TypeScript API Reference (TypeDoc & AST)
description: Auto-generated TypeScript API reference for frontend services, utilities, and i18n modules.
---

This reference is generated directly from the TypeScript AST and JSDoc annotations in \`frontend/src/\` via \`docs/scripts/sync-typedoc.ts\` and **TypeDoc** (\`typedoc\` + \`typedoc-plugin-markdown\`).

\`\`\`mermaid
flowchart LR
  TS["frontend/src/**/*.ts"] --> TD["TypeDoc / TypeScript AST"]
  TD --> MD["Starlight Markdown Reference"]
  MD --> EN["/en/api/overview"]
  MD --> ES["/es/api/overview"]
\`\`\`

---

## Exported Module Signatures

${combinedModules}
`;

const esOverview = `---
title: Referencia API TypeScript (TypeDoc y AST)
description: Referencia generada automáticamente a partir del AST de TypeScript para servicios, utilidades y módulos i18n del frontend.
---

Esta referencia se genera directamente a partir del AST de TypeScript y las anotaciones JSDoc en \`frontend/src/\` mediante \`docs/scripts/sync-typedoc.ts\` y **TypeDoc** (\`typedoc\` + \`typedoc-plugin-markdown\`).

\`\`\`mermaid
flowchart LR
  TS["frontend/src/**/*.ts"] --> TD["TypeDoc / AST TypeScript"]
  TD --> MD["Referencia Markdown Starlight"]
  MD --> EN["/en/api/overview"]
  MD --> ES["/es/api/overview"]
\`\`\`

---

## Firmas Exportadas por Módulo

${combinedModules}
`;

fs.writeFileSync(path.join(enApiDir, "overview.md"), enOverview, "utf-8");
fs.writeFileSync(path.join(esApiDir, "overview.md"), esOverview, "utf-8");
if (fs.existsSync(typedocOut)) {
  fs.rmSync(typedocOut, { recursive: true, force: true });
}
