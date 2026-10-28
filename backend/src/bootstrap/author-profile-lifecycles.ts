import type { Core } from "@strapi/strapi";

export const PLUGIN_AUTHOR_RELATION_BINDINGS: Array<{
  uid: string;
  relationField: string;
  nameField: string;
  slugField: string;
}> = [
  {
    uid: "api::article.article",
    relationField: "authorProfile",
    nameField: "author",
    slugField: "authorSlug",
  },
  {
    uid: "plugin::media-feeds.media-item",
    relationField: "speakerProfile",
    nameField: "speaker",
    slugField: "speakerSlug",
  },
  {
    uid: "plugin::events.event",
    relationField: "speakerProfile",
    nameField: "speaker",
    slugField: "speakerSlug",
  },
  {
    uid: "plugin::resources.publication",
    relationField: "authorProfile",
    nameField: "authorName",
    slugField: "authorSlug",
  },
];

const KNOWN_ARABIC_AND_HONORIFIC_SLUGS: Record<string, string> = {
  "dr-amina-gomez": "dra-amina-gomez",
  "dra-amina-gomez": "dra-amina-gomez",
  "د-امينة-غوميز": "dra-amina-gomez",
  "د-أمينة-غوميز": "dra-amina-gomez",
  "sheikh-ahmad-al-mansoor": "sheikh-ahmad-al-mansoor",
  "seyh-ahmed-el-mansur": "sheikh-ahmad-al-mansoor",
  "الشيخ-أحمد-المنصور": "sheikh-ahmad-al-mansoor",
  "الشيخ-احمد-المنصور": "sheikh-ahmad-al-mansoor",
  "ustadh-tariq-ramirez": "ustadh-tariq-ramirez",
  "ustad-tarik-ramirez": "ustadh-tariq-ramirez",
  "الأستاذ-طارق-راميريز": "ustadh-tariq-ramirez",
  "الاستاذ-طارق-راميريز": "ustadh-tariq-ramirez",
  "hajj-ibrahim-al-khatib": "hajj-ibrahim-al-khatib",
  "haci-ibrahim-el-hatib": "hajj-ibrahim-al-khatib",
  "الحاج-إبراهيم-الخطيب": "hajj-ibrahim-al-khatib",
  "الحاج-ابراهيم-الخطيب": "hajj-ibrahim-al-khatib",
};

export function slugifyProfileName(input: string): string {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";

  const arabicKey = trimmed.replace(/[.\s]+/g, "-").replace(/^-+|-+$/g, "");
  if (KNOWN_ARABIC_AND_HONORIFIC_SLUGS[arabicKey]) {
    return KNOWN_ARABIC_AND_HONORIFIC_SLUGS[arabicKey];
  }

  const asciiSlug = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (KNOWN_ARABIC_AND_HONORIFIC_SLUGS[asciiSlug]) {
    return KNOWN_ARABIC_AND_HONORIFIC_SLUGS[asciiSlug];
  }
  return asciiSlug;
}

/**
 * Dynamically binds a `manyToOne` relation (`speakerProfile` / `authorProfile` -> `api::leader.leader`)
 * onto plugin content types during Strapi's `register()` lifecycle when `api::leader.leader` is present.
 */
export function bindAuthorProfileRelations(strapi: Core.Strapi) {
  const contentTypes = (strapi.contentTypes || {}) as Record<
    string,
    Record<string, any>
  >;
  if (!contentTypes["api::leader.leader"]) return;

  for (const { uid, relationField } of PLUGIN_AUTHOR_RELATION_BINDINGS) {
    if (uid === "api::article.article") continue; // already declared in article schema.json
    const ct = contentTypes[uid];
    if (!ct) continue;

    const relationDef = {
      type: "relation",
      relation: "manyToOne",
      target: "api::leader.leader",
    };

    if (ct.attributes && !ct.attributes[relationField]) {
      ct.attributes[relationField] = { ...relationDef };
    }
    if (ct.__schema__?.attributes && !ct.__schema__.attributes[relationField]) {
      ct.__schema__.attributes[relationField] = { ...relationDef };
    }
  }
}

interface LeaderProfileRecord {
  id: number;
  documentId?: string;
  name?: string;
  slug?: string;
  adminUserEmail?: string | null;
  adminUserId?: number | null;
}

