import {
  createRequire,
  registerHooks,
  stripTypeScriptTypes,
  type LoadFnOutput,
  type LoadHookContext,
  type ResolveFnOutput,
  type ResolveHookContext,
} from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

type NextResolve = (
  specifier: string,
  context?: ResolveHookContext
) => ResolveFnOutput;

type NextLoad = (url: string, context?: LoadHookContext) => LoadFnOutput;

const currentDir = dirname(fileURLToPath(import.meta.url));
const backendRequire = createRequire(resolvePath(currentDir, '../package.json'));
const extensionsPackagesRoot = resolvePath(
  currentDir,
  '../../../strapi-v5-extensions/packages'
);
const calendarPkgRoot = resolvePath(
  extensionsPackagesRoot,
  'strapi-plugin-calendar'
);
const intlDateShimUrl = pathToFileURL(
  resolvePath(calendarPkgRoot, 'tests/intl-date-shim.mjs')
).href;

const WORKSPACE_SPECIFIER_MAP: Record<string, string> = {
  '@vicacha-devs/strapi-plugin-calendar/shared': pathToFileURL(
    resolvePath(calendarPkgRoot, 'shared/index.ts')
  ).href,
  '@vicacha-devs/plugin-shared': pathToFileURL(
    resolvePath(extensionsPackagesRoot, 'plugin-shared/src/index.ts')
  ).href,
};

registerHooks({
  resolve(
    specifier: string,
    context: ResolveHookContext,
    nextResolve: NextResolve
  ): ResolveFnOutput {
    if (specifier === '@internationalized/date') {
      return { url: intlDateShimUrl, shortCircuit: true };
    }

    const mappedUrl = WORKSPACE_SPECIFIER_MAP[specifier];
    if (mappedUrl) {
      return { url: mappedUrl, shortCircuit: true };
    }

    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      context.parentURL?.startsWith('file:')
    ) {
      const parentDir = dirname(fileURLToPath(context.parentURL));
      const baseCandidate = resolvePath(parentDir, specifier);

      const candidates = [
        `${baseCandidate}.ts`,
        `${baseCandidate}.tsx`,
        `${baseCandidate}.json`,
        resolvePath(baseCandidate, 'index.ts'),
        resolvePath(baseCandidate, 'index.tsx'),
      ];

      for (const candidate of candidates) {
        if (existsSync(candidate)) {
          return nextResolve(pathToFileURL(candidate).href, context);
        }
      }
    }

    try {
      return nextResolve(specifier, context);
    } catch (err) {
      const isBareSpecifier =
        !specifier.startsWith('.') &&
        !specifier.startsWith('/') &&
        !specifier.startsWith('file:') &&
        !specifier.startsWith('node:');
      if (isBareSpecifier) {
        try {
          const resolved = backendRequire.resolve(specifier);
          return { url: pathToFileURL(resolved).href, shortCircuit: true };
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  load(
    url: string,
    context: LoadHookContext,
    nextLoad: NextLoad
  ): LoadFnOutput {
    if (url.endsWith('.json') && !url.includes('/node_modules/')) {
      const filePath = fileURLToPath(url);
      const source = readFileSync(filePath, 'utf8');
      return {
        format: 'module',
        source: `export default ${source}`,
        shortCircuit: true,
      };
    }

    if (
      (url.endsWith('.ts') || url.endsWith('.tsx')) &&
      !url.includes('/node_modules/')
    ) {
      const filePath = fileURLToPath(url);
      const source = readFileSync(filePath, 'utf8');
      const stripped = stripTypeScriptTypes(source, { mode: 'strip' });
      return {
        format: 'module',
        source: stripped,
        shortCircuit: true,
      };
    }

    return nextLoad(url, context);
  },
});
