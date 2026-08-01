import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { slug } = await params;
  const store = await db.store.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const orders = await db.order.findMany({
    where: {
      storeId: store.id,
      customerId: session.user.id,
    },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(orders);
}
