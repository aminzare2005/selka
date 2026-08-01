import { db } from "@/lib/db";

export type StoreCustomerProfile = {
  id: string;
  storeId: string;
  userId: string;
  name: string | null;
  phone: string | null;
  address: string | null;
};

export async function ensureStoreCustomer(
  storeId: string,
  userId: string,
  defaults?: { name?: string | null; phone?: string | null; address?: string | null },
) {
  return db.storeCustomer.upsert({
    where: { storeId_userId: { storeId, userId } },
    create: {
      storeId,
      userId,
      name: defaults?.name ?? null,
      phone: defaults?.phone ?? null,
      address: defaults?.address ?? null,
    },
    update: {},
  });
}

export async function getStoreCustomer(storeId: string, userId: string) {
  return db.storeCustomer.findUnique({
    where: { storeId_userId: { storeId, userId } },
  });
}

export async function updateStoreCustomer(
  storeId: string,
  userId: string,
  data: { name?: string; phone?: string; address?: string },
) {
  await ensureStoreCustomer(storeId, userId);
  return db.storeCustomer.update({
    where: { storeId_userId: { storeId, userId } },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
    },
  });
}
