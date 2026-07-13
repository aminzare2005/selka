import { redirect } from "next/navigation";

export default function StoreGatewaysRedirect() {
  redirect("/dashboard/gateways");
}
