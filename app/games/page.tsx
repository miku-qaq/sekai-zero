import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";
import CollectionsGamesPage from "../collections/games/page";

/** Keep the former public URL readable while the collection lives in one museum. */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "游戏收藏 · 奇妙收藏馆",
  description: "游戏收藏已经并入 Mikureina 的奇妙收藏馆。",
  alternates: { canonical: absoluteSiteUrl("collections/games/") },
  robots: { index: false, follow: true },
};

export default CollectionsGamesPage;
