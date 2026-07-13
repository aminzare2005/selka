import { redirect } from "next/navigation";

export default function StoreThemeRedirect() {
  redirect("/dashboard/theme");
}
