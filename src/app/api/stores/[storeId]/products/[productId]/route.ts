import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { updateProductSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";
import { requireStoreAccess } from "@/lib/store-access";

type Params = { params: Promise<{ storeId: string; productId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId, productId } = await params;

  const store = await requireStoreAccess(storeId, session.user.id, ["OWNER", "ADMIN"]);
  if (!store) return apiError("محصول یافت نشد", 404);

  const product = await db.product.findFirst({
    where: { id: productId, storeId },
  });
  if (!product) return apiError("محصول یافت نشد", 404);

  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  if (parsed.data.slug && parsed.data.slug !== product.slug) {
    const existing = await db.product.findFirst({
      where: { storeId, slug: parsed.data.slug, NOT: { id: productId } },
    });
    if (existing) return apiError("این آدرس محصول قبلاً استفاده شده", 409);
  }

  const updated = await db.product.update({
    where: { id: productId },
    data: parsed.data,
  });

  revalidateTag(`store:${store.slug}`, "max");
  revalidateTag(`product:${store.slug}:${product.slug}`, "max");
  if (updated.slug !== product.slug) {
    revalidateTag(`product:${store.slug}:${updated.slug}`, "max");
  }

  return apiSuccess(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId, productId } = await params;

  const store = await requireStoreAccess(storeId, session.user.id, ["OWNER", "ADMIN"]);
  if (!store) return apiError("محصول یافت نشد", 404);

  const product = await db.product.findFirst({
    where: { id: productId, storeId },
  });
  if (!product) return apiError("محصول یافت نشد", 404);

  await db.product.delete({ where: { id: productId } });

  revalidateTag(`store:${store.slug}`, "max");

  return apiSuccess({ success: true });
}
