import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

const CART_SESSION_COOKIE = "selka_cart_session";

export async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return sessionId;
}

async function mergeGuestCartIntoUser(storeId: string, userId: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) return;

  const guestCart = await db.cart.findFirst({
    where: { storeId, sessionId, userId: null },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await db.cart.findFirst({
    where: { storeId, userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await db.cart.create({
      data: { storeId, userId },
      include: { items: true },
    });
  }

  for (const item of guestCart.items) {
    const existing = userCart.items.find((i) => i.productId === item.productId);
    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  await db.cart.delete({ where: { id: guestCart.id } }).catch(() => undefined);
}

export async function getOrCreateCart(storeId: string, userId?: string | null) {
  if (userId) {
    await mergeGuestCartIntoUser(storeId, userId);
  }

  const sessionId = userId ? undefined : await getCartSessionId();

  let cart = await db.cart.findFirst({
    where: userId
      ? { storeId, userId }
      : { storeId, sessionId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        storeId,
        userId: userId ?? undefined,
        sessionId: userId ? undefined : sessionId,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  return cart;
}

export function calculateCartTotal(
  items: Array<{ quantity: number; product: { price: number } }>,
): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function countCartItems(
  items: Array<{ quantity: number }>,
): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
