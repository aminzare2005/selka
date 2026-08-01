import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { iranMobileE164Schema, phoneToInternalEmail } from "@/lib/phone";

const bodySchema = z.object({
  name: z.string().min(2, "نام الزامی است"),
  phone: iranMobileE164Schema,
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

/**
 * Phone-first registration. better-auth credentials still use an internal email;
 * the public identifier is `phoneNumber` (E.164).
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "داده نامعتبر", 400);
  }

  const { name, phone: e164, password } = parsed.data;
  const email = phoneToInternalEmail(e164);

  const existingPhone = await db.user.findFirst({ where: { phoneNumber: e164 } });
  if (existingPhone) {
    return apiError("این شماره قبلاً ثبت شده است", 409);
  }

  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) {
    return apiError("این شماره قبلاً ثبت شده است", 409);
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطا در ثبت‌نام";
    return apiError(message, 400);
  }

  await db.user.update({
    where: { email },
    data: {
      phoneNumber: e164,
      phoneNumberVerified: true,
    },
  });

  return apiSuccess({ ok: true }, 201);
}
