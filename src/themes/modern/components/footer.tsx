import type { SectionProps } from "@tix/theme-sdk";

export function ModernFooter({ store }: SectionProps) {
  return (
    <footer className="border-t border-[var(--color-muted)]/10 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[var(--color-muted)]">
        © {new Date().getFullYear()} {store.name}
      </div>
    </footer>
  );
}
