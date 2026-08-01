import "dotenv/config";
import { db } from "../src/lib/db";
import { auth } from "../src/lib/auth";
import { phoneToInternalEmail, toE164IranMobile } from "../src/lib/phone";

const LEGACY_EMAIL_BY_UI_PHONE: Record<string, string> = {
  "09000000000": "admin@selka.ir",
  "09000000001": "demo@selka.ir",
};

async function createUserWithPhone(
  uiPhone: string,
  password: string,
  name: string,
  role: "USER" | "PLATFORM_ADMIN" = "USER",
) {
  const e164 = toE164IranMobile(uiPhone);
  if (!e164) throw new Error(`Invalid seed phone: ${uiPhone}`);
  const email = phoneToInternalEmail(e164);
  const legacyEmail = LEGACY_EMAIL_BY_UI_PHONE[uiPhone];

  const existing = await db.user.findFirst({
    where: {
      OR: [
        { phoneNumber: e164 },
        { email },
        ...(legacyEmail ? [{ email: legacyEmail }] : []),
      ],
    },
  });
  if (existing) {
    return db.user.update({
      where: { id: existing.id },
      data: {
        role,
        name,
        email,
        phoneNumber: e164,
        phoneNumberVerified: true,
        emailVerified: true,
      },
    });
  }

  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  return db.user.update({
    where: { email },
    data: {
      role,
      phoneNumber: e164,
      phoneNumberVerified: true,
      emailVerified: true,
    },
  });
}

async function main() {
  console.log("🌱 Seeding database...");

  await createUserWithPhone(
    "09000000000",
    "admin123",
    "ادمین پلتفرم",
    "PLATFORM_ADMIN",
  );
  console.log("✅ Admin: 09000000000 / admin123");

  const demo = await createUserWithPhone(
    "09000000001",
    "demo123",
    "فروشنده نمونه",
  );
  console.log("✅ Demo: 09000000001 / demo123");

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
        themeId: "default",
        settings: {
          heroTitle: "فروشگاه نمونه سلکا",
          heroSubtitle: "منتخب‌ها، با سادگی و دقت",
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
    if (demoStore.ownerId !== demo.id || demoStore.themeId !== "default") {
      const settings =
        demoStore.settings && typeof demoStore.settings === "object"
          ? { ...(demoStore.settings as Record<string, unknown>) }
          : {};
      // Drop legacy chromatic token overrides so default monochrome theme shows correctly
      if (settings.tokens) delete settings.tokens;

      await db.store.update({
        where: { id: demoStore.id },
        data: {
          ownerId: demo.id,
          themeId: "default",
          settings,
        },
      });
    }
  }

  const { backfillOwnerMemberships } = await import("../src/lib/store-access");
  await backfillOwnerMemberships();
  console.log("✅ Owner memberships backfilled");

  const legacyTheme = await db.store.updateMany({
    where: { themeId: "nova" },
    data: { themeId: "default" },
  });
  if (legacyTheme.count > 0) {
    console.log(`✅ Migrated ${legacyTheme.count} store(s) from nova → default`);
  }

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
