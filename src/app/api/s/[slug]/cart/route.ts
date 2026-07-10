import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { getOrCreateCart, calculateCartTotal } from "@/lib/cart";
import { addToCartSchema } from "@/lib/validations";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const session = await getSession();
  const cart = await getOrCreateCart(store.id, session?.user.id);

  return apiSuccess({
    items: cart.items,
    total: calculateCartTotal(cart.items),
    itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = addToCartSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const product = await db.product.findFirst({
    where: { id: parsed.data.productId, storeId: store.id, isActive: true },
  });
  if (!product) return apiError("محصول یافت نشد", 404);
  if (product.stock < parsed.data.quantity) return apiError("موجودی کافی نیست", 400);

  const session = await getSession();
  const cart = await getOrCreateCart(store.id, session?.user.id);

  const existingItem = cart.items.find((i) => i.productId === product.id);
  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parsed.data.quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: parsed.data.quantity,
      },
    });
  }

  const updatedCart = await getOrCreateCart(store.id, session?.user.id);

  return apiSuccess({
    items: updatedCart.items,
    total: calculateCartTotal(updatedCart.items),
    itemCount: updatedCart.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}
