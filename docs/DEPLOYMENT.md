# دیپلوی پروداکشن — Vercel + PostgreSQL اختصاصی

این راهنما برای دیپلوی **سلکا** روی **Vercel** با یک **دیتابیس PostgreSQL خودت** (Neon، Supabase، RDS، Hetzner، DigitalOcean، یا هر Postgres مدیریت‌شده) نوشته شده.

فرض‌ها:

- ریپو روی GitHub/GitLab/Bitbucket است
- دامنهٔ نهایی مثلاً `https://selka.ir` (یا ساب‌دامین Vercel)
- دیتابیس خارج از Vercel است و با connection string در دسترس است

---

## ۱) پیش‌نیازها

| مورد | توضیح |
|------|--------|
| Node 20+ | روی Vercel به‌صورت پیش‌فرض OK است |
| حساب Vercel | و اتصال ریپو |
| PostgreSQL آماده | با دسترسی از اینترنت (IP allowlist یا public + SSL) |
| دامنه (اختیاری) | برای cookie/auth درست، دامنهٔ ثابت بهتر از `*.vercel.app` است |

### محدودیت مهم همین کدبیس

1. **آپلود فایل روی Vercel با `STORAGE_DRIVER=local` پایدار نیست.**  
   برای پروداکشن از MinIO استفاده کن: راهنمای کامل [`docs/MINIO.md`](MINIO.md).

2. **پوشهٔ `prisma/migrations` فعلاً خالی است.**  
   قبل از اولین دیپلوی باید یک migration اولیه بسازی (بخش ۳). بدون آن `prisma migrate deploy` چیزی برای اعمال ندارد.

---

## ۲) آماده‌سازی دیتابیس PostgreSQL

روی پنل دیتابیس‌ات:

1. یک database بساز (مثلاً `selka`)
2. یک user با پسورد قوی
3. SSL را روشن نگه دار (تقریباً همهٔ سرویس‌های ابری SSL می‌خواهند)
4. اگر IP allowlist داری، یا همه را موقتاً باز کن یا IPهای egress Vercel را اضافه کن (Vercel IP ثابت ندارد؛ معمولاً `0.0.0.0/0` + SSL + پسورد قوی)

### فرمت `DATABASE_URL`

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public&sslmode=require
```

نکته‌ها:

- کاراکترهای خاص در پسورد را URL-encode کن (`@` → `%40` و غیره)
- برای serverless، اگر providerت **connection pooler** دارد (مثلاً Neon pooler، PgBouncer، Supabase pooler) برای runtime از همان URL استفاده کن
- اگر provider دو URL می‌دهد:
  - **Pooled** → برای اپ روی Vercel (`DATABASE_URL`)
  - **Direct** → برای migrate از ماشین محلی یا CI (`DIRECT_URL` — فعلاً در کد اجباری نیست؛ اگر migrate از pooler خطا داد، migrate را با URL مستقیم بزن)

مثال (ساختگی):

```env
DATABASE_URL="postgresql://selka_app:Str0ngPass@db.example.com:5432/selka?schema=public&sslmode=require"
```

---

## ۳) Migration اولیه (یک‌بار قبل از پروداکشن)

روی ماشین خودت، با `.env` که به **همان دیتابیس خالی پروداکشن** یا یک DB staging شبیه آن وصل است:

```bash
# اگر هنوز migration نداری، از روی schema فعلی بساز:
npm run db:migrate -- --name init
```

این کار:

- پوشهٔ `prisma/migrations/...` را می‌سازد
- schema را روی آن دیتابیس اعمال می‌کند

سپس migrationها را **commit** کن تا Vercel در بیلد بتواند `prisma migrate deploy` بزند.

اگر فقط می‌خواهی schema را بدون تاریخچهٔ migrate روی یک DB تستی هل بدهی (فقط staging، نه روال استاندارد پروداکشن):

```bash
npm run db:push
```

برای پروداکشن ترجیح با **`migrate deploy`** است، نه `db push`.

### Seed پروداکشن

Seed را **خودکار روی Vercel نگذار**. یک‌بار دستی از لوکال/CI با `DATABASE_URL` پروداکشن:

```bash
npm run db:seed
```

بعد رمز ادمین را عوض کن. حساب‌های پیش‌فرض seed فقط برای دمو هستند.

---

## ۴) متغیرهای محیطی روی Vercel

در Project → **Settings → Environment Variables** این‌ها را برای **Production** (و در صورت نیاز Preview) ست کن:

| Key | مثال / نکته | لازم |
|-----|-------------|------|
| `DATABASE_URL` | connection string با `sslmode=require` | بله |
| `BETTER_AUTH_SECRET` | رشتهٔ تصادفی بلند (حداقل ۳۲ بایت) | بله |
| `BETTER_AUTH_URL` | `https://selka.ir` — **بدون** اسلش انتهایی | بله |
| `NEXT_PUBLIC_APP_URL` | همان دامنهٔ عمومی، مثل `https://selka.ir` | بله |
| `ENCRYPTION_KEY` | کلید ۳۲ کاراکتری پایدار؛ عوض کردنش credential درگاه‌ها را می‌شکند | بله |
| `STORAGE_DRIVER` | در پروداکشن `minio` — ببین [`MINIO.md`](MINIO.md) | بله برای آپلود |
| `MINIO_*` | وقتی driver=minio؛ جدول کامل در MINIO.md | بله با MinIO |

تولید secret:

```bash
# PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

# یا openssl
openssl rand -base64 32
```

### دامنه و Auth

`BETTER_AUTH_URL` و `NEXT_PUBLIC_APP_URL` باید **همان origin**ی باشند که کاربر در مرورگر می‌بیند:

