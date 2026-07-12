import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { updateOrderStatusSchema } from "@/lib/validations";

type Params = { params: Promise<{ storeId: string; orderId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId, orderId } = await params;

  const order = await db.order.findFirst({
    where: { id: orderId, storeId, store: { ownerId: session.user.id } },
  });
  if (!order) return apiError("سفارش یافت نشد", 404);

  const body = await request.json();
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const updated = await db.order.update({
    where: { id: orderId },
    data: { status: parsed.data.status },
    include: { items: true, payments: true },
  });

  return apiSuccess(updated);
}
