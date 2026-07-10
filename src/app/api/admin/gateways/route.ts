import { NextRequest } from "next/server";
import { requirePlatformAdmin } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { gatewayAdminSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requirePlatformAdmin();
  } catch {
    return apiError("دسترسی غیرمجاز", 403);
  }

  const gateways = await db.paymentGateway.findMany({ orderBy: { createdAt: "desc" } });
  return apiSuccess(gateways);
}

export async function POST(request: NextRequest) {
  try {
    await requirePlatformAdmin();
  } catch {
    return apiError("دسترسی غیرمجاز", 403);
  }

  const body = await request.json();
  const parsed = gatewayAdminSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const gateway = await db.paymentGateway.upsert({
    where: { slug: parsed.data.slug },
    create: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      isActive: parsed.data.isActive,
      configSchema: [{ key: "merchantId", label: "شناسه پذیرنده", type: "text", required: true }],
    },
    update: {
      name: parsed.data.name,
      description: parsed.data.description,
      isActive: parsed.data.isActive,
    },
  });

  return apiSuccess(gateway, 201);
}
