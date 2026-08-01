import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { ensureStoreCustomer, updateStoreCustomer } from "@/lib/store-customer";
import { storeCustomerProfileSchema } from "@/lib/validations";
import { toUiIranMobile } from "@/lib/phone";
import type { Session } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

async function getActiveStore(slug: string) {
  return db.store.findUnique({ where: { slug, status: "ACTIVE" } });
}

function formatProfilePhone(phone: string | null | undefined) {
  return phone ? toUiIranMobile(phone) : null;
}

function sessionPhone(session: Session) {
  return session.user.phoneNumber ?? null;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { slug } = await params;
  const store = await getActiveStore(slug);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const accountPhone = sessionPhone(session);
  const profile = await ensureStoreCustomer(store.id, session.user.id, {
    name: session.user.name,
    phone: accountPhone,
  });

  return apiSuccess({
    ...profile,
    phone: formatProfilePhone(profile.phone),
    accountPhone: formatProfilePhone(accountPhone),
  });
}

/** Ensure StoreCustomer row exists (called after storefront login/register). */
export async function POST(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { slug } = await params;
  const store = await getActiveStore(slug);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const accountPhone = sessionPhone(session);
  const profile = await ensureStoreCustomer(store.id, session.user.id, {
    name: session.user.name,
    phone: accountPhone,
  });

  return apiSuccess(
    {
      ...profile,
      phone: formatProfilePhone(profile.phone),
      accountPhone: formatProfilePhone(accountPhone),
    },
    201,
  );
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { slug } = await params;
  const store = await getActiveStore(slug);
  if (!store) return apiError("فروشگاه یافت نشد", 404);

  const body = await request.json();
  const parsed = storeCustomerProfileSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const profile = await updateStoreCustomer(store.id, session.user.id, parsed.data);
  return apiSuccess({
    ...profile,
    phone: formatProfilePhone(profile.phone),
  });
}
