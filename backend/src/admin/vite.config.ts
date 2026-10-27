import fs from 'node:fs/promises';
import { mergeConfig, type Plugin, type UserConfig } from 'vite';

/**
 * TODO(upstream-patch-removal): Gradually remove each transformation block in `rewriteAdminBundleCode`
 * and its matching pattern in `ADMIN_BUNDLE_PATCH_PATTERN` as upstream packages release fixes.
 * See `/PATCHES_AND_UPSTREAM_PR_REPORT.md` for full issue descriptions and PR prompts.
 *
 * Removal checklist:
 * 1. [Patch A1 - @frameless/strapi-plugin-env-label & @frameless/strapi-plugin-notes]
 *    Remove the `several instances of 'styled-components'` block and `@frameless[+/]strapi-plugin-(?:env-label|notes)`
 *    from `ADMIN_BUNDLE_PATCH_PATTERN` once both plugins externalize `styled-components` in their build config.
 * 2. [Patch A2 & A3 - strapi-5-sitemap-plugin]
 *    Remove the `Could not load translations for locale` and `id: "sitemap-settings"` blocks and
 *    `strapi-5-sitemap-plugin` from `ADMIN_BUNDLE_PATCH_PATTERN` once `strapi-5-sitemap-plugin`
 *    ships silent fallback in `registerTrads` and uses relative `to: PLUGIN_ID` with synchronous `Component: () => import(...)`.
 * 3. [Patch A4 - @strapi/admin FormInputs/Renderer]
 *    Remove the `InputRenderer` destructuring block and `components/FormInputs/Renderer` from
 *    `ADMIN_BUNDLE_PATCH_PATTERN` once `@strapi/admin` stops spreading raw `attribute` onto custom field inputs.
 * 4. [Patch A5 - @strapi/admin hooks/useRBAC]
 *    Remove the `useRBAC` warning suppression and `hooks/useRBAC` from `ADMIN_BUNDLE_PATCH_PATTERN`
 *    once `@strapi/admin` / `@strapi/content-manager` passes permission arrays internally to `useRBAC`.
 * 5. [Patch A6 - @strapi/admin core/apis/router & StrapiApp]
 *    Remove the `createBrowserRouter` and `RouterProvider` future flag injections once `@strapi/admin`
 *    upgrades to React Router v7 or enables `v7_relativeSplatPath` and `v7_startTransition` natively.
 */
const ADMIN_BUNDLE_PATCH_PATTERN =
  /(?:@frameless[+/]strapi-plugin-(?:env-label|notes)|strapi-5-sitemap-plugin|@strapi[+/]admin.*dist\/admin\/admin\/src\/(?:components\/FormInputs\/Renderer|hooks\/useRBAC|core\/apis\/router|StrapiApp))/;

function rewriteAdminBundleCode(code: string): string {
  let next = code;

  // TODO(Patch A1): Remove when @frameless/strapi-plugin-env-label & @frameless/strapi-plugin-notes externalize styled-components
  if (next.includes("several instances of 'styled-components'")) {
    next =
      `import __sharedStyled from "styled-components";\n` +
      next
        .replace(
          /var ct = function\(e\) \{\s*return at\(ot, e\);\s*\}, ut = ct;\s*D\.forEach\(function\(e\) \{\s*ut\[e\] = ct\(e\);\s*\}\);/,
          'var ct = __sharedStyled, ut = __sharedStyled;'
        )
        .replace(
          /[^\n]*several instances of 'styled-components'[^\n]*/g,
          '/* deduplicated styled-components instance */'
        );
  }

  // TODO(Patch A2): Remove when strapi-5-sitemap-plugin silently falls back on missing locale files in registerTrads
  if (next.includes('Could not load translations for locale')) {
    next = next.replace(
      /console\.warn\(`\[\$\{PLUGIN_ID\}\] Could not load translations for locale "\$\{locale\}":`, error\);/g,
      '/* fallback to default locale */'
    );
  }

  // TODO(Patch A3): Remove when strapi-5-sitemap-plugin fixes `to: "/settings/..."` and `Component: async () =>` in createSettingSection
  if (next.includes('id: "sitemap-settings"')) {
    next = next
      .replace('to: `/settings/${PLUGIN_ID}`', 'to: `${PLUGIN_ID}`')
      .replace('Component: async () => {', 'Component: () => {');
  }

  // TODO(Patch A4): Remove when @strapi/content-manager InputRenderer (enumeration/default branches) or @strapi/admin FormInputs/Renderer strips `attribute` before spreading props onto primitive DOM inputs
  if (
    next.includes('const InputRenderer = /*#__PURE__*/ memo((props)=>{') &&
    next.includes('Unsupported field type:')
  ) {
    next = next.replace(
      'const InputRenderer = /*#__PURE__*/ memo((props)=>{',
      'const InputRenderer = /*#__PURE__*/ memo(({ attribute: _attribute, ...props })=>{'
    );
  }

  // TODO(Patch A5): Remove when @strapi/admin migrates internal callers of useRBAC from object to array
  if (
    next.includes(
      'useRBAC: The first argument should be an array of permissions, not an object.'
    )
  ) {
    next = next.replace(
      /warnOnce\(['"]useRBAC: The first argument should be an array of permissions, not an object\. This will be deprecated in the future\.['"]\);/g,
      '/* silenced internal Strapi useRBAC object deprecation warning */'
    );
  }

  // TODO(Patch A6a): Remove when @strapi/admin enables React Router v7_relativeSplatPath future flag
  if (next.includes('this.router = createBrowserRouter(routes, opts);')) {
    next = next.replace(
      'this.router = createBrowserRouter(routes, opts);',
      'this.router = createBrowserRouter(routes, { ...opts, future: { v7_relativeSplatPath: true, ...opts?.future } });'
    );
  }

  // TODO(Patch A6b): Remove when @strapi/admin enables React Router v7_startTransition future flag on RouterProvider
  if (
    next.includes('jsx(RouterProvider, {\n            router: router\n        })')
  ) {
    next = next.replace(
      'jsx(RouterProvider, {\n            router: router\n        })',
      'jsx(RouterProvider, {\n            router: router,\n            future: { v7_startTransition: true }\n        })'
    );
  }

  return next;
}

const normalizeAdminBundlesVitePlugin: Plugin = {
  name: 'normalize-admin-bundles',
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
        'react',
        'react-dom',
        'react-router-dom',
        'react-intl',
        'styled-components',
        '@strapi/design-system',
        '@strapi/icons',
      ],
    },
    plugins: [normalizeAdminBundlesVitePlugin],
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'normalize-admin-bundles-esbuild',
            setup(build) {
              build.onLoad(
                {
                  filter:
                    /(?:@frameless.*dist\/admin\/index|strapi-5-sitemap-plugin.*dist\/_chunks\/index-.*|@strapi.*dist\/admin\/admin\/src\/(?:components\/FormInputs\/Renderer|hooks\/useRBAC|core\/apis\/router|StrapiApp))\.m?js$/,
                },
                async (args) => {
                  const raw = await fs.readFile(args.path, 'utf8');
                  return {
                    contents: rewriteAdminBundleCode(raw),
                    loader: 'js',
                  };
                }
              );
            },
          },
        ],
      },
    },
  });
};
