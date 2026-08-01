import { z } from "zod";

/** UI entry length for Iranian mobiles: 09XXXXXXXXX */
export const IR_MOBILE_UI_MAX_LENGTH = 11;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Strip separators and map Persian/Arabic digits → Latin. */
export function normalizePhoneDigits(input: string): string {
  return Array.from(input)
    .map((ch) => {
      const p = PERSIAN_DIGITS.indexOf(ch);
      if (p >= 0) return String(p);
      const a = ARABIC_DIGITS.indexOf(ch);
      if (a >= 0) return String(a);
      return ch;
    })
    .join("")
    .replace(/\D/g, "");
}

/**
 * Normalize any common Iran mobile form to E.164 (`+989XXXXXXXXX`).
 * Accepts: 09…, 9…, +98…, 0098…, 98…
 */
export function toE164IranMobile(input: string): string | null {
  let digits = normalizePhoneDigits(input);
  if (!digits) return null;

  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  // National mobile without country: 9XXXXXXXXX (10 digits)
  if (digits.length !== 10 || !digits.startsWith("9")) return null;

  return `+98${digits}`;
}

/** Format stored E.164 (or loose input) for Iranian UI: `09XXXXXXXXX`. */
export function toUiIranMobile(input: string | null | undefined): string {
  if (!input) return "";
  const e164 = toE164IranMobile(input);
  if (!e164) return normalizePhoneDigits(input).slice(0, IR_MOBILE_UI_MAX_LENGTH);
  return `0${e164.slice(3)}`;
}

/** better-auth still requires an email column — never shown in UI. */
export function phoneToInternalEmail(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return `${digits}@phone.selka.local`;
}

export function isE164IranMobile(input: string): boolean {
  return /^\+989\d{9}$/.test(input);
}

/** Zod field: accepts UI or E.164, outputs E.164 for DB. */
export const iranMobileE164Schema = z
  .string({ error: "شماره تماس الزامی است" })
  .min(1, "شماره تماس الزامی است")
  .transform((val, ctx) => {
    const e164 = toE164IranMobile(val);
    if (!e164) {
      ctx.addIssue({
        code: "custom",
        message: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)",
      });
      return z.NEVER;
    }
    return e164;
  });
