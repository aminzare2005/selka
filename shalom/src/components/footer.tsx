import type { SectionProps } from "@marty/theme-sdk";

export function ShalomFooter({ store }: SectionProps) {
  return (
    <footer className="relative overflow-hidden bg-[#18181b] py-12">
      <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-[#a855f7]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-[#4ade80]/20 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p
          className="text-2xl font-black text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {store.name} 💜
        </p>
        <p className="mt-2 text-[#a1a1aa]">همینجا بمون، قراره چیزای خفن بیاد</p>
        <div className="mt-6 flex justify-center gap-3 text-2xl">
          <span>✨</span>
          <span>🔥</span>
          <span>💫</span>
        </div>
        <p className="mt-6 text-xs text-[#71717a]">ساخته‌شده با عشق — مارتی</p>
      </div>
    </footer>
  );
}
