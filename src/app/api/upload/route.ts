import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { getStorage } from "@/lib/storage";
import { randomUUID } from "crypto";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) ?? "general";

  if (!file) return apiError("فایل الزامی است", 400);
  if (!file.type.startsWith("image/")) return apiError("فقط تصویر مجاز است", 400);
  if (file.size > 5 * 1024 * 1024) return apiError("حداکثر حجم ۵ مگابایت", 400);

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const storage = getStorage();
  const result = await storage.upload(buffer, filename, folder);

  return apiSuccess(result, 201);
}
