# سلکا (Selka) — پلتفرم فروشگاه‌ساز مولتی‌تننت

پلتفرم فروشگاهی فارسی با Next.js 16، PostgreSQL، Prisma، Better Auth و سیستم تم.

## پیش‌نیازها

- Node.js 20+
- npm
- (اختیاری) PostgreSQL نصب‌شده روی سیستم — اگر از `prisma dev` استفاده کنی لازم نیست

## راه‌اندازی توسعه (دو سرور)

برای کار روزمره همیشه **دو چیز** باید بالا باشند:

| # | نقش | دستور | پورت معمول |
|---|-----|--------|------------|
| ۱ | دیتابیس | `npm run db:dev` | TCP معمولاً `51214`+ (هر بار چک کن) |
| ۲ | اپ Next.js | `npm run dev` | `http://localhost:3000` |

### ۱) یک‌بار اول — env و پکیج‌ها

```bash
cp .env.example .env
npm install
```

مقادیر ضروری در `.env`:

```env
DATABASE_URL="..."   # بعد از بالا آوردن دیتابیس ست می‌شود
BETTER_AUTH_SECRET="یک-رشته-تصادفی-طولانی"
BETTER_AUTH_URL="http://localhost:3000"
ENCRYPTION_KEY="کلید-۳۲-کاراکتری-برای-رمزنگاری"
STORAGE_DRIVER="local"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### ۲) سرور دیتابیس

**روش پیشنهادی — Prisma Dev (بدون نصب Postgres جدا):**

```bash
# ترمینال ۱ — در پس‌زمینه با نام ثابت پروژه
npm run db:dev -- --detach --name selka
```

خروجی چیزی شبیه این است:

```text
postgres://postgres:postgres@localhost:51218/template1?sslmode=disable
```

همین URL را در `.env` به‌عنوان `DATABASE_URL` بگذار.  
اگر سرور با `--name selka` از قبل ساخته شده، با `npx prisma dev ls` وضعیت و URL را ببین.

دستورهای مفید:

```bash
npx prisma dev ls           # لیست سرورها و URLها
npx prisma dev stop selka   # خاموش کردن
npx prisma dev start selka  # روشن کردن دوباره همان سرور
npx prisma dev rm selka     # حذف کامل (داده پاک می‌شود)
```

**روش جایگزین — PostgreSQL خودت:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/selka?schema=public"
```

دیتابیس `selka` را بساز، بعد schema را اعمال کن (گام ۳). در این حالت به `db:dev` نیاز نداری؛ فقط Next کافی است.

### ۳) Schema و داده نمونه

با `DATABASE_URL` درست در `.env` (یا همان session):

```bash
npm run db:push    # اعمال schema روی دیتابیس خالی/توسعه
npm run db:seed    # ادمین، فروشنده دمو، فروشگاه نمونه
```

برای migration رسمی به‌جای push:

```bash
npm run db:migrate
```

### ۴) سرور Next.js

```bash
# ترمینال ۲
npm run dev
```

آدرس‌ها:

- پنل: http://localhost:3000/dashboard  
- لندینگ: http://localhost:3000  
- فروشگاه نمونه: http://localhost:3000/@demo-shop  

### ۵) خاموش کردن همه چیز

```bash
# Ctrl+C روی ترمینال Next
npx prisma dev stop selka
```

اگر پورت ۳۰۰۰ گیر کرده باشد (ویندوز):

```powershell
netstat -ano | findstr ":3000"
# سپس فقط PID مربوط به node همین پروژه را ببند
```

## چک‌لیست روزانه (بعد از اولین راه‌اندازی)

```bash
npx prisma dev start selka   # اگر DB خاموش است
# در .env همان DATABASE_URL سرور selka را نگه دار
npm run dev
```

اگر schema عوض شده:

```bash
npm run db:push
# یا npm run db:migrate
```

اگر داده نمونه لازم است دوباره:

```bash
npm run db:seed
```

Prisma Studio (اختیاری):

```bash
npm run db:studio
```

## حساب‌های نمونه (بعد از seed)

| نقش           | شماره موبایل | رمز      |
| ------------- | ------------ | -------- |
| ادمین پلتفرم  | 09000000000  | admin123 |
| فروشنده نمونه | 09000000001  | demo123  |

شماره در دیتابیس به‌صورت E.164 (`+989…`) ذخیره می‌شود؛ در UI با فرمت `09…` وارد و نمایش داده می‌شود.

## مسیرها

- `/` — لندینگ پلتفرم
- `/login`, `/register` — احراز هویت
- `/dashboard` — پنل صاحب فروشگاه
- `/admin` — پنل ادمین پلتفرم
- `/@slug` — ویترین فروشگاه
- `/@slug/products/[slug]` — صفحه محصول
- `/@slug/cart` — سبد خرید
- `/@slug/checkout` — پرداخت

## فروشگاه نمونه

بعد از seed: [http://localhost:3000/@demo-shop](http://localhost:3000/@demo-shop)

## تم‌ها

تم‌های داخلی: `default` (پیش‌فرض مینیمال)، `modern` و `classic`. شناسه قدیمی `nova` به `default` alias می‌شود.

### معماری تم

```
packages/theme-sdk/     ← قرارداد مشترک (ThemePackage)
themes.config.ts        ← رجیستری تم‌ها
src/themes/             ← تم‌های داخلی
```

هر تم یک `ThemePackage` export می‌کند:

- `definition` — metadata، رنگ‌ها، فونت‌ها، sections
- `Layout` — کامپوننت layout
- `sections` — hero، product-grid، footer

### افزودن تم خارجی

1. پکیج تم را بسازید (طبق قرارداد `@selka/theme-sdk`)
2. در `package.json` نصب کنید:
   ```json
   "@selka-theme/my-theme": "file:./my-theme"
   ```
   یا از GitHub:
   ```json
   "@selka-theme/my-theme": "github:USER/selka-theme-my-theme"
   ```
3. در [`themes.config.ts`](themes.config.ts) ثبت کنید
4. در [`next.config.ts`](next.config.ts) به `transpilePackages` اضافه کنید

فونت‌های Google را در `definition.googleFonts` تعریف کنید — خودکار لود می‌شوند.

## پرداخت

درگاه زیبال با adapter pattern. ادمین پلتفرم درگاه را فعال می‌کند؛ صاحب فروشگاه Merchant ID خود را وارد می‌کند.

## اسکریپت‌ها

```bash
npm run dev          # Next.js (prisma generate + next dev)
npm run build        # بیلد production
npm run db:dev       # سرور Postgres محلی Prisma
npm run db:push      # اعمال schema
npm run db:migrate   # migration توسعه
npm run db:seed      # داده نمونه
npm run db:studio    # UI دیتابیس
npm run db:generate  # فقط Prisma Client
```

## راهنمای ایجنت‌ها

قراردادها و نقشهٔ کد برای coding agentها در [`AGENTS.md`](AGENTS.md) است (و `CLAUDE.md` به همان فایل اشاره می‌کند).

## دیپلوی پروداکشن

راهنمای کامل Vercel + PostgreSQL اختصاصی: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## ذخیره‌سازی فایل (MinIO)

راهنمای صفر تا صد MinIO (نسخه، Docker، env، تست، پروداکشن): [`docs/MINIO.md`](docs/MINIO.md).
