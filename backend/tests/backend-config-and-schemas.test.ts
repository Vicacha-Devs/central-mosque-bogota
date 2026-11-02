import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import buildAdminConfig from '../config/admin';
import apiConfig from '../config/api';
import buildDatabaseConfig from '../config/database';
import buildMiddlewaresConfig from '../config/middlewares';
import buildPluginsConfig from '../config/plugins';
import buildServerConfig from '../config/server';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(currentDir, '..');

function createMockEnv(overrides: Record<string, unknown> = {}) {
  const envFn = ((key: string, defaultValue?: unknown) => {
    if (key in overrides) return overrides[key];
    return defaultValue ?? '';
  }) as {
    (key: string, defaultValue?: any): any;
    int(key: string, defaultValue?: number): number;
    bool(key: string, defaultValue?: boolean): boolean;
    array(key: string, defaultValue?: string[]): string[];
  };

  envFn.int = (key: string, defaultValue = 0) => {
    if (key in overrides) return Number(overrides[key]);
    return defaultValue;
  };
  envFn.bool = (key: string, defaultValue = false) => {
    if (key in overrides) return Boolean(overrides[key]);
    return defaultValue;
  };
  envFn.array = (key: string, defaultValue: string[] = []) => {
    if (key in overrides && Array.isArray(overrides[key])) {
      return overrides[key] as string[];
    }
    return defaultValue;
  };

  return envFn;
}

