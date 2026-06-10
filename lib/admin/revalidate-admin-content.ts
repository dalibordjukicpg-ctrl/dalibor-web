import { revalidatePath } from "next/cache";

import { adminPath } from "@/lib/admin-base-path";
import { ADMIN_CONTENT_REVALIDATE_PATHS } from "@/lib/admin/site-content-nav";

const PUBLIC_CONTENT_SUBPATHS = [
  "content/header",
  "content/header-footer",
  "content/hero",
  "content/home",
  "content/process",
  "content/showcase",
  "content/design3d",
  "content/about",
  "content/home-cards",
  "content/consult",
  "content/team",
  "content/blog-headings",
] as const;

/** Osvježi admin stranice sadržaja (interni /admin i javni ADMIN_BASE_PATH). */
export function revalidateAdminContentPaths(): void {
  for (const p of ADMIN_CONTENT_REVALIDATE_PATHS) {
    revalidatePath(p);
  }
  for (const sub of PUBLIC_CONTENT_SUBPATHS) {
    revalidatePath(adminPath(sub));
  }
}
