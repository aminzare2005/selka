import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";

type Params = { params: Promise<{ storeId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await db.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const orders = await db.order.findMany({
    where: { storeId },
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(orders);
}