async function resolveAuthenticatedAdminUser(
  strapi: Core.Strapi,
  data: Record<string, unknown>,
): Promise<{ id?: number; email?: string } | null> {
  try {
    const reqCtx = (
      strapi as unknown as {
        requestContext?: {
          get?: () =>
            { state?: { user?: { id?: number; email?: string } } } | undefined;
        };
      }
    ).requestContext?.get?.();

    const stateUser = reqCtx?.state?.user;
    if (
      stateUser &&
      (typeof stateUser.id === "number" || typeof stateUser.email === "string")
    ) {
      return {
        id: typeof stateUser.id === "number" ? stateUser.id : undefined,
        email:
          typeof stateUser.email === "string"
            ? stateUser.email.trim().toLowerCase()
            : undefined,
      };
    }

    const createdBy = data.createdBy;
    const adminUserId =
      typeof createdBy === "number"
        ? createdBy
        : typeof (createdBy as { id?: unknown })?.id === "number"
          ? ((createdBy as { id: number }).id as number)
          : undefined;

    if (adminUserId && strapi.db?.query) {
      const adminUser = (await strapi.db.query("admin::user").findOne({
        where: { id: adminUserId },
        select: ["id", "email"],
      })) as { id?: number; email?: string } | null;
      if (adminUser) {
        return {
          id: adminUser.id,
          email:
            typeof adminUser.email === "string"
              ? adminUser.email.trim().toLowerCase()
              : undefined,
        };
      }
    }
  } catch {
    // Fail safe if requestContext or admin::user query is unavailable during seed/CLI
  }
  return null;
}

async function findMatchingLeaderProfile(
  strapi: Core.Strapi,
  data: Record<string, unknown>,
  binding: { relationField: string; nameField: string; slugField: string },
  isCreate: boolean,
): Promise<LeaderProfileRecord | null> {
  if (!strapi.db?.query) return null;
  const leaderQuery = strapi.db.query("api::leader.leader");

  // 0. Check if editor selected/connected a Leader relation in relationField (`authorProfile` / `speakerProfile`)
  const relVal = data[binding.relationField] as any;
  if (relVal) {
    const candidate =
      typeof relVal === "number"
        ? { id: relVal }
        : Array.isArray(relVal?.connect) && relVal.connect.length > 0
          ? relVal.connect[0]
          : Array.isArray(relVal?.set) && relVal.set.length > 0
            ? relVal.set[0]
            : typeof relVal === "object"
              ? relVal
              : null;

    if (candidate?.id) {
      const byId = (await leaderQuery.findOne({
        where: { id: candidate.id },
      })) as LeaderProfileRecord | null;
      if (byId) return byId;
    }
    if (candidate?.documentId) {
      const byDocId = (await leaderQuery.findOne({
        where: { documentId: candidate.documentId },
      })) as LeaderProfileRecord | null;
      if (byDocId) return byDocId;
    }
  }

  // 1. Check if editor explicitly provided nameField or slugField
  const nameCandidate = data[binding.nameField];
  const rawName =
    typeof nameCandidate === "string" ? nameCandidate.trim() : "";
  if (rawName) {
    const byName = (await leaderQuery.findOne({
      where: { name: rawName },
    })) as LeaderProfileRecord | null;
    if (byName) return byName;
  }

  const slugCandidate = data[binding.slugField];
  const rawSlug =
    typeof slugCandidate === "string" ? slugCandidate.trim() : "";
  if (rawSlug) {
    const bySlug = (await leaderQuery.findOne({
      where: { slug: rawSlug },
    })) as LeaderProfileRecord | null;
    if (bySlug) return bySlug;
  }

  // 2. On create, if no manual author/speaker was provided, auto-match from backend admin::user
  if (isCreate && !rawSlug && !rawName) {
    const adminUser = await resolveAuthenticatedAdminUser(strapi, data);
    if (adminUser?.id) {
      const byAdminId = (await leaderQuery.findOne({
        where: { adminUserId: adminUser.id },
      })) as LeaderProfileRecord | null;
      if (byAdminId) return byAdminId;
    }
    if (adminUser?.email) {
      const byAdminEmail = (await leaderQuery.findOne({
        where: { adminUserEmail: adminUser.email },
      })) as LeaderProfileRecord | null;
      if (byAdminEmail) return byAdminEmail;
    }
  }

  return null;
}

