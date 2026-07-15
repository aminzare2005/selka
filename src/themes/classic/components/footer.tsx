import type { SectionProps } from "@marty/theme-sdk";

export function ClassicFooter({ store }: SectionProps) {
  return (
    <footer className="mt-12 border-t-4 border-[var(--color-primary)] bg-[var(--color-accent)]">
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-display)" }}>
          {store.name}
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">با افتخار خدمتگزار شما از سال ۱۴۰۰</p>
        <div className="mx-auto mt-6 h-px w-24 bg-[var(--color-primary)]/40" />
        <p className="mt-4 text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} تمامی حقوق محفوظ است</p>
      </div>
    </footer>
  );
}
