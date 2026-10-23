# Central Mosque of Bogotá — Bilingual Documentation Portal (`/docs`)

Bilingual (`en` + `es`) engineering, architecture, verification, and editorial handbook for the **Central Mosque of Bogotá (Mezquita Central Abu Bakr As-Siddiq)**, powered by **Astro Starlight**, **Pele** (`https://pele.run/`) themeable SVG diagrams, **Archify** interactive HTML explainers, and **TypeDoc**.

---

## Documentation Structure

```text
docs/
├── public/
│   └── archify/
│       ├── central-mosque-architecture.html # Standalone interactive multi-tab architecture diagram
│       └── central-mosque-explainer.html    # Standalone one-page executive & technical explainer
├── scripts/
│   └── sync-typedoc.ts                      # Generates TypeDoc Markdown into en/api/ and es/api/ (<= 500 lines)
├── src/content/docs/
│   ├── en/                                  # English documentation modules (01 through 06 + api/)
│   └── es/                                  # Spanish documentation modules (1:1 structural parity)
├── astro.config.ts                          # Starlight + Pele build-time Mermaid SVG plugin
└── typedoc.json                             # TypeDoc configuration targeting frontend/src services & utils
```

---

## Governance Rules

1. **500-Line Maximum per File**:
   - Every `.md` and `.mdx` file under `src/content/docs/` (including generated TypeDoc files) is strictly capped at **<= 500 lines** and verified automatically by `node ../scripts/verify-all.ts`.
2. **Bilingual Parity (`en` & `es`)**:
   - Every guide in `src/content/docs/en/` has a corresponding Spanish counterpart in `src/content/docs/es/`.
3. **Zero Client-Side Mermaid JS**:
   - All `mermaid` code fences are compiled at build time into inline, theme-aware SVGs using the custom **Pele** remark plugin in [`astro.config.ts`](./astro.config.ts).

---

## Commands

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install documentation portal dependencies |
| `pnpm typedoc` | Regenerate TypeDoc API documentation into `en/api/` and `es/api/` |
| `pnpm dev` | Start Starlight dev server at `http://localhost:4322` |
| `pnpm build` | Sync TypeDoc reference and build static Starlight site to `./dist/` |
| `pnpm preview` | Preview built documentation portal on `http://localhost:4322` |
