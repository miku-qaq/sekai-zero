import type { Metadata } from "next";
import { animeCatalog, animeCatalogMeta } from "@/content/anime";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { AnimeCatalog } from "../anime-catalog";
import styles from "../anime.module.css";
import { CollectionCredit } from "../collection-credit";
import { CollectionNavigation } from "../collection-navigation";

type CatalogEntryView = {
  year?: number | string | null;
};

type CatalogMetaView = Record<string, unknown>;

export const dynamic = "force-static";

const description =
  "奇妙收藏馆的动画展柜：收录 Mikureina 的 89 部已看动画，可以按正式作品名、类型与年份筛选。";

export const metadata: Metadata = {
  title: "动画收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/anime/") },
  openGraph: { title: "动画收藏 · 奇妙收藏馆", description },
  twitter: { title: "动画收藏 · 奇妙收藏馆", description },
};

const catalogEntries = animeCatalog as readonly CatalogEntryView[];
const catalogMeta = animeCatalogMeta as unknown as CatalogMetaView;

function metaText(...keys: string[]) {
  for (const key of keys) {
    const value = catalogMeta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizedYear(value: CatalogEntryView["year"]) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}

const years = catalogEntries
  .map((entry) => normalizedYear(entry.year))
  .filter((year): year is string => Boolean(year))
  .sort((left, right) =>
    right.localeCompare(left, "zh-CN", { numeric: true, sensitivity: "base" }),
  );

const yearSpan =
  years.length === 0
    ? "待补充"
    : years[0] === years.at(-1)
      ? years[0]
      : `${years.at(-1)}—${years[0]}`;

const archiveLead =
  metaText("description", "summary", "note") ??
  "我的已看动画清单。只记录喜欢，不做评分。";

export default function CollectionsAnimePage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.animePage}`}>
      <PageMasthead
        currentHref="/collections/"
        animate={false}
        subpageLabel="动画展柜"
        title="看过的故事，也组成了我的世界。"
        lead={archiveLead}
        meta={[
          {
            label: "已看收藏",
            value: `${String(animeCatalog.length).padStart(2, "0")} 部`,
          },
          { label: "年份跨度", value: yearSpan },
          { label: "记录方式", value: "已看 / 不评分" },
        ]}
      />

      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="anime-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 01 / WATCHED ANIME</p>
            <h2 id="anime-archive-title">已看动画</h2>
          </div>
        </div>

        <CollectionNavigation current="anime" />
        <AnimeCatalog />

        <CollectionCredit label="动画资料与封面来源" source="Bangumi">
          <p>{metaText("sourceLabel")}</p>
          <p>{metaText("rightsNote")}</p>
          <a href={metaText("sourceUrl")} target="_blank" rel="noreferrer">
            查看 Bangumi<span className="sr-only">（将在新标签页打开）</span>
          </a>
        </CollectionCredit>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
