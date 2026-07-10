import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess } from "@/lib/api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const gateways = await db.storePaymentGateway.findMany({
    where: {
      isEnabled: true,
      store: { slug, status: "ACTIVE" },
      gateway: { isActive: true },
    },
    include: { gateway: true },
  });

  return apiSuccess(
    gateways.map((g) => ({
      slug: g.gateway.slug,
      name: g.gateway.name,
    })),
  );
}
