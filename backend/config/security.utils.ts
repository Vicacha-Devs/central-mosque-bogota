import crypto from 'node:crypto';

const ephemeralSecretCache = new Map<string, string>();
const ephemeralAppKeysCache = new Map<string, string[]>();

/**
 * Multi-tiered secret resolution per secure coding guidelines:
 * 1. Environment variable
 * 2. In production, fail closed (throw error if missing)
 * 3. In dev/test sandboxes, generate an ephemeral cryptographic secret via OS PRNG and log a warning
 */
export function resolveSecret(envKey: string): string {
  const fromEnv = process.env[envKey];
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required security secret in production: ${envKey}`);
  }

  const cached = ephemeralSecretCache.get(envKey);
  if (cached) {
    return cached;
  }

  console.warn(
    `[SECURITY WARNING] ${envKey} not set in environment; generating ephemeral instance-isolated secret for local dev/test.`
  );
  const generated = crypto.randomBytes(32).toString('hex');
  ephemeralSecretCache.set(envKey, generated);
  return generated;
}

export function resolveAppKeys(envKey = 'APP_KEYS'): string[] {
  const fromEnv = process.env[envKey];
  if (fromEnv && fromEnv.trim().length > 0) {
    const parsed = fromEnv
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required security secret in production: ${envKey}`);
  }

  const cached = ephemeralAppKeysCache.get(envKey);
  if (cached) {
    return [...cached];
  }

  console.warn(
    `[SECURITY WARNING] ${envKey} not set in environment; generating ephemeral instance-isolated app keys for local dev/test.`
  );
  const generated = [
    crypto.randomBytes(32).toString('hex'),
    crypto.randomBytes(32).toString('hex'),
  ];
  ephemeralAppKeysCache.set(envKey, generated);
  return [...generated];
}
