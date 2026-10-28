import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import backendLifecycle from '../src/index';
import createPublicSubmissionGuard from '../src/middlewares/public-submission-guard';
import {
  escapeHtml,
  notifyContactSubmission,
  notifyDonationSubmission,
  notifyVisitBooking,
  sanitizeHeaderLine,
} from '../src/utils/email-notifications';

function createMockCtx(ip: string, body: Record<string, unknown> = {}) {
  const headersSent: Record<string, string> = {};
  let status = 200;
  let errorMsg = '';

  return {
    request: {
      ip,
      body,
      headers: {},
    },
    set(key: string, val: string) {
      headersSent[key] = val;
    },
    badRequest(msg: string) {
      status = 400;
      errorMsg = msg;
      return { status, errorMsg };
    },
    tooManyRequests(msg: string) {
      status = 429;
      errorMsg = msg;
      return { status, errorMsg };
    },
    getStatus: () => status,
    getError: () => errorMsg,
    getHeaders: () => headersSent,
  };
}

describe('Central Mosque Backend — Public Submission Guard, Email Sanitization & Lifecycles', () => {
  it('blocks honeypot submissions, strips anti-bot metadata fields, and enforces sliding-window IP rate limits', async () => {
    const prevMax = process.env.PUBLIC_FORM_RATE_LIMIT_MAX;
    const prevTurnstile = process.env.TURNSTILE_SECRET_KEY;
    try {
      process.env.PUBLIC_FORM_RATE_LIMIT_MAX = '2';
      delete process.env.TURNSTILE_SECRET_KEY;

      let warnings = 0;
      const mockStrapi = {
        log: {
          warn: () => {
            warnings += 1;
          },
          info: () => {},
          error: () => {},
        },
      };

      const guard = createPublicSubmissionGuard({}, { strapi: mockStrapi as never });

      // 1. Valid request passes and strips website/_hp/turnstileToken
      const body1 = {
        data: {
          fullName: 'Omar Farooq',
          website: '',
          _hp: '',
          turnstileToken: 'tok-123',
        },
      };
      const ctx1 = createMockCtx('198.51.100.10', body1);
      let nextCalled = 0;
      await guard(ctx1, async () => {
        nextCalled += 1;
      });
      assert.equal(nextCalled, 1);
      assert.equal(ctx1.getStatus(), 200);
      assert.equal('website' in body1.data, false);
      assert.equal('turnstileToken' in body1.data, false);

      // 2. Honeypot trap triggered when website field is non-empty
      const ctxHoneypot = createMockCtx('198.51.100.11', {
        data: { fullName: 'Spam Bot', website: 'https://spam.example' },
      });
      await guard(ctxHoneypot, async () => {
        nextCalled += 1;
      });
      assert.equal(ctxHoneypot.getStatus(), 400);
      assert.equal(warnings, 1);

      // 3. Second request from 198.51.100.10 passes (max=2), third is rate-limited (429)
      const ctx2 = createMockCtx('198.51.100.10', { data: { fullName: 'Omar 2' } });
      await guard(ctx2, async () => {
        nextCalled += 1;
      });
      assert.equal(ctx2.getStatus(), 200);

      const ctx3 = createMockCtx('198.51.100.10', { data: { fullName: 'Omar 3' } });
      await guard(ctx3, async () => {
        nextCalled += 1;
      });
      assert.equal(ctx3.getStatus(), 429);
      assert.ok(ctx3.getHeaders()['Retry-After']);

      // 4. When TURNSTILE_SECRET_KEY is configured, missing token fails closed (400)
      process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret-test';
      const ctxNoToken = createMockCtx('198.51.100.99', {
        data: { fullName: 'Visitor Without Token' },
      });
      await guard(ctxNoToken, async () => {});
      assert.equal(ctxNoToken.getStatus(), 400);
      assert.match(ctxNoToken.getError(), /Security verification token is required/);
    } finally {
      if (prevMax === undefined) delete process.env.PUBLIC_FORM_RATE_LIMIT_MAX;
      else process.env.PUBLIC_FORM_RATE_LIMIT_MAX = prevMax;
      if (prevTurnstile === undefined) delete process.env.TURNSTILE_SECRET_KEY;
      else process.env.TURNSTILE_SECRET_KEY = prevTurnstile;
    }
  });

  it('escapes HTML payloads and strips CRLF characters to prevent XSS and SMTP header injection', () => {
    assert.equal(
      escapeHtml('<script>alert("xss")</script> & \'quotes\''),
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;'
    );
    assert.equal(
      sanitizeHeaderLine('user@example.com\r\nBcc: attacker@evil.org'),
      'user@example.com Bcc: attacker@evil.org'
    );
  });

  it('dispatches 4-locale transactional emails via email-designer-5 and plugin::* db lifecycles', async () => {
    const prevSmtp = process.env.SMTP_HOST;
    try {
      process.env.SMTP_HOST = 'smtp.mezquitabogota.org';

      const templatedCalls: Array<{
        to: string;
        templateReferenceId: number;
      }> = [];
      const fallbackCalls: Array<{
        to: string;
        subject: string;
        html: string;
      }> = [];

      let simulateDesignerFailure = false;
      let subscribedLifecycle: {
        models?: string[];
        afterCreate?: (event: {
          model?: { uid?: string };
          result?: Record<string, unknown>;
        }) => Promise<void>;
      } | null = null;

      const mockStrapi = {
        log: {
          info: () => {},
          warn: () => {},
          error: () => {},
        },
        db: {
          lifecycles: {
            subscribe(sub: any) {
              subscribedLifecycle = sub;
            },
          },
        },
        plugin: (name: string) => {
          if (name === 'email-designer-5') {
            return {
              service: () => ({
                sendTemplatedEmail: async (
                  opts: { to: string },
                  tpl: { templateReferenceId: number }
                ) => {
                  if (simulateDesignerFailure) {
                    throw new Error('Designer template not found');
                  }
                  templatedCalls.push({
                    to: opts.to,
                    templateReferenceId: tpl.templateReferenceId,
                  });
                  return { ok: true };
                },
              }),
            };
          }
          if (name === 'email') {
            return {
              service: () => ({
                send: async (opts: { to: string; subject: string; html: string }) => {
                  fallbackCalls.push(opts);
                },
              }),
            };
          }
          return undefined;
        },
      };

      // 1. Arabic (RTL) contact submission via email-designer-5
      await notifyContactSubmission(mockStrapi as never, {
        applicantName: 'أحمد منصور',
        applicantEmail: 'ahmad@example.org',
        applicantPhone: '+57 300 000 0000',
        category: 'general',
        data: { message: 'السلام عليكم' },
        locale: 'ar',
      });
      assert.equal(templatedCalls.length, 2); // Admin alert (901) + Arabic confirmation (103)
      assert.equal(templatedCalls[0].templateReferenceId, 901);
      assert.equal(templatedCalls[1].templateReferenceId, 103);

      // 2. Fallback HTML path when email-designer-5 throws (with XSS payload & DIAN tax certificate)
      simulateDesignerFailure = true;
      await notifyVisitBooking(mockStrapi as never, {
        customerName: '<b>Carlos</b>',
        organization: 'Colegio Bogotá',
        customerEmail: 'carlos@example.org',
        startDate: '2026-11-20',
        slotLabel: '10:00 AM',
        partySize: 30,
        preferredLanguage: 'tr',
      });
      assert.equal(fallbackCalls.length, 2);
      assert.ok(fallbackCalls[0].html.includes('&lt;b&gt;Carlos&lt;/b&gt;'));
      assert.ok(fallbackCalls[1].subject.includes('Bogota Merkez Camii'));

      // 3. Bootstrap subscribes db lifecycles onto plugin::inbox.submission, plugin::bookings.booking, and plugin::donations.pledge
      await backendLifecycle.bootstrap({ strapi: mockStrapi as never });
      assert.ok(subscribedLifecycle?.afterCreate);
      assert.deepEqual(subscribedLifecycle?.models, [
        'plugin::inbox.submission',
        'plugin::bookings.booking',
        'plugin::donations.pledge',
      ]);

      await subscribedLifecycle!.afterCreate!({
        model: { uid: 'plugin::inbox.submission' },
        result: { applicantName: 'Layla', applicantEmail: 'layla@example.org', locale: 'en' },
      });
      await subscribedLifecycle!.afterCreate!({
        model: { uid: 'plugin::bookings.booking' },
        result: { customerName: 'Layla', customerEmail: 'layla@example.org', preferredLanguage: 'es' },
      });
      await subscribedLifecycle!.afterCreate!({
        model: { uid: 'plugin::donations.pledge' },
        result: {
          donorName: 'Layla',
          donorEmail: 'layla@example.org',
          amount: 500000,
          currency: 'COP',
          categoryKey: 'zakat',
          donorTaxId: '900123456',
          locale: 'ar',
        },
      });
      assert.equal(fallbackCalls.length, 8);
      const lastAdminDonationEmail = fallbackCalls[6];
      assert.ok(
        lastAdminDonationEmail.subject.includes('[DIAN Certificate Requested]')
      );
      const lastArabicConfirmation = fallbackCalls[7];
      assert.ok(lastArabicConfirmation.html.includes('dir="rtl"'));
    } finally {
      if (prevSmtp === undefined) delete process.env.SMTP_HOST;
      else process.env.SMTP_HOST = prevSmtp;
    }
  });

  it('auto-links backend admin::user accounts and syncs Staff/Author profile slugs across Articles, Khutbahs, Events, and Publications', async () => {
    const {
      bindAuthorProfileRelations,
      registerAuthorProfileLifecycles,
    } = await import('../src/bootstrap/author-profile-lifecycles.ts');

    const subscriptions: Array<{
      models: string[];
      beforeCreate?: (event: any) => Promise<void>;
      beforeUpdate?: (event: any) => Promise<void>;
    }> = [];

    const mockContentTypes: Record<string, any> = {
      'api::leader.leader': { attributes: {} },
      'plugin::media-feeds.media-item': { attributes: {} },
      'plugin::events.event': { attributes: {} },
      'plugin::resources.publication': { attributes: {} },
    };

    const mockStrapi = {
      contentTypes: mockContentTypes,
      requestContext: {
        get: () => ({
          state: {
            user: {
              id: 7,
              email: 'imam@mezquitabogota.org',
            },
          },
        }),
      },
      db: {
        lifecycles: {
          subscribe(sub: any) {
            subscriptions.push(sub);
          },
        },
        query: (uid: string) => {
          if (uid === 'admin::user') {
            return {
              findOne: async ({ where }: any) => {
                if (where.email === 'imam@mezquitabogota.org' || where.id === 7) {
                  return { id: 7, email: 'imam@mezquitabogota.org' };
                }
                return null;
              },
            };
          }
          if (uid === 'api::leader.leader') {
            return {
              findOne: async ({ where }: any) => {
                if (
                  where.adminUserId === 7 ||
                  where.adminUserEmail === 'imam@mezquitabogota.org' ||
                  where.slug === 'sheikh-ahmad-al-mansoor' ||
                  where.name === 'Sheikh Ahmad Al-Mansoor'
                ) {
                  return {
                    id: 101,
                    documentId: 'leader-sheikh-101',
                    name: 'Sheikh Ahmad Al-Mansoor',
                    slug: 'sheikh-ahmad-al-mansoor',
                    adminUserId: 7,
                    adminUserEmail: 'imam@mezquitabogota.org',
                  };
                }
                return null;
              },
            };
          }
          return { findOne: async () => null };
        },
      },
    };

    bindAuthorProfileRelations(mockStrapi as never);
    assert.equal(
      mockContentTypes['plugin::media-feeds.media-item'].attributes.speakerProfile.target,
      'api::leader.leader'
    );
    assert.equal(
      mockContentTypes['plugin::events.event'].attributes.speakerProfile.target,
      'api::leader.leader'
    );
    assert.equal(
      mockContentTypes['plugin::resources.publication'].attributes.authorProfile.target,
      'api::leader.leader'
    );

    registerAuthorProfileLifecycles(mockStrapi as never);
    assert.equal(subscriptions.length, 2);

    // 1. Leader beforeCreate auto-generates slug and resolves adminUserId from adminUserEmail
    const leaderData: Record<string, unknown> = {
      name: 'Sheikh Ahmad Al-Mansoor',
      adminUserEmail: '  IMAM@mezquitabogota.org ',
    };
    await subscriptions[0].beforeCreate!({ params: { data: leaderData } });
    assert.equal(leaderData.slug, 'sheikh-ahmad-al-mansoor');
    assert.equal(leaderData.adminUserEmail, 'imam@mezquitabogota.org');
    assert.equal(leaderData.adminUserId, 7);

    // 2. Article beforeCreate auto-links to Sheikh Ahmad Al-Mansoor via authenticated admin::user (id: 7)
    const articleData: Record<string, unknown> = {
      title: 'Principios de Fiqh en Colombia',
    };
    await subscriptions[1].beforeCreate!({
      model: { uid: 'api::article.article' },
      params: { data: articleData },
    });
    assert.equal(articleData.author, 'Sheikh Ahmad Al-Mansoor');
    assert.equal(articleData.authorSlug, 'sheikh-ahmad-al-mansoor');
    assert.equal(articleData.authorProfile, 101);

    // 3. Khutbah (plugin::media-feeds.media-item) beforeCreate auto-links speaker & speakerSlug
    const khutbahData: Record<string, unknown> = {
      title: 'Jutba del Viernes: La Paciencia',
      type: 'khutbah',
    };
    await subscriptions[1].beforeCreate!({
      model: { uid: 'plugin::media-feeds.media-item' },
      params: { data: khutbahData },
    });
    assert.equal(khutbahData.speaker, 'Sheikh Ahmad Al-Mansoor');
    assert.equal(khutbahData.speakerSlug, 'sheikh-ahmad-al-mansoor');
    assert.equal(khutbahData.speakerProfile, 101);
  });

  it('moves authorProfile and authorSlug up into the same row as author in Content Manager edit layouts and provides decoupled admin translations', async () => {
    const { normalizeAuthorLayoutRows } = await import(
      '../src/bootstrap/field-metadata-enricher'
    );
    const { ALL_ADMIN_TRANSLATIONS, translateFieldLabel } = await import(
      '../src/admin/translations'
    );

    const initialLayout = [
      [
        { name: 'title', size: 6 },
        { name: 'slug', size: 6 },
      ],
      [
        { name: 'author', size: 6 },
        { name: 'readingTime', size: 6 },
      ],
      [{ name: 'seo', size: 12 }],
      [
        { name: 'authorSlug', size: 6 },
        { name: 'authorProfile', size: 6 },
      ],
    ];

    const firstPass = normalizeAuthorLayoutRows(initialLayout);
    assert.equal(firstPass.changed, true);
    assert.deepEqual(firstPass.layout, [
      [
        { name: 'title', size: 6 },
        { name: 'slug', size: 6 },
      ],
      [
        { name: 'authorProfile', size: 4 },
        { name: 'author', size: 4 },
        { name: 'authorSlug', size: 4 },
      ],
      [{ name: 'readingTime', size: 6 }],
      [{ name: 'seo', size: 12 }],
    ]);

    // Second pass is idempotent
    const secondPass = normalizeAuthorLayoutRows(firstPass.layout);
    assert.equal(secondPass.changed, false);

    // Decoupled admin translations include localized labels for authorProfile & authorSlug
    assert.equal(translateFieldLabel('authorProfile', 'es'), 'Perfil del Autor');
    assert.equal(translateFieldLabel('authorSlug', 'es'), 'Slug del Autor');
    assert.equal(
      ALL_ADMIN_TRANSLATIONS.es[
        'content-manager.content-types.api::article.article.authorProfile'
      ],
      'Perfil del Autor'
    );
    assert.equal(
      ALL_ADMIN_TRANSLATIONS.es[
        'content-manager.content-types.api::article.article.authorSlug'
      ],
      'Slug del Autor'
    );
  });
});

