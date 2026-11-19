import fs from "node:fs/promises";
import { mergeConfig, type Plugin, type UserConfig } from "vite";

/**
 * TODO(upstream-patch-removal): Gradually remove each transformation block in `rewriteAdminBundleCode`
 * and its matching pattern in `ADMIN_BUNDLE_PATCH_PATTERN` as upstream packages release fixes.
 * See `/PATCHES_AND_UPSTREAM_PR_REPORT.md` for full issue descriptions and PR prompts.
 *
 * Removal checklist:
 * 1. [Patch A4 - @strapi/admin FormInputs/Renderer]
 *    Remove the `InputRenderer` destructuring block and `components/FormInputs/Renderer` from
 *    `ADMIN_BUNDLE_PATCH_PATTERN` once `@strapi/admin` stops spreading raw `attribute` onto custom field inputs.
 * 2. [Patch A5 - @strapi/admin hooks/useRBAC]
 *    Remove the `useRBAC` warning suppression and `hooks/useRBAC` from `ADMIN_BUNDLE_PATCH_PATTERN`
 *    once `@strapi/admin` / `@strapi/content-manager` passes permission arrays internally to `useRBAC`.
 * 3. [Patch A6 - @strapi/admin core/apis/router & StrapiApp]
 *    Remove the `createBrowserRouter` and `RouterProvider` future flag injections once `@strapi/admin`
 *    upgrades to React Router v7 or enables `v7_relativeSplatPath` and `v7_startTransition` natively.
 */
const ADMIN_BUNDLE_PATCH_PATTERN =
  /@strapi[+/]admin.*dist\/admin\/admin\/src\/(?:components\/FormInputs\/(?:Renderer|Enumeration)|hooks\/useRBAC|core\/apis\/router|StrapiApp)/;

function rewriteAdminBundleCode(code: string): string {
  let next = code;

  // TODO(Patch A4): Remove when @strapi/content-manager InputRenderer (enumeration/default branches) or @strapi/admin FormInputs/Renderer strips `attribute` before spreading props onto primitive DOM inputs
  if (
    next.includes("const InputRenderer = /*#__PURE__*/ memo((props)=>{") &&
    next.includes("Unsupported field type:")
  ) {
    next = next.replace(
      "const InputRenderer = /*#__PURE__*/ memo((props)=>{",
      "const InputRenderer = /*#__PURE__*/ memo(({ attribute: _attribute, ...props })=>{",
    );
  }

  // Localize and capitalize Enumeration option labels when `label` is not explicitly provided
  if (
    next.includes("components.InputSelect.option.placeholder") &&
    !next.includes("__mosqueEnumOptionLabel")
  ) {
    next = next.replace(
      /children:\s*label\s*\?\?\s*formatMessage\(\{\s*id:\s*value,\s*defaultMessage:\s*value\s*\}\)/g,
      `children: label ?? ((() => {
                                const __mosqueEnumOptionLabel = true;
                                const __urlLoc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plugins[i18n][locale]') : null;
                                const __dict = __urlLoc && globalThis.__CM_I18N_MESSAGES__?.[__urlLoc] ? globalThis.__CM_I18N_MESSAGES__[__urlLoc] : null;
                                const __enumKey = \`content-manager.enum.\${value}\`;
                                const __fallback = String(value).replace(/[_-]+/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase());
                                return (__dict && (__dict[__enumKey] || __dict[value])) || formatMessage({ id: __enumKey, defaultMessage: formatMessage({ id: value, defaultMessage: __fallback }) });
                            })())`,
    );
  }

  // TODO(Patch A5): Remove when @strapi/admin migrates internal callers of useRBAC from object to array
  if (
    next.includes(
      "useRBAC: The first argument should be an array of permissions, not an object.",
    )
  ) {
    next = next.replace(
      /warnOnce\(['"]useRBAC: The first argument should be an array of permissions, not an object\. This will be deprecated in the future\.['"]\);/g,
      "/* silenced internal Strapi useRBAC object deprecation warning */",
    );
  }

  // TODO(Patch A6a): Remove when @strapi/admin enables React Router v7_relativeSplatPath future flag
  if (next.includes("this.router = createBrowserRouter(routes, opts);")) {
    next = next.replace(
      "this.router = createBrowserRouter(routes, opts);",
      "this.router = createBrowserRouter(routes, { ...opts, future: { v7_relativeSplatPath: true, ...opts?.future } });",
    );
  }

  // TODO(Patch A6b): Remove when @strapi/admin enables React Router v7_startTransition future flag on RouterProvider
  if (
    next.includes(
      "jsx(RouterProvider, {\n            router: router\n        })",
    )
  ) {
    next = next.replace(
      "jsx(RouterProvider, {\n            router: router\n        })",
      "jsx(RouterProvider, {\n            router: router,\n            future: { v7_startTransition: true }\n        })",
    );
  }

  return next;
}

const normalizeAdminBundlesVitePlugin: Plugin = {
  name: "normalize-admin-bundles",
  transform(code, id) {
    if (!ADMIN_BUNDLE_PATCH_PATTERN.test(id)) {
      return null;
    }
    const next = rewriteAdminBundleCode(code);
    return next === code ? null : { code: next, map: null };
  },
};

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react-router-dom",
        "react-intl",
        "styled-components",
        "@strapi/design-system",
        "@strapi/icons",
      ],
    },
    plugins: [normalizeAdminBundlesVitePlugin],
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "normalize-admin-bundles-esbuild",
            setup(build) {
              build.onLoad(
                {
                  filter:
                    /@strapi.*dist\/admin\/admin\/src\/(?:components\/FormInputs\/(?:Renderer|Enumeration)|hooks\/useRBAC|core\/apis\/router|StrapiApp)\.m?js$/,
                },
                async (args) => {
                  const raw = await fs.readFile(args.path, "utf8");
                  return {
                    contents: rewriteAdminBundleCode(raw),
                    loader: "js",
                  };
                },
              );
            },
          },
        ],
      },
    },
  });
};
