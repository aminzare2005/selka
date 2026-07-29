import {
  CreditCard,
  Images,
  Package,
  Palette,
  Settings,
  ShoppingBag,
} from "lucide-react";

/** Shared title/description/icon per dashboard route, so a page and its
 *  loading state never drift apart. */
export const dashboardPageMeta = {
  products: {
    title: "محصولات",
    description: "هر چیزی که می‌خواهی بفروشی را اینجا اضافه کن",
    icon: <Package />,
  },
  orders: {
    title: "سفارش‌ها",
    description: "هر خریدی که انجام شود همین‌جا برایت می‌آید",
    icon: <ShoppingBag />,
  },
  gallery: {
    title: "گالری",
    description: "تصویرهایت یک‌جا — آپلود کن و هر جا خواستی استفاده کن",
    icon: <Images />,
  },
  theme: {
    title: "تم",
    description: "قیافه و چیدمان فروشگاهت را انتخاب کن",
    icon: <Palette />,
  },
  gateways: {
    title: "درگاه‌های پرداخت",
    description: "درگاه را وصل کن تا مشتری‌ها بتوانند پرداخت کنند",
    icon: <CreditCard />,
  },
  settings: {
    title: "تنظیمات",
    description: "اسم، رنگ، لوگو و صفحه اصلی فروشگاهت",
    icon: <Settings />,
  },
} as const;
