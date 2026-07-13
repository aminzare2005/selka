import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { storeGatewaySchema } from "@/lib/validations";
import { encrypt } from "@/lib/encryption";
import { requireStoreAccess } from "@/lib/store-access";

type Params = { params: Promise<{ storeId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await requireStoreAccess(storeId, session.user.id);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const gateways = await db.paymentGateway.findMany({
    where: { isActive: true },
    include: {
      storeGateways: {
        where: { storeId },
      },
    },
  });

  return apiSuccess(
    gateways.map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      description: g.description,
      isEnabled: g.storeGateways[0]?.isEnabled ?? false,
      hasCredentials: !!g.storeGateways[0]?.credentials,
    })),
  );
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { storeId } = await params;
  const store = await requireStoreAccess(storeId, session.user.id, ["OWNER", "ADMIN"]);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = storeGatewaySchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const gateway = await db.paymentGateway.findUnique({
    where: { id: parsed.data.gatewayId },
  });
  if (!gateway || !gateway.isActive) return apiError("درگاه یافت نشد", 404);

  if (parsed.data.isEnabled && !parsed.data.merchantId) {
    const existing = await db.storePaymentGateway.findUnique({
      where: { storeId_gatewayId: { storeId, gatewayId: parsed.data.gatewayId } },
    });
    if (!existing?.credentials) {
      return apiError("شناسه پذیرنده الزامی است", 400);
    }
  }

  const credentials = parsed.data.merchantId
    ? encrypt(JSON.stringify({ merchantId: parsed.data.merchantId }))
    : "";

  const storeGateway = await db.storePaymentGateway.upsert({
    where: {
      storeId_gatewayId: { storeId, gatewayId: parsed.data.gatewayId },
    },
    create: {
      storeId,
      gatewayId: parsed.data.gatewayId,
      isEnabled: parsed.data.isEnabled,
      credentials,
    },
    update: {
      isEnabled: parsed.data.isEnabled,
      credentials: credentials || undefined,
    },
  });

  return apiSuccess({ success: true, id: storeGateway.id });
}