describe('Central Mosque Backend — Configurations, Providers, and Schema Integrity', () => {
  it('supports dual-mode SQLite (default) and PostgreSQL 16 (with SSL and connection pooling) in config/database.ts', () => {
    const sqliteEnv = createMockEnv({});
    const sqliteConfig = buildDatabaseConfig({ env: sqliteEnv });
    assert.equal(sqliteConfig.connection.client, 'sqlite');
    assert.equal(sqliteConfig.connection.useNullAsDefault, true);
    assert.ok(
      sqliteConfig.connection.connection.filename.endsWith('.tmp/data.db')
    );

    const pgEnv = createMockEnv({
      DATABASE_CLIENT: 'postgres',
      DATABASE_HOST: 'db.mezquitabogota.internal',
      DATABASE_PORT: 5432,
      DATABASE_NAME: 'mosque_prod',
      DATABASE_USERNAME: 'mosque_user',
      DATABASE_PASSWORD: 'secret-db-password',
      DATABASE_SSL: true,
      DATABASE_SSL_REJECT_UNAUTHORIZED: true,
      DATABASE_POOL_MIN: 4,
      DATABASE_POOL_MAX: 20,
    });
    const pgConfig = buildDatabaseConfig({ env: pgEnv });
    assert.equal(pgConfig.connection.client, 'postgres');
    assert.equal(
      pgConfig.connection.connection.host,
      'db.mezquitabogota.internal'
    );
    assert.equal(pgConfig.connection.connection.database, 'mosque_prod');
    assert.equal(pgConfig.connection.pool.min, 4);
    assert.equal(pgConfig.connection.pool.max, 20);
    assert.ok(pgConfig.connection.connection.ssl);
    assert.equal(
      pgConfig.connection.connection.ssl.rejectUnauthorized,
      true
    );
  });

  it('configures server, REST API pagination, admin preview URL handler, and hardened CSP/CORS middlewares', async () => {
    const env = createMockEnv({
      HOST: '0.0.0.0',
      PORT: 1337,
      PUBLIC_URL: 'https://cms.mezquitabogota.org',
      FRONTEND_URL: 'https://mezquitabogota.org',
      CORS_ORIGINS: ['https://mezquitabogota.org'],
    });

    const serverCfg = buildServerConfig({ env });
    assert.equal(serverCfg.host, '0.0.0.0');
    assert.equal(serverCfg.port, 1337);
    assert.equal(serverCfg.url, 'https://cms.mezquitabogota.org');
    assert.equal(serverCfg.app.keys.length, 2);

    assert.equal(apiConfig.rest.defaultLimit, 25);
    assert.equal(apiConfig.rest.maxLimit, 100);
    assert.equal(apiConfig.rest.withCount, true);
    assert.equal(apiConfig.documents?.strictRelations, true);

    const adminCfg = buildAdminConfig({ env });
    assert.equal(adminCfg.preview.enabled, true);
    assert.equal(adminCfg.forgotPassword?.expiresIn, '1h');
    assert.ok(adminCfg.secrets?.encryptionKey);
    assert.deepEqual(adminCfg.preview.config.allowedOrigins, [
      'https://mezquitabogota.org',
    ]);
    const previewUrl = await adminCfg.preview.config.handler(
      'api::article.article',
      {
        documentId: 'doc-123',
        locale: 'ar',
        status: 'draft',
      }
    );
    assert.ok(
      previewUrl.startsWith('https://mezquitabogota.org/ar/preview?')
    );
    assert.ok(previewUrl.includes('uid=api%3A%3Aarticle.article'));
    assert.ok(previewUrl.includes('documentId=doc-123'));

    const middlewares = buildMiddlewaresConfig({ env });
    const securityMw = middlewares.find(
      (m: any) => typeof m === 'object' && m.name === 'strapi::security'
    ) as any;
    assert.ok(securityMw);
    assert.equal(securityMw.config.frameguard.action, 'deny');
    assert.ok(
      securityMw.config.contentSecurityPolicy.directives['img-src'].includes(
        'res.cloudinary.com'
      )
    );
    const corsMw = middlewares.find(
      (m: any) => typeof m === 'object' && m.name === 'strapi::cors'
    ) as any;
    assert.deepEqual(corsMw.config.origin, ['https://mezquitabogota.org']);
  });

  it('switches upload provider to Cloudinary and email provider to Nodemailer when credentials are set', () => {
    const localEnv = createMockEnv({});
    const localPlugins = buildPluginsConfig({ env: localEnv });
    assert.equal(localPlugins.upload.config.provider, undefined);
    assert.equal(localPlugins.upload.config.sizeLimit, 10 * 1024 * 1024);
    assert.ok(
      localPlugins.upload.config.security?.allowedTypes.includes('image/*')
    );
    assert.equal(localPlugins.email.config.provider, 'nodemailer');
    assert.equal(
      (localPlugins.email.config.providerOptions as any).jsonTransport,
      true
    );

    const prodEnv = createMockEnv({
      CLOUDINARY_NAME: 'mezquita-bogota',
      CLOUDINARY_KEY: 'cld-key',
      CLOUDINARY_SECRET: 'cld-secret',
      SMTP_HOST: 'smtp.mezquitabogota.org',
      SMTP_PORT: 587,
      SMTP_USERNAME: 'mailer@mezquitabogota.org',
      SMTP_PASSWORD: 'smtp-password',
    });
    const prodPlugins = buildPluginsConfig({ env: prodEnv });
    assert.equal(prodPlugins.upload.config.provider, 'cloudinary');
    assert.equal(
      prodPlugins.upload.config.providerOptions.cloud_name,
      'mezquita-bogota'
    );
    assert.equal(prodPlugins.email?.config.provider, 'nodemailer');
    assert.equal(
      (prodPlugins.email?.config.providerOptions as any).host,
      'smtp.mezquitabogota.org'
    );
  });

  it('validates all 9 site-specific content-type schema.json files and 7 component schemas', () => {
    const apiRoot = path.join(backendRoot, 'src/api');
    const componentsRoot = path.join(backendRoot, 'src/components');

    const componentMap = new Map<string, Record<string, unknown>>();
    for (const category of fs.readdirSync(componentsRoot)) {
      const catDir = path.join(componentsRoot, category);
      if (!fs.statSync(catDir).isDirectory()) continue;
      for (const file of fs.readdirSync(catDir)) {
        if (!file.endsWith('.json')) continue;
        const compKey = `${category}.${file.replace(/\.json$/, '')}`;
        const parsed = JSON.parse(
          fs.readFileSync(path.join(catDir, file), 'utf8')
        );
        assert.ok(parsed.collectionName, `Component ${compKey} must have collectionName`);
        assert.ok(parsed.attributes, `Component ${compKey} must have attributes`);
        componentMap.set(compKey, parsed);
      }
    }
    assert.equal(componentMap.size, 7, 'Expected 7 shared Strapi component schemas');

    const apiDirs = fs
      .readdirSync(apiRoot)
      .filter(
        (d) =>
          d !== 'health' && fs.statSync(path.join(apiRoot, d)).isDirectory()
      );
    assert.equal(
      apiDirs.length,
      9,
      'Expected 9 site-specific content-type APIs in backend/src/api (4 collection types + 5 single types)'
    );

    for (const apiName of apiDirs) {
      const schemaPath = path.join(
        apiRoot,
        apiName,
        'content-types',
        apiName,
        'schema.json'
      );
      assert.ok(
        fs.existsSync(schemaPath),
        `Missing schema.json for api::${apiName}.${apiName}`
      );
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      assert.equal(schema.info.singularName, apiName);
      assert.ok(schema.attributes && typeof schema.attributes === 'object');

      for (const [attrName, attrDef] of Object.entries<any>(schema.attributes)) {
        if (attrDef.type === 'component') {
          assert.ok(
            componentMap.has(attrDef.component),
            `Content-type ${apiName}.${attrName} references unknown component ${attrDef.component}`
          );
        }
      }
    }
  });
});
