import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api";
import { getStorage } from "@/lib/storage";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const session = await getSession();
  if (!session) return apiError("لطفاً وارد شوید", 401);

  const { mediaId } = await params;

  const media = await db.media.findUnique({ where: { id: mediaId } });
  if (!media) return apiError("فایل یافت نشد", 404);
  if (media.userId !== session.user.id) return apiError("دسترسی غیرمجاز", 403);

  const storage = getStorage();
  await storage.delete(media.url);
  await db.media.delete({ where: { id: mediaId } });

  return apiSuccess({ success: true });
}
