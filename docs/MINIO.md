# MinIO — راهنمای صفر تا صد (لوکال تا پروداکشن)

این سند همه‌چیز را پوشش می‌دهد: نسخه، نصب سرور، باکت، اتصال به سلکا، تست، و پروداکشن روی Vercel.

کد اپ از مسیر `src/lib/storage/` استفاده می‌کند:

| `STORAGE_DRIVER` | Adapter | فایل |
|------------------|---------|------|
| `local` (پیش‌فرض) | دیسک `public/uploads` | `local.ts` |
| `minio` | S3-compatible MinIO | `minio.ts` |

API مصرف‌کننده: `POST/GET /api/media` و `DELETE /api/media/[mediaId]`.

---

## ۱) نسخه‌ها (همین الان قفل کن)

| قطعه | نسخهٔ توصیه‌شده | چرا |
|------|------------------|-----|
| **MinIO Server** | image تگ‌شده مثل `minio/minio:RELEASE.2025-04-22T22-12-26Z` | هرگز در پروداکشن `latest` نگذار |
| **MinIO Client CLI (`mc`)** | همگام با سرور؛ از [min.io/download](https://min.io/download) | برای policy و دیباگ |
| **Node SDK** | `minio@8.x` (در این ریپو نصب است) | API رسمی `Client` / `putObject` |
| **Docker Compose** | Compose v2 (`docker compose`) | فایل: `docker-compose.minio.yml` |
| **Node** | 20+ | هم‌تراز با بقیهٔ پروژه |

اگر image بالا در Docker Hub نبود، از [تگ‌های رسمی](https://hub.docker.com/r/minio/minio/tags) یک `RELEASE.YYYY-…` نزدیک انتخاب کن و همان را در compose پین کن.

---

## ۲) مفاهیم سریع

- **API port `9000`**: پروتکل S3 (اپ و SDK به این وصل می‌شوند)
- **Console port `9001`**: UI وب برای دیدن باکت‌ها
- **Bucket**: مثل پوشهٔ ریشه؛ سلکا پیش‌فرض `selka`
- **Object key**: مسیر داخل باکت، مثلاً `stores/{id}/branding/uuid.jpg`
- **Public URL**: آدرسی که مرورگر برای `<img src>` می‌زند  
  پیش‌فرض path-style: `http://HOST:9000/selka/stores/.../file.jpg`

اپ روی اولین آپلود:

1. باکت را اگر نباشد می‌سازد
2. سعی می‌کند policy **public-read روی GetObject** بگذارد (برای ویترین)
3. فایل را `putObject` می‌کند و URL عمومی برمی‌گرداند

اگر providerت anonymous policy را نپذیرد، آپلود باز هم کار می‌کند ولی URL عمومی بدون auth باز نمی‌شود — آن وقت باید CDN/پروکسی یا signed URL طراحی کنی (خارج از scope فعلی).

---

## ۳) بالا آوردن MinIO لوکال (Docker)

از ریشهٔ ریپو:

```bash
docker compose -f docker-compose.minio.yml up -d
```

چک سلامت:

```bash
docker compose -f docker-compose.minio.yml ps
curl http://localhost:9000/minio/health/live
```

کنسول: [http://localhost:9001](http://localhost:9001)

| فیلد | مقدار پیش‌فرض compose |
|------|------------------------|
| User | `minioadmin` |
| Password | `minioadmin` |
| API | `localhost:9000` |
| Console | `localhost:9001` |

**پروداکشن:** `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` را عوض کن (حداقل ۱۲ کاراکتر، پیچیده). این‌ها root هستند؛ برای اپ بهتر است Access Key جدا بسازی (بخش ۵).

خاموش:

```bash
docker compose -f docker-compose.minio.yml down
# با پاک شدن داده:
docker compose -f docker-compose.minio.yml down -v
```

### بدون Docker (باینری)

1. باینری سرور را از سایت MinIO بگیر
2. اجرا:

```bash
mkdir -p ~/minio-data
minio server ~/minio-data --address ":9000" --console-address ":9001"
```

همان envهای root را با متغیر محیطی ست کن.

---

## ۴) اتصال سلکا (`.env`)

```env
STORAGE_DRIVER="minio"

MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="selka"

# اختیاری — اگر CDN یا reverse-proxy جلوی MinIO داری:
# MINIO_PUBLIC_URL="https://media.selka.ir/selka"
```

| متغیر | اجباری | معنی |
|--------|--------|------|
| `STORAGE_DRIVER` | بله برای MinIO | باید دقیقاً `minio` باشد |
| `MINIO_ENDPOINT` | بله | هاست بدون `http://` |
| `MINIO_PORT` | خیر | پیش‌فرض `9000` یا با SSL `443` |
| `MINIO_USE_SSL` | خیر | `true` / `false` |
| `MINIO_ACCESS_KEY` | بله | کلید دسترسی |
| `MINIO_SECRET_KEY` | بله | سکرت |
| `MINIO_BUCKET` | خیر | پیش‌فرض `selka` |
| `MINIO_PUBLIC_URL` | خیر | پایهٔ URL عمومی بدون اسلش انتها؛ اگر خالی باشد از endpoint+port+bucket ساخته می‌شود |

بعد از تغییر `.env`، **Next را ری‌استارت** کن.  
`next.config.ts` برای `images.remotePatterns` از همین envها در **زمان بیلد** می‌خواند — روی Vercel بعد از ست کردن env یک Redeploy بزن.

---

## ۵) کاربر و باکت با `mc` (اختیاری ولی درست)

نصب `mc`، بعد:

```bash
mc alias set selka http://localhost:9000 minioadmin minioadmin
mc mb --ignore-existing selka/selka
mc anonymous set download selka/selka
```

ساخت کلید جدا برای اپ (توصیه):

```bash
mc admin user svcacct add selka minioadmin --access-key "selka-app" --secret-key "CHANGE_ME_LONG_SECRET"
```

بعد در `.env` همان access/secret را بگذار؛ root را فقط برای ادمین نگه دار.

Policy دستی (معادل کاری که adapter می‌کند):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": ["*"] },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::selka/*"]
    }
  ]
}
```

```bash
mc anonymous set-json public-read.json selka/selka
```

---

## ۶) تست‌ها (به ترتیب انجام بده)

### الف) Smoke test SDK (بدون UI)

```bash
npm run storage:minio:test
```

باید ببینی: bucket exists/created → upload → read → delete → public base URL.

خطاهای رایج اینجا:

| پیام / علامت | معنی | کار |
|--------------|------|-----|
| `ECONNREFUSED` | سرور بالا نیست / پورت غلط | `docker compose … up -d` |
| `InvalidAccessKeyId` | کلید اشتباه | env و console را چک کن |
| `Access Denied` | کاربر حق makeBucket/put ندارد | با root تست کن یا policy کاربر |
| SSL errors | `USE_SSL` با واقعیت جور نیست | لوکال معمولاً `false` |

### ب) تست از داخل اپ

1. `STORAGE_DRIVER=minio` در `.env`
2. `npm run dev`
3. لاگین با فروشنده دمو
4. `/dashboard/gallery` → آپلود یک JPG/PNG/WebP (< ۵MB)
5. در Network، `POST /api/media` باید `201` و `url` کامل MinIO برگرداند
6. همان URL را در تب جدید باز کن — تصویر باید بیاید
7. حذف از گالری → object از باکت هم پاک می‌شود

### ج) تست دستی با curl روی API (بعد از سشن لاگین)

ساده‌ترین راه همان UI است؛ برای اتوماسیون cookie سشن better-auth لازم است.

### د) کنسول MinIO

در `http://localhost:9001` → Bucket `selka` → Object Browser؛ فایل‌های `stores/...` یا `general/...` را ببین.

