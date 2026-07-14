# @tix-theme/shalom

تم خارجی برای پلتفرم مارتی — جن‌زی، رنگارنگ، با فونت Rubik.

## نصب در پروژه مارتی

```json
{
  "dependencies": {
    "@tix-theme/shalom": "file:./shalom"
  }
}
```

یا از GitHub:

```json
{
  "dependencies": {
    "@tix-theme/shalom": "github:YOUR_USER/tix-theme-shalom"
  }
}
```

سپس در `themes.config.ts` ثبت کنید و در `next.config.ts` به `transpilePackages` اضافه کنید.

## ساختار

```
shalom/
  package.json
  src/
    index.ts       # ThemePackage export
    layout.tsx     # Layout component
    sections/      # hero, product-grid, footer
```

## قرارداد تم

هر تم باید `ThemePackage` از `@tix/theme-sdk` export کند:

- `definition` — metadata، tokens، sections
- `Layout` — کامپوننت layout اصلی
- `sections` — map از section type به component
