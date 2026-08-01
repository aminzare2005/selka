"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { IR_MOBILE_UI_MAX_LENGTH, normalizePhoneDigits, toUiIranMobile } from "@/lib/phone";
import { cn } from "@/lib/utils";

export type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "inputMode" | "maxLength" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** When true, formats incoming controlled values from E.164 → 09… */
  normalizeValue?: boolean;
};

function sanitizeUiPhone(raw: string): string {
  let digits = normalizePhoneDigits(raw).slice(0, IR_MOBILE_UI_MAX_LENGTH);
  // Prefer leading 0 for UX when user starts typing 9…
  if (digits.length > 0 && !digits.startsWith("0") && digits.startsWith("9")) {
    digits = `0${digits}`.slice(0, IR_MOBILE_UI_MAX_LENGTH);
  }
  return digits;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      normalizeValue = true,
      name = "phone",
      placeholder = "09123456789",
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(() =>
      sanitizeUiPhone(defaultValue ? (normalizeValue ? toUiIranMobile(defaultValue) : defaultValue) : ""),
    );

    const display = isControlled
      ? sanitizeUiPhone(normalizeValue ? toUiIranMobile(value) : value)
      : internal;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const next = sanitizeUiPhone(e.target.value);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    }

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        dir="ltr"
        name={name}
        maxLength={IR_MOBILE_UI_MAX_LENGTH}
        placeholder={placeholder}
        className={cn(className)}
        value={display}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
