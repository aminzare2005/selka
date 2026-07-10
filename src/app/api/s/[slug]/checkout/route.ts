import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { getOrCreateCart, calculateCartTotal } from "@/lib/cart";
import { checkoutSchema } from "@/lib/validations";
import { getPaymentProvider } from "@/lib/payments";
import { decrypt } from "@/lib/encryption";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const session = await getSession();
  const cart = await getOrCreateCart(store.id, session?.user.id);

  if (cart.items.length === 0) return apiError("سبد خرید خالی است", 400);

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return apiError(`موجودی ${item.product.title} کافی نیست`, 400);
    }
  }

  const total = calculateCartTotal(cart.items);

  const storeGateway = await db.storePaymentGateway.findFirst({
    where: {
      storeId: store.id,
      isEnabled: true,
      gateway: { slug: parsed.data.gatewaySlug, isActive: true },
    },
    include: { gateway: true },
  });

  if (!storeGateway) return apiError("درگاه پرداخت فعال نیست", 400);

  const provider = getPaymentProvider(parsed.data.gatewaySlug);
  if (!provider) return apiError("درگاه پرداخت پشتیبانی نمی‌شود", 400);

  let credentials: { merchantId: string };
  try {
    credentials = JSON.parse(decrypt(storeGateway.credentials));
  } catch {
    return apiError("تنظیمات درگاه نامعتبر است", 500);
  }

  const order = await db.order.create({
    data: {
      storeId: store.id,
      customerId: session?.user.id,
      status: "PENDING",
      totalAmount: total,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerAddress: parsed.data.customerAddress,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = `${appUrl}/api/payments/zibal/callback?orderId=${order.id}`;

  const paymentResult = await provider.createPayment({
    amount: total,
    orderId: order.id,
    callbackUrl,
    description: `سفارش ${order.id}`,
    merchantId: credentials.merchantId,
  });

  await db.payment.create({
    data: {
      orderId: order.id,
      gateway: parsed.data.gatewaySlug,
      trackId: paymentResult.trackId,
      amount: total,
      status: "PENDING",
    },
  });

  await db.cartItem.deleteMany({ where: { cartId: cart.id } });

  return apiSuccess({ redirectUrl: paymentResult.redirectUrl, orderId: order.id });
}
