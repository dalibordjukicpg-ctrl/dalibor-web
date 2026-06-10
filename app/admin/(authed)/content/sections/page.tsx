import { redirect } from "next/navigation";

import { adminPath } from "@/lib/admin-base-path";

export default function LegacySectionsRedirectPage() {
  redirect(adminPath("content/home"));
}
