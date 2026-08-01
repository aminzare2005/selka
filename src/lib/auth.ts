import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { db } from "@/lib/db";
import { isE164IranMobile, phoneToInternalEmail, toE164IranMobile } from "@/lib/phone";

/**
 * Auth is phone-first for users. better-auth still stores a hidden internal email
 * (`{digits}@phone.selka.local`) because the User model requires it.
 *
 * Current: phone + password via `signIn.phoneNumber` / `/api/auth/phone-register`.
 * Future OTP: use `authClient.phoneNumber.sendOtp` + `verify` (plugin already wired;
 * swap `sendOTP` for a real SMS provider and optionally set `requireVerification`).
 */
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    // Credential accounts (password hash) — not exposed as email login in UI.
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber: phone, code }) => {
        // TODO(otp): plug SMS provider (Kavenegar / Ghasedak / …).
        if (process.env.NODE_ENV !== "production") {
          console.info(`[auth:otp] ${phone} => ${code}`);
        }
      },
      signUpOnVerification: {
        getTempEmail: (phone) => phoneToInternalEmail(toE164IranMobile(phone) ?? phone),
        getTempName: () => "کاربر",
      },
      phoneNumberValidator: (phone) => {
        const e164 = toE164IranMobile(phone);
        return e164 !== null && isE164IranMobile(e164);
      },
      requireVerification: false,
      otpLength: 6,
      expiresIn: 300,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
