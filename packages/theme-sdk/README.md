# Theme SDK

قرارداد مشترک برای ساخت تم‌های تیکس — داخل یا خارج از ریپو اصلی.

## ThemePackage

```ts
import type { ThemePackage } from "@tix/theme-sdk";

const myTheme: ThemePackage = {
  definition: {
    id: "my-theme",
    name: "تم من",
    description: "...",
    tokens: { colors: {...}, fonts: {...}, radius: "12px" },
    defaultSections: [{ type: "hero" }, { type: "product-grid" }, { type: "footer" }],
    googleFonts: [{ family: "Rubik", weights: ["400", "700", "900"] }],
  },
  Layout: MyLayout,
  sections: {
    hero: HeroSection,
    "product-grid": ProductGridSection,
    footer: FooterSection,
  },
};

export default myTheme;
```

## ثبت تم در پروژه اصلی

1. نصب پکیج (`file:./my-theme` یا `github:user/repo`)
2. اضافه به `themes.config.ts`
3. اضافه به `transpilePackages` در `next.config.ts`

## Section types استاندارد

- `hero` — صفحه اصلی
- `product-grid` — لیست محصولات
- `footer` — فوتر

تم‌ها می‌توانند section type سفارشی هم تعریف کنند.
