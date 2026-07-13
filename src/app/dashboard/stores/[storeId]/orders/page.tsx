import { redirect } from "next/navigation";

export default function StoreOrdersRedirect() {
  redirect("/dashboard/orders");
}
