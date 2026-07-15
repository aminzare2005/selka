import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import { decrypt } from "@/lib/encryption";
import { storePath } from "@/lib/storefront-url";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success");
  const trackId = searchParams.get("trackId");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!orderId || !trackId) {
    return NextResponse.redirect(`${appUrl}/checkout/failed`);
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { store: true, payments: true },
  });

  if (!order) {
    return NextResponse.redirect(`${appUrl}/checkout/failed`);
  }

  const storeUrl = `${appUrl}${storePath(order.store.slug)}`;

  if (success !== "1") {
    await db.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    await db.payment.updateMany({
      where: { orderId },
      data: { status: "FAILED" },
    });
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  const payment = order.payments[0];
  if (!payment) {
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  const storeGateway = await db.storePaymentGateway.findFirst({
    where: {
      storeId: order.storeId,
      gateway: { slug: payment.gateway },
    },
    include: { gateway: true },
  });

  if (!storeGateway) {
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  const provider = getPaymentProvider(payment.gateway);
  if (!provider) {
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  let credentials: { merchantId: string };
  try {
    credentials = JSON.parse(decrypt(storeGateway.credentials));
  } catch {
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  const verifyResult = await provider.verifyPayment({
    trackId,
    merchantId: credentials.merchantId,
  });

  if (!verifyResult.success) {
    await db.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return NextResponse.redirect(`${storeUrl}/checkout/result?status=failed&orderId=${orderId}`);
  }

  await db.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status: "PAID" } });
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS", refId: verifyResult.refId, trackId },
    });

    const orderItems = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  return NextResponse.redirect(`${storeUrl}/checkout/result?status=success&orderId=${orderId}`);
}
