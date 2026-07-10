import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { getOrCreateCart, calculateCartTotal } from "@/lib/cart";
import { updateCartItemSchema } from "@/lib/validations";

type Params = { params: Promise<{ slug: string; itemId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { slug, itemId } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const session = await getSession();
  const cart = await getOrCreateCart(store.id, session?.user.id);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) return apiError("آیتم یافت نشد", 404);

  if (parsed.data.quantity === 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    if (item.product.stock < parsed.data.quantity) {
      return apiError("موجودی کافی نیست", 400);
    }
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsed.data.quantity },
    });
  }

  const updatedCart = await getOrCreateCart(store.id, session?.user.id);

  return apiSuccess({
    items: updatedCart.items,
    total: calculateCartTotal(updatedCart.items),
    itemCount: updatedCart.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { slug, itemId } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const session = await getSession();
  const cart = await getOrCreateCart(store.id, session?.user.id);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) return apiError("آیتم یافت نشد", 404);

  await db.cartItem.delete({ where: { id: itemId } });

  const updatedCart = await getOrCreateCart(store.id, session?.user.id);

  return apiSuccess({
    items: updatedCart.items,
    total: calculateCartTotal(updatedCart.items),
    itemCount: updatedCart.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}
