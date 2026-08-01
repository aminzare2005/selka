import { authClient } from "@/lib/auth-client";
import { toE164IranMobile } from "@/lib/phone";

/**
 * Phone + password sign-in. Pass UI (`09…`) or E.164 (`+98…`).
 * OTP passwordless can later call `authClient.phoneNumber.sendOtp` / `verify`
 * instead of (or as an alternative to) this path.
 */
export async function signInWithPhone(phoneInput: string, password: string) {
  const phoneNumber = toE164IranMobile(phoneInput);
  if (!phoneNumber) {
    return { error: { message: "شماره موبایل معتبر نیست" }, data: null };
  }

  return authClient.signIn.phoneNumber({
    phoneNumber,
    password,
  });
}

/**
 * Register with phone + password. Creates the user then signs in.
 * Internal email is generated server-side — never shown in UI.
 */
export async function registerWithPhone(input: {
  name: string;
  phone: string;
  password: string;
}) {
  const res = await fetch("/api/auth/phone-register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    return { error: { message: json.error ?? "خطا در ثبت‌نام" }, data: null };
  }

  return signInWithPhone(input.phone, input.password);
}

/**
 * Future OTP entry points — keep call sites using these wrappers.
 * Wire SMS in `src/lib/auth.ts` → `phoneNumber({ sendOTP })`.
 */
export async function sendPhoneOtp(phoneInput: string) {
  const phoneNumber = toE164IranMobile(phoneInput);
  if (!phoneNumber) {
    return { error: { message: "شماره موبایل معتبر نیست" }, data: null };
  }
  return authClient.phoneNumber.sendOtp({ phoneNumber });
}

export async function verifyPhoneOtp(phoneInput: string, code: string) {
  const phoneNumber = toE164IranMobile(phoneInput);
  if (!phoneNumber) {
    return { error: { message: "شماره موبایل معتبر نیست" }, data: null };
  }
  return authClient.phoneNumber.verify({ phoneNumber, code });
}
