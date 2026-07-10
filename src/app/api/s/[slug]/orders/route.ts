import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) return apiError("شناسه سفارش الزامی است", 400);

  const order = await db.order.findFirst({
    where: { id: orderId, store: { slug } },
    include: { items: true, payments: true },
  });

  if (!order) return apiError("سفارش یافت نشد", 404);

  return apiSuccess(order);
}
