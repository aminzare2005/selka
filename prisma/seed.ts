import "dotenv/config";
import { db } from "../src/lib/db";
import { auth } from "../src/lib/auth";

async function createUserWithAuth(
  email: string,
  password: string,
  name: string,
  role: "USER" | "PLATFORM_ADMIN" = "USER",
) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;

  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  const user = await db.user.update({
    where: { email },
    data: { role, emailVerified: true },
  });

  return user;
}

async function main() {
  console.log("🌱 Seeding database...");

  const admin = await createUserWithAuth(
    "admin@marty.ir",
    "admin123",
    "ادمین پلتفرم",
    "PLATFORM_ADMIN",
  );
  console.log("✅ Admin: admin@marty.ir / admin123");

  const demo = await createUserWithAuth(
    "demo@marty.ir",
    "demo123",
    "فروشنده نمونه",
  );
  console.log("✅ Demo: demo@marty.ir / demo123");

  await db.paymentGateway.upsert({
    where: { slug: "zibal" },
    create: {
      slug: "zibal",
      name: "زیبال",
      description: "درگاه پرداخت زیبال",
      isActive: true,
      configSchema: [
        {
          key: "merchantId",
          label: "شناسه پذیرنده",
          type: "text",
          required: true,
        },
      ],
    },
    update: { isActive: true },
  });
  console.log("✅ Zibal gateway registered");

  let demoStore = await db.store.findUnique({ where: { slug: "demo-shop" } });
  if (!demoStore) {
    demoStore = await db.store.create({
      data: {
        name: "فروشگاه نمونه",
        slug: "demo-shop",
        ownerId: demo.id,
        themeId: "modern",
        settings: {
          heroTitle: "فروشگاه نمونه مارتی",
          heroSubtitle: "بهترین محصولات با بهترین قیمت",
          tokens: { colors: { primary: "#0F766E" } },
        },
        memberships: {
          create: { userId: demo.id, role: "OWNER" },
        },
      },
    });

    await db.product.createMany({
      data: [
        {
          storeId: demoStore.id,
          title: "محصول نمونه ۱",
          slug: "product-1",
          description: "توضیحات محصول نمونه اول",
          price: 150000,
          compareAtPrice: 200000,
          stock: 10,
          images: [],
        },
        {
          storeId: demoStore.id,
          title: "محصول نمونه ۲",
          slug: "product-2",
          description: "توضیحات محصول نمونه دوم",
          price: 250000,
          stock: 5,
          images: [],
        },
        {
          storeId: demoStore.id,
          title: "محصول نمونه ۳",
          slug: "product-3",
          description: "توضیحات محصول نمونه سوم",
          price: 99000,
          stock: 20,
          images: [],
        },
      ],
    });
    console.log("✅ Demo store: /@demo-shop");
  } else {
    await db.storeMembership.upsert({
      where: { storeId_userId: { storeId: demoStore.id, userId: demo.id } },
      create: { storeId: demoStore.id, userId: demo.id, role: "OWNER" },
      update: {},
    });
  }

  // Backfill any legacy stores without membership rows
  const { backfillOwnerMemberships } = await import("../src/lib/store-access");
  await backfillOwnerMemberships();
  console.log("✅ Owner memberships backfilled");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
