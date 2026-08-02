import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SelkaBrandMark } from "@/components/layout/selka-brand-mark";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <SelkaBrandMark />
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">ورود</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">شروع رایگان</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
