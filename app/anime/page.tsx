import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";
import CollectionsAnimePage from "../collections/anime/page";

/** Keep the former public URL readable while the collection lives in one museum. */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "动画收藏 · 奇妙收藏馆",
  description: "动画收藏已经并入 Mikureina 的奇妙收藏馆。",
  alternates: { canonical: absoluteSiteUrl("collections/anime/") },
  robots: { index: false, follow: true },
};

export default CollectionsAnimePage;
