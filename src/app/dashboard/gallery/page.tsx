import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { MediaGallery } from "@/components/dashboard/media-gallery";
import { PageHeader } from "@/components/ui/page-header";

export default async function GalleryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <PageHeader
        title="گالری"
        description="مدیریت تصاویر آپلودشده — از اینجا می‌توانید تصاویر را آپلود، مشاهده و حذف کنید"
      />
      <div className="mt-6">
        <MediaGallery />
      </div>
    </div>
  );
}
