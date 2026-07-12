import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { updateStoreSchema, updateStoreThemeSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";

type Params = { params: Promise<{ storeId: string }> };

async function getOwnedStore(storeId: string, userId: string) {
  return db.store.findFirst({
    where: { id: storeId, ownerId: userId },
  });
}

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await getOwnedStore(storeId, session.user.id);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  return apiSuccess(store);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await getOwnedStore(storeId, session.user.id);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const hasThemeFields = "themeId" in body || "settings" in body;
  const hasProfileFields = "name" in body || "slug" in body;

  if (!hasThemeFields && !hasProfileFields) {
    return apiError("داده نامعتبر", 400);
  }

  const currentSettings = (store.settings as Record<string, unknown>) ?? {};
  const updateData: { themeId?: string; settings?: Prisma.InputJsonValue; name?: string; slug?: string } = {};

  if (hasThemeFields) {
    const parsed = updateStoreThemeSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
    }

    updateData.themeId = parsed.data.themeId ?? store.themeId;
    updateData.settings = parsed.data.settings
      ? ({ ...currentSettings, ...parsed.data.settings } as Prisma.InputJsonValue)
      : (currentSettings as Prisma.InputJsonValue);
  }

  if (hasProfileFields) {
    const parsed = updateStoreSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
    }

    if (parsed.data.slug && parsed.data.slug !== store.slug) {
      const existing = await db.store.findUnique({ where: { slug: parsed.data.slug } });
      if (existing) return apiError("این آدرس قبلاً استفاده شده است", 409);
    }

    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug;
  }

  const updated = await db.store.update({
    where: { id: storeId },
    data: updateData,
  });

  revalidateTag(`store:${store.slug}`, "max");
  if (updated.slug !== store.slug) {
    revalidateTag(`store:${updated.slug}`, "max");
  }

  return apiSuccess(updated);
}