---

## ۷) پروداکشن (کنار Vercel)

Vercel فایل را روی دیسک خودش نگه نمی‌دارد؛ **باید** `STORAGE_DRIVER=minio` باشد و MinIO (یا هر S3-compatible) روی سرور جدا بالا باشد.

### گزینه‌های میزبانی MinIO

1. **VPS خودت** (Hetzner/DO) + Docker + volume + HTTPS با Caddy/Nginx
2. **Managed S3-compatible** (Cloudflare R2، AWS S3، …) — SDK MinIO معمولاً سازگار است؛ endpoint را مطابق docs همان سرویس بگذار
3. **کلاستر MinIO** برای HA — وقتی ترافیک جدی شد

### الگوی پیشنهادی دامنه

```text
https://media.selka.ir  →  reverse proxy → MinIO :9000
```

Env پروداکشن روی Vercel:

```env
STORAGE_DRIVER=minio
MINIO_ENDPOINT=media.selka.ir
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=selka
MINIO_PUBLIC_URL=https://media.selka.ir/selka
```

نکته‌ها:

- Access Key را در Vercel فقط برای Production/Preview لازم ست کن
- باکت را از قبل بساز و public-read را عمداً ست کن (یا به ensure داخل کد اعتماد کن)
- Backup volume یا replication را روشن کن
- CORS اگر آپلود مستقیم از مرورگر به MinIO داشتی لازم می‌شد؛ **در معماری فعلی آپلود از سرور Next می‌رود** پس CORS MinIO معمولاً لازم نیست
- فایروال: پورت API فقط از اینترنت (برای public read) یا پشت CDN؛ کنسول `9001` را به اینترنت باز نکن

