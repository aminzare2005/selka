import { redirect } from "next/navigation";

export default function StoreProductsRedirect() {
  redirect("/dashboard/products");
}
