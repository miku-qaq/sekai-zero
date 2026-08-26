import type { Metadata } from "next";
import { animeCatalog, animeCatalogMeta } from "@/content/anime";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import { AnimeCatalog } from "./anime-catalog";
import styles from "./anime.module.css";

type CatalogEntryView = {
  year?: number | string | null;
  format?: string | null;
};

type CatalogMetaView = Record<string, unknown>;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "动画收藏馆",
  description:
    "Mikureina 的 89 部已看动画收藏：可以按正式作品名搜索，也可以按作品类型与年份筛选；只记录观看，不做评分排行。",
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

const formatCount = new Set(
  catalogEntries
    .map((entry) => entry.format?.trim())
    .filter((format): format is string => Boolean(format)),
).size;

const yearSpan =
  years.length === 0
    ? "待补充"
    : years[0] === years.at(-1)
      ? years[0]
      : `${years.at(-1)}—${years[0]}`;

const archiveLead =
  metaText("description", "summary", "note") ??
  "这是我的已看动画收藏。可以按正式作品名、类型和年份寻找作品；这里只记录看过的作品，不用分数替喜好排队。";

export default function AnimePage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.animePage}`}>
      <PageMasthead
        currentHref="/anime/"
        title="看过的故事，也组成了我的世界。"
        lead={archiveLead}
        meta={[
          {
            label: "已看收藏",
            value: `${String(animeCatalog.length).padStart(2, "0")} 部`,
          },
          {
            label: "年份跨度",
            value: yearSpan,
          },
          {
            label: "记录方式",
            value: "已看 / 不评分",
          },
        ]}
      />

      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="anime-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / WATCHED ANIME ARCHIVE</p>
            <h2 id="anime-archive-title">从封面里找回一段故事。</h2>
          </div>
          <p>
            这里不是榜单。搜索正式作品名，也可以用类型与年份缩小范围；“已看”
            只表示观看记录，不代表评分。
          </p>
        </div>

        <dl className={styles.archiveStats} aria-label="动画收藏统计">
          <div>
            <dt>WATCHED</dt>
            <dd>{String(animeCatalog.length).padStart(2, "0")}</dd>
            <span>已看条目</span>
          </div>
          <div>
            <dt>FORMATS</dt>
            <dd>{String(formatCount).padStart(2, "0")}</dd>
            <span>作品类型</span>
          </div>
          <div>
            <dt>YEARS</dt>
            <dd>{new Set(years).size.toString().padStart(2, "0")}</dd>
            <span>收录年份</span>
          </div>
          <div>
            <dt>LAST UPDATED</dt>
            <dd className={styles.updatedAt}>
              {metaText("updatedAt", "lastUpdated") ?? "持续补充"}
            </dd>
            <span>收藏状态</span>
          </div>
        </dl>

        <AnimeCatalog />

        <aside className={styles.sourceNotice} aria-label="动画资料与封面来源说明">
          <div>
            <span>IMAGE &amp; DATA CREDIT</span>
            <strong>{metaText("sourceLabel")}</strong>
          </div>
          <p>{metaText("rightsNote")}</p>
          <a href={metaText("sourceUrl")} target="_blank" rel="noreferrer">
            查看 Bangumi
            <span aria-hidden="true">↗</span>
            <span className="sr-only">（将在新标签页打开）</span>
          </a>
        </aside>
      </section>

      <JourneyNavigation currentHref="/anime/" />
      <SiteFooter />
    </main>
  );
}
