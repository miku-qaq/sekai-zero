import type { Metadata } from "next";
import { figureCollection, figureCollectionMeta } from "@/content/figures";
import { fufuCollection } from "@/content/fufu";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionLink } from "../collection-link";
import { CollectionNavigation } from "../collection-navigation";
import { FigureCatalog } from "./figure-catalog";
import styles from "./figures.module.css";

export const dynamic = "force-static";

const description = `奇妙收藏馆的手办展柜：${figureCollection.length} 件真实手办均已核对角色与作品出处，大 Fufu 已迁入独立分馆。`;

export const metadata: Metadata = {
  title: "手办收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/figures/") },
  openGraph: { title: "手办收藏 · 奇妙收藏馆", description },
  twitter: { title: "手办收藏 · 奇妙收藏馆", description },
};

const mikuCount = figureCollection.filter(
  (entry) => entry.character === "初音未来",
).length;
// Both catalog states guarantee character/work verification; product details
// may be promoted later without reducing this public count.
const characterConfirmedCount = figureCollection.length;
const migratedFufuCount = fufuCollection.filter((entry) =>
  entry.id.startsWith("figure-"),
).length;
const originalCollectionCount = figureCollection.length + migratedFufuCount;

export default function CollectionsFiguresPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.figurePage}`}>
      <PageMasthead
        currentHref="/collections/"
        animate={false}
        subpageLabel="手办收藏"
        title="喜欢的角色，也在现实里留下坐标。"
        lead={figureCollectionMeta.summary}
        meta={[
          {
            label: "去重记录",
            value: `${String(figureCollection.length).padStart(2, "0")} 件`,
          },
          { label: "初音未来", value: `${String(mikuCount).padStart(2, "0")} 件` },
          {
            label: "角色核对",
            value: `${characterConfirmedCount} / ${figureCollection.length}`,
          },
        ]}
      />

      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="figure-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 03 / FIGURE COLLECTION</p>
            <h2 id="figure-archive-title">十六件收藏，逐一对回它们的世界。</h2>
          </div>
          <p>
            这里按原始收藏记录编号保留每一件手办，即使大 Fufu
            已迁入另一间展柜，后续编号也不会被重新排列。
          </p>
        </div>

        <CollectionNavigation current="figures" />

        <div className={styles.auditPanel} aria-label="手办收藏档案摘要">
          <div className={styles.auditIntro}>
            <span>OWNER COLLECTION / VERIFIED</span>
            <strong>十六件手办，都有自己的收藏坐标。</strong>
            <p>
              角色与作品出处已经逐件核对；第 003 号大 Fufu
              移入专属展柜后，原始记录编号仍然保留。
            </p>
            <CollectionLink href="/collections/fufu/">
              查看迁出的第 003 号大 Fufu ↗
            </CollectionLink>
          </div>
          <div className={styles.auditStat}>
            <span>ARCHIVE RECORDS</span>
            <strong>{String(originalCollectionCount).padStart(2, "0")}</strong>
            <p>原收藏目录中的实体记录</p>
          </div>
          <div className={styles.auditStat}>
            <span>MOVED TO FUFU</span>
            <strong>{String(migratedFufuCount).padStart(2, "0")}</strong>
            <p>大 Fufu 保留原编号迁出</p>
          </div>
          <div className={styles.auditStat}>
            <span>FIGURES HERE</span>
            <strong>{String(figureCollection.length).padStart(2, "0")}</strong>
            <p>角色与作品出处均已核对</p>
          </div>
        </div>

        <FigureCatalog />

        <aside className={styles.sourcePanel} aria-label="手办收藏资料说明">
          <div>
            <span>COLLECTION NOTE / VERIFIED SCOPE</span>
            <strong>{figureCollectionMeta.sourceLabel}</strong>
          </div>
          <p>{figureCollectionMeta.rightsNote}</p>
          <b>正式商品资料与本人实拍待补充</b>
        </aside>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
