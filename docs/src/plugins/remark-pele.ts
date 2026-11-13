import { Buffer } from "node:buffer";

export interface MarkdownNode {
  type: string;
  lang?: string;
  value?: string;
  children?: MarkdownNode[];
}

/**
 * Remark plugin that transforms ```mermaid fenced code blocks into
 * `<div class="pele-diagram not-content" data-pele-b64="...">` containers
 * before Expressive Code processes code blocks, so Pele (https://pele.run/)
 * can mount interactive, themeable SVG diagrams with zoom/pan.
 */
export function remarkPele(): (tree: MarkdownNode) => void {
  return function transformer(tree: MarkdownNode): void {
    visitCodeNodes(tree);
  };
}

function visitCodeNodes(node: MarkdownNode | null | undefined): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child && child.type === "code" && child.lang === "mermaid") {
        const rawSource = String(child.value ?? "").trim();
        const encoded = Buffer.from(rawSource, "utf-8").toString("base64");
        node.children[i] = {
          type: "html",
          value: `<div class="pele-diagram not-content" data-pele-b64="${encoded}" role="region" aria-label="Architecture diagram"></div>`,
        };
      } else {
        visitCodeNodes(child);
      }
    }
  }
}
