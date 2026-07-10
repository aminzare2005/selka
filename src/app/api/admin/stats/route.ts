import { requirePlatformAdmin } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";

export async function GET() {
  try {
    await requirePlatformAdmin();
  } catch {
    return apiError("دسترسی غیرمجاز", 403);
  }

  const [users, stores, orders] = await Promise.all([
    db.user.count(),
    db.store.count(),
    db.order.count(),
  ]);

  return apiSuccess({ users, stores, orders });
}
