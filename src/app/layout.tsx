import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Rubik } from "next/font/google";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "تیکس — پلتفرم فروشگاه‌ساز",
  description: "فروشگاه آنلاین خود را بسازید و بفروشید",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${rubik.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ "--font-rubik": "var(--font-vazirmatn)" } as React.CSSProperties}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
