import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";
import LogsPage from "../logs/page";

/**
 * `/projects/` used to be a public navigation destination. Keep the static URL
 * readable for old bookmarks while making `/logs/` the single canonical home
 * for project decisions and release history.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "世界线日志",
  description: "SEKAI / 00 的制作记录已经并入世界线日志。",
  alternates: { canonical: absoluteSiteUrl("logs/") },
  robots: { index: false, follow: true },
};

export default function ProjectsCompatibilityPage() {
  return <LogsPage />;
}
