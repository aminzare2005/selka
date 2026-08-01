import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";

type Params = { params: Promise<{ slug: string; orderId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { slug, orderId } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      storeId: store.id,
      customerId: session.user.id,
    },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) return apiError("سفارش یافت نشد", 404);

  return apiSuccess(order);
}