نمونهٔ Caddy ساده:

```caddy
media.selka.ir {
  reverse_proxy 127.0.0.1:9000
}
```

---

## ۸) مسیر کد (برای ایجنت بعدی)

```
src/lib/storage/types.ts     ← StorageAdapter
src/lib/storage/local.ts     ← دیسک لوکال
src/lib/storage/minio.ts     ← Client + ensureBucket + put/delete
src/lib/storage/index.ts     ← getStorage() بر اساس STORAGE_DRIVER
scripts/minio-smoke-test.ts  ← تست اتصال
docker-compose.minio.yml     ← سرور لوکال
```

قرارداد URL برگشتی:

- local: `/uploads/{folder}/{filename}`
- minio: `{MINIO_PUBLIC_URL یا http(s)://endpoint:port/bucket}/{folder}/{filename}`

`delete(url)` باید همان URL ذخیره‌شده در جدول `Media` را بگیرد و object را پاک کند — فرمت URL را عوض نکن مگر migration دیتا بنویسی.

---

## ۹) چک‌لیست نهایی

- [ ] MinIO با تگ پین‌شده بالا است
- [ ] `curl …/minio/health/live` سبز است
- [ ] `.env` کامل است و `STORAGE_DRIVER=minio`
- [ ] `npm run storage:minio:test` پاس شد
- [ ] آپلود از `/dashboard/gallery` کار می‌کند و URL عمومی باز می‌شود
- [ ] روی Vercel همان envها + Redeploy
- [ ] root password پیش‌فرض در پروداکشن عوض شده
- [ ] کنسول MinIO به اینترنت عمومی expose نیست

---

## ۱۰) جمع‌بندی دستورات

```bash
# سرور
docker compose -f docker-compose.minio.yml up -d

# env → STORAGE_DRIVER=minio + MINIO_*

# تست SDK
npm run storage:minio:test

# اپ
npm run dev
# بعد: گالری داشبورد
```

اگر چیزی شکست، اول smoke test را بگیر؛ اگر آن سبز بود و UI نه، مشکل در سشن/API یا `MINIO_PUBLIC_URL` است نه خود MinIO.
