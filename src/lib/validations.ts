import { z } from "zod";
import { isRegisteredTheme } from "@/lib/themes/registry";

export const createStoreSchema = z.object({
  name: z.string().min(2, "نام فروشگاه باید حداقل ۲ کاراکتر باشد"),
  slug: z
    .string()
    .min(3, "آدرس فروشگاه باید حداقل ۳ کاراکتر باشد")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است"),
});

export const updateStoreSchema = createStoreSchema.partial();

export const updateStoreThemeSchema = z.object({
  themeId: z.string().refine(isRegisteredTheme, "تم انتخاب‌شده معتبر نیست").optional(),
  settings: z
    .object({
      tokens: z
        .object({
          colors: z
            .object({
              primary: z.string().optional(),
              secondary: z.string().optional(),
              background: z.string().optional(),
              foreground: z.string().optional(),
              muted: z.string().optional(),
              accent: z.string().optional(),
            })
            .optional(),
          fonts: z
            .object({
              display: z.string().optional(),
              body: z.string().optional(),
            })
            .optional(),
          radius: z.string().optional(),
        })
        .optional(),
      logo: z.string().optional(),
      heroTitle: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroImage: z.string().optional(),
    })
    .optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(2, "عنوان محصول الزامی است"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است"),
  description: z.string().optional(),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "نام گیرنده الزامی است"),
  customerPhone: z.string().min(10, "شماره تماس معتبر نیست"),
  customerAddress: z.string().min(5, "آدرس الزامی است"),
  gatewaySlug: z.string().min(1, "درگاه پرداخت را انتخاب کنید"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
});

export const storeGatewaySchema = z.object({
  gatewayId: z.string(),
  isEnabled: z.boolean(),
  merchantId: z.string().optional(),
});

export const gatewayAdminSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});