export function registerAuthorProfileLifecycles(strapi: Core.Strapi) {
  if (!strapi.db?.lifecycles?.subscribe) return;

  // 1. Keep api::leader.leader slug and adminUserId synchronized
  strapi.db.lifecycles.subscribe({
    models: ["api::leader.leader"],
    async beforeCreate(event: { params?: { data?: Record<string, unknown> } }) {
      const data = event.params?.data;
      if (!data) return;

      if (
        (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) &&
        typeof data.name === "string" &&
        data.name.trim()
      ) {
        data.slug = slugifyProfileName(data.name);
      }

      if (
        typeof data.adminUserEmail === "string" &&
        data.adminUserEmail.trim() &&
        !data.adminUserId &&
        strapi.db?.query
      ) {
        const normalizedEmail = data.adminUserEmail.trim().toLowerCase();
        data.adminUserEmail = normalizedEmail;
        const adminUser = (await strapi.db.query("admin::user").findOne({
          where: { email: normalizedEmail },
          select: ["id"],
        })) as { id?: number } | null;
        if (adminUser?.id) {
          data.adminUserId = adminUser.id;
        }
      }
    },
    async beforeUpdate(event: { params?: { data?: Record<string, unknown> } }) {
      const data = event.params?.data;
      if (!data) return;

      if (
        typeof data.adminUserEmail === "string" &&
        data.adminUserEmail.trim() &&
        strapi.db?.query
      ) {
        const normalizedEmail = data.adminUserEmail.trim().toLowerCase();
        data.adminUserEmail = normalizedEmail;
        if (!data.adminUserId) {
          const adminUser = (await strapi.db.query("admin::user").findOne({
            where: { email: normalizedEmail },
            select: ["id"],
          })) as { id?: number } | null;
          if (adminUser?.id) {
            data.adminUserId = adminUser.id;
          }
        }
      }
    },
  });

  // 2. Auto-link Articles, Khutbahs/Media Items, Events, and Publications to Staff/Author profiles
  strapi.db.lifecycles.subscribe({
    models: PLUGIN_AUTHOR_RELATION_BINDINGS.map((b) => b.uid),
    async beforeCreate(event: {
      model?: { uid?: string };
      params?: { data?: Record<string, unknown> };
    }) {
      const uid = event.model?.uid;
      const data = event.params?.data;
      if (!uid || !data) return;

      const binding = PLUGIN_AUTHOR_RELATION_BINDINGS.find(
        (b) => b.uid === uid,
      );
      if (!binding) return;

      const hasExplicitRelation = Boolean(
        data[binding.relationField] &&
          (typeof data[binding.relationField] === "number" ||
            (Array.isArray((data[binding.relationField] as any)?.connect) &&
              (data[binding.relationField] as any).connect.length > 0) ||
            (Array.isArray((data[binding.relationField] as any)?.set) &&
              (data[binding.relationField] as any).set.length > 0) ||
            (data[binding.relationField] as any)?.id ||
            (data[binding.relationField] as any)?.documentId),
      );

      const profile = await findMatchingLeaderProfile(
        strapi,
        data,
        binding,
        true,
      );
      if (!profile) {
        const rawName =
          typeof data[binding.nameField] === "string"
            ? (data[binding.nameField] as string).trim()
            : "";
        if (rawName) {
          data[binding.slugField] = slugifyProfileName(rawName);
        }
        return;
      }

      if (
        (hasExplicitRelation ||
          !data[binding.nameField] ||
          typeof data[binding.nameField] !== "string" ||
          !(data[binding.nameField] as string).trim()) &&
        profile.name
      ) {
        data[binding.nameField] = profile.name;
      }

      if (profile.slug) {
        data[binding.slugField] = profile.slug;
      }

      if (!data[binding.relationField] && profile.id) {
        data[binding.relationField] = profile.id;
      }
    },
    async beforeUpdate(event: {
      model?: { uid?: string };
      params?: { data?: Record<string, unknown> };
    }) {
      const uid = event.model?.uid;
      const data = event.params?.data;
      if (!uid || !data) return;

      const binding = PLUGIN_AUTHOR_RELATION_BINDINGS.find(
        (b) => b.uid === uid,
      );
      if (!binding) return;

      const hasExplicitRelation = Boolean(
        data[binding.relationField] &&
          (typeof data[binding.relationField] === "number" ||
            (Array.isArray((data[binding.relationField] as any)?.connect) &&
              (data[binding.relationField] as any).connect.length > 0) ||
            (Array.isArray((data[binding.relationField] as any)?.set) &&
              (data[binding.relationField] as any).set.length > 0) ||
            (data[binding.relationField] as any)?.id ||
            (data[binding.relationField] as any)?.documentId),
      );

      const profile = await findMatchingLeaderProfile(
        strapi,
        data,
        binding,
        false,
      );
      if (profile?.slug) {
        data[binding.slugField] = profile.slug;
        if (
          (hasExplicitRelation ||
            !data[binding.nameField] ||
            typeof data[binding.nameField] !== "string" ||
            !(data[binding.nameField] as string).trim()) &&
          profile.name
        ) {
          data[binding.nameField] = profile.name;
        }
        return;
      }

      const rawName =
        typeof data[binding.nameField] === "string"
          ? (data[binding.nameField] as string).trim()
          : "";
      if (rawName) {
        data[binding.slugField] = slugifyProfileName(rawName);
      }
    },
  });
}

