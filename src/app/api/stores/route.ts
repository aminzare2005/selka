import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { createStoreSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const stores = await db.store.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(stores);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const body = await request.json();
  const parsed = createStoreSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const existing = await db.store.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return apiError("این آدرس قبلاً استفاده شده است", 409);

  const store = await db.store.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      ownerId: session.user.id,
      themeId: "modern",
      settings: {},
    },
  });

  revalidateTag(`store:${store.slug}`, "max");

  return apiSuccess(store, 201);
}