- اگر فقط `https://selka.vercel.app` داری → همان را بگذار
- اگر دامنهٔ سفارشی وصل کردی → URL دامنهٔ سفارشی را بگذار و بعد از تغییر دامنه، env را آپدیت و Redeploy کن

در HTTPS، better-auth از کوکی `__Secure-better-auth.session_token` استفاده می‌کند؛ proxy پروژه هر دو نام را می‌خواند.

### Preview deployments

اگر Preview به همان `DATABASE_URL` پروداکشن وصل شود، migration در PR می‌تواند schema پروداکشن را عوض کند.  
بهتر است یک دیتابیس جدا برای Preview بسازی و در Vercel فقط برای محیط **Preview** یک `DATABASE_URL` دیگر ست کنی.

---

## ۵) اتصال پروژه به Vercel

### از داشبورد

1. [vercel.com/new](https://vercel.com/new) → Import ریپو
2. Framework: **Next.js** (خودکار)
3. Root Directory: ریشهٔ همین ریپو
4. Build Command را خالی بگذار تا از `package.json` استفاده شود:

   در این ریپو اسکریپت‌ها این‌طورند:

   - `postinstall` → `prisma generate`
   - `vercel-build` → `prisma generate && prisma migrate deploy && next build`

   Vercel اگر `vercel-build` را ببیند همان را اجرا می‌کند.

5. Output: پیش‌فرض Next.js (نیازی به تنظیم نیست)
6. Envها را قبل از اولین Deploy وارد کن
7. Deploy

### از CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # اختیاری؛ برای همگام‌سازی لوکال
vercel --prod
```

---

## ۶) دامنهٔ سفارشی

1. Vercel → Project → **Domains** → اضافه کردن `selka.ir`
2. DNS:
   - Apex: A/ALIAS طبق دستور Vercel، یا
   - `www` → CNAME به `cname.vercel-dns.com`
3. بعد از Active شدن SSL:
   - `BETTER_AUTH_URL=https://selka.ir`
   - `NEXT_PUBLIC_APP_URL=https://selka.ir`
4. **Redeploy** تا مقدارهای build-time/`NEXT_PUBLIC_*` درست بake شوند

---

## ۷) چک‌لیست بعد از دیپلوی

| چک | چطور |
|----|------|
| صفحهٔ لندینگ | `https://YOUR_DOMAIN/` |
| ثبت‌نام / لاگین | `/register` و `/login` |
| داشبورد | `/dashboard` بعد از لاگین |
| فروشگاه عمومی | `/@your-slug` |
| API auth | پاسخ ۲۰۰ از مسیرهای better-auth |
| DB | جدول‌ها بعد از migrate ساخته شده‌اند (`_prisma_migrations` هم باید باشد) |
| پرداخت زیبال | `NEXT_PUBLIC_APP_URL` باید به دامنهٔ واقعی اشاره کند تا callback درست redirect شود |

لاگ بیلد را در Vercel → Deployments → Building باز کن. خطاهای رایج:

| خطا | علت محتمل | کار |
|-----|-----------|-----|
| `P1001` / can't reach | فایروال DB یا host اشتباه | دسترسی شبکه / URL |
| SSL / self-signed | گواهی DB | `sslmode=require`؛ در صورت نیاز CA درست |
| `migrate deploy` خالی/fail | migration commit نشده | بخش ۳ |
| Auth / redirect عجیب | `BETTER_AUTH_URL` با دامنه یکی نیست | env + redeploy |
| آپلود خراب | filesystem Vercel | محدودیت storage؛ بخش ۱ |

---

## ۸) روال آپدیت بعدی

```text
لوکال: تغییر schema → npm run db:migrate -- --name something
      → commit فایل‌های prisma/migrations
      → push به main
Vercel: بیلد → migrate deploy روی پروداکشن → next build → publish
```

هرگز روی پروداکشن `prisma migrate dev` یا `db push` را به‌عنوان روال ثابت نزن مگر برای بازیابی اضطراری آگاهانه.

---

## ۹) امنیت و عملیات

- Secretها را فقط در Vercel Env بگذار؛ در گیت commit نکن
- `ENCRYPTION_KEY` را بعد از رفتن به پروداکشن عوض نکن مگر migration رمزنگاری داشته باشی
- حداقل یک Backup خودکار روی سرویس Postgres فعال کن
- برای ادمین بعد از seed، رمز را عوض کن یا کاربر seed را حذف کن
- درگاه زیبال: Merchant ID و callback با دامنهٔ HTTPS واقعی

### کانکشن در serverless

هر instance تابع روی Vercel ممکن است connection باز کند. روی Postgresهای کوچک:

- از **pooler** provider استفاده کن
- یا محدودیت connection را در پنل DB بالا ببر
- در صورت فشار، بعداً می‌توان `Pool({ max: 1 })` را در `src/lib/db.ts` برای محیط Vercel سخت‌گیرانه‌تر کرد

---

## ۱۰) خلاصهٔ دستورات

```bash
# یک‌بار: migration اولیه + commit
npm run db:migrate -- --name init
git add prisma/migrations
git commit -m "chore: add initial prisma migration"

# پروداکشن: seed دستی (اختیاری)
# DATABASE_URL=... npm run db:seed

# دیپلوی
git push   # اگر Production Branch به main وصل است
# یا: vercel --prod
```

Env حداقلی پروداکشن:

```env
DATABASE_URL="postgresql://USER:PASS@HOST:5432/selka?schema=public&sslmode=require"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="https://selka.ir"
NEXT_PUBLIC_APP_URL="https://selka.ir"
ENCRYPTION_KEY="..."
STORAGE_DRIVER="local"
```

---

## مرتبط

- راه‌اندازی لوکال دو سرور: [`README.md`](README.md)
- قراردادهای کد برای ایجنت‌ها: [`AGENTS.md`](AGENTS.md)
