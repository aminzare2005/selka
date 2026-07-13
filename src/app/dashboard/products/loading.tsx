import { ProductListSkeleton } from "@/components/ui/dashboard-skeletons";
import { PageHeader } from "@/components/ui/page-header";

export default function ProductsLoading() {
  return (
    <>
      <PageHeader title="محصولات" description="افزودن، ویرایش و حذف محصولات فروشگاه" />
      <div className="mt-6">
        <ProductListSkeleton />
      </div>
    </>
  );
}
