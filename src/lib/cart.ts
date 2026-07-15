import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

const CART_SESSION_COOKIE = "marty_cart_session";

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

export async function getOrCreateCart(storeId: string, userId?: string | null) {
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
