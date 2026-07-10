import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { createProductSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";

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

  const products = await db.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(products);
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await getOwnedStore(storeId, session.user.id);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const existing = await db.product.findFirst({
    where: { storeId, slug: parsed.data.slug },
  });
  if (existing) return apiError("این آدرس محصول قبلاً استفاده شده", 409);

  const product = await db.product.create({
    data: {
      ...parsed.data,
      storeId,
      description: parsed.data.description ?? "",
    },
  });

  revalidateTag(`store:${store.slug}`, "max");
  revalidateTag(`product:${store.slug}:${product.slug}`, "max");

  return apiSuccess(product, 201);
}
