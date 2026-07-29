import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { MediaGallery } from "@/components/dashboard/media-gallery";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardPageMeta } from "@/components/layout/dashboard-page-meta";

export default async function GalleryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <PageHeader {...dashboardPageMeta.gallery} />
      <div className="mt-6">
        <MediaGallery />
      </div>
    </div>
  );
}
