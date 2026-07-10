import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { updateStoreThemeSchema } from "@/lib/validations";
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
  const parsed = updateStoreThemeSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const currentSettings = (store.settings as Record<string, unknown>) ?? {};
  const newSettings = parsed.data.settings
    ? { ...currentSettings, ...parsed.data.settings }
    : currentSettings;

  const updated = await db.store.update({
    where: { id: storeId },
    data: {
      themeId: parsed.data.themeId ?? store.themeId,
      settings: newSettings as Prisma.InputJsonValue,
    },
  });

  revalidateTag(`store:${store.slug}`, "max");

  return apiSuccess(updated);
}