/**
 * Backfills `authorSlug`/`speakerSlug` and `authorProfile`/`speakerProfile` relations
 * on existing rows in the database so entries seeded before `authorSlug` was added
 * immediately display their read-only slug and linked profile.
 */
export async function backfillAuthorProfilesAndSlugs(strapi: Core.Strapi) {
  if (!strapi.db?.query) return;

  try {
    const leaders = (await strapi.db.query("api::leader.leader").findMany({
      select: ["id", "documentId", "locale", "name", "slug"],
    })) as Array<{
      id: number;
      documentId?: string;
      locale?: string;
      name?: string;
      slug?: string;
    }>;

    for (const {
      uid,
      relationField,
      nameField,
      slugField,
    } of PLUGIN_AUTHOR_RELATION_BINDINGS) {
      if (!strapi.contentTypes?.[uid as keyof typeof strapi.contentTypes]) {
        continue;
      }

      const rows = (await strapi.db.query(uid).findMany({
        populate: [relationField],
      })) as Array<Record<string, any>>;

      for (const row of rows) {
        const rawName =
          typeof row[nameField] === "string" ? row[nameField].trim() : "";
        const rawSlug =
          typeof row[slugField] === "string" ? row[slugField].trim() : "";
        const existingRel = row[relationField];
        const rowLocale = typeof row.locale === "string" ? row.locale : "es";

        const computedSlug =
          existingRel?.slug ||
          rawSlug ||
          (rawName ? slugifyProfileName(rawName) : "");

        const matchedLeader =
          leaders.find(
            (l) =>
              l.locale === rowLocale &&
              ((rawName && l.name === rawName) ||
                (computedSlug && l.slug === computedSlug)),
          ) ||
          leaders.find(
            (l) =>
              (rawName && l.name === rawName) ||
              (computedSlug && l.slug === computedSlug),
          );

        const nextSlug = matchedLeader?.slug || computedSlug;
        const nextName = rawName || matchedLeader?.name || "";
        const needsSlugUpdate = Boolean(nextSlug && row[slugField] !== nextSlug);
        const needsNameUpdate = Boolean(
          !rawName && nextName && row[nameField] !== nextName,
        );
        const needsRelationUpdate = Boolean(
          matchedLeader?.id && !existingRel?.id,
        );

        if (needsSlugUpdate || needsNameUpdate || needsRelationUpdate) {
          const updateData: Record<string, unknown> = {};
          if (needsSlugUpdate) updateData[slugField] = nextSlug;
          if (needsNameUpdate) updateData[nameField] = nextName;
          if (needsRelationUpdate && matchedLeader?.id) {
            updateData[relationField] = matchedLeader.id;
          }
          await strapi.db.query(uid).update({
            where: { id: row.id },
            data: updateData,
          });
        }
      }
    }
  } catch (err) {
    strapi.log?.warn?.(
      `[author-profile-lifecycles] Backfill skipped or partially failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}


