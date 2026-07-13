import { db } from "@/lib/db";
import type { Store, StoreRole } from "@/generated/prisma/client";

export type PrimaryStore = Pick<Store, "id" | "name" | "slug" | "themeId" | "settings" | "status" | "ownerId">;

/**
 * Primary store for single-store UX: oldest OWNER membership, else oldest any membership,
 * else oldest owned store (legacy without membership row).
 */
export async function getPrimaryStoreForUser(userId: string): Promise<PrimaryStore | null> {
  const ownerMembership = await db.storeMembership.findFirst({
    where: { userId, role: "OWNER" },
    orderBy: { createdAt: "asc" },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          themeId: true,
          settings: true,
          status: true,
          ownerId: true,
        },
      },
    },
  });

  if (ownerMembership) return ownerMembership.store;

  const anyMembership = await db.storeMembership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          themeId: true,
          settings: true,
          status: true,
          ownerId: true,
        },
      },
    },
  });

  if (anyMembership) return anyMembership.store;

  // Legacy: stores owned before membership backfill
  return db.store.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      themeId: true,
      settings: true,
      status: true,
      ownerId: true,
    },
  });
}

export async function getAccessibleStoresForUser(userId: string) {
  const [memberships, owned] = await Promise.all([
    db.storeMembership.findMany({
      where: { userId },
      include: { store: true },
      orderBy: { createdAt: "asc" },
    }),
    db.store.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const byId = new Map<string, Store>();
  for (const s of owned) byId.set(s.id, s);
  for (const m of memberships) byId.set(m.store.id, m.store);
  return Array.from(byId.values());
}

/** Access if user is owner OR has a membership. Extensible for role checks later. */
export async function requireStoreAccess(
  storeId: string,
  userId: string,
  allowedRoles?: StoreRole[],
): Promise<Store | null> {
  const store = await db.store.findUnique({ where: { id: storeId } });
  if (!store) return null;

  if (store.ownerId === userId) {
    if (!allowedRoles || allowedRoles.includes("OWNER")) return store;
  }

  const membership = await db.storeMembership.findUnique({
    where: { storeId_userId: { storeId, userId } },
  });

  if (!membership) return null;
  if (allowedRoles && !allowedRoles.includes(membership.role)) return null;

  return store;
}

export async function createStoreWithOwnerMembership(data: {
  name: string;
  slug: string;
  ownerId: string;
  themeId?: string;
  settings?: object;
}) {
  return db.store.create({
    data: {
      name: data.name,
      slug: data.slug,
      ownerId: data.ownerId,
      themeId: data.themeId ?? "modern",
      settings: data.settings ?? {},
      memberships: {
        create: {
          userId: data.ownerId,
          role: "OWNER",
        },
      },
    },
  });
}

/** Backfill OWNER memberships for existing stores missing a row. */
export async function backfillOwnerMemberships() {
  const stores = await db.store.findMany({
    select: { id: true, ownerId: true },
  });

  for (const store of stores) {
    await db.storeMembership.upsert({
      where: {
        storeId_userId: { storeId: store.id, userId: store.ownerId },
      },
      create: {
        storeId: store.id,
        userId: store.ownerId,
        role: "OWNER",
      },
      update: {},
    });
  }
}
