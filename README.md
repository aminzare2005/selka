# تیکس (Tix) — پلتفرم فروشگاه‌ساز مولتی‌تننت

پلتفرم فروشگاهی فارسی با Next.js 16، PostgreSQL، Prisma، Better Auth و سیستم تم.

## پیش‌نیازها

- Node.js 20+
- PostgreSQL

## راه‌اندازی

1. کپی env:
```bash
cp .env.example .env
```

2. تنظیم `DATABASE_URL` در `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tix?schema=public"
BETTER_AUTH_SECRET="یک-رشته-تصادفی-طولانی"
BETTER_AUTH_URL="http://localhost:3000"
ENCRYPTION_KEY="کلید-۳۲-کاراکتری-برای-رمزنگاری"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. نصب و migrate:
```bash
npm install
npm run db:push
npm run db:seed
```

4. اجرا:
```bash
npm run dev
```

## حساب‌های نمونه (بعد از seed)

| نقش | ایمیل | رمز |
|-----|-------|-----|
| ادمین پلتفرم | admin@tix.ir | admin123 |
| فروشنده نمونه | demo@tix.ir | demo123 |

## مسیرها

- `/` — لندینگ پلتفرم
- `/login`, `/register` — احراز هویت
- `/dashboard` — پنل صاحب فروشگاه
- `/admin` — پنل ادمین پلتفرم
- `/s/[slug]` — ویترین فروشگاه
- `/s/[slug]/products/[slug]` — صفحه محصول
- `/s/[slug]/cart` — سبد خرید
- `/s/[slug]/checkout` — پرداخت

## فروشگاه نمونه

بعد از seed: [http://localhost:3000/s/demo-shop](http://localhost:3000/s/demo-shop)

## تم‌ها

سه تم فعال: `modern`، `classic` (داخلی) و `shalom` (خارجی).

### معماری تم

```
packages/theme-sdk/     ← قرارداد مشترک (ThemePackage)
themes.config.ts        ← رجیستری تم‌ها
src/themes/             ← تم‌های داخلی
shalom/                 ← تم خارجی نمونه (قابل انتقال به GitHub)
```

هر تم یک `ThemePackage` export می‌کند:
- `definition` — metadata، رنگ‌ها، فونت‌ها، sections
- `Layout` — کامپوننت layout
- `sections` — hero، product-grid، footer

### افزودن تم خارجی

1. پکیج تم را بسازید (نمونه: [`shalom/`](shalom/))
2. در `package.json` نصب کنید:
   ```json
   "@tix-theme/my-theme": "file:./my-theme"
   ```
   یا از GitHub:
   ```json
   "@tix-theme/my-theme": "github:USER/tix-theme-my-theme"
   ```
3. در [`themes.config.ts`](themes.config.ts) ثبت کنید
4. در [`next.config.ts`](next.config.ts) به `transpilePackages` اضافه کنید

فونت‌های Google را در `definition.googleFonts` تعریف کنید — خودکار لود می‌شوند.

## پرداخت

درگاه زیبال با adapter pattern. ادمین پلتفرم درگاه را فعال می‌کند؛ صاحب فروشگاه Merchant ID خود را وارد می‌کند.

## اسکریپت‌ها

```bash
npm run dev          # توسعه
npm run build        # بیلد
npm run db:push      # اعمال schema
npm run db:seed      # داده نمونه
npm run db:studio    # Prisma Studio
```
