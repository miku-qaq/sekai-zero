import type { Metadata } from "next";
import { figureCollection, figureCollectionMeta } from "@/content/figures";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionLink } from "../collection-link";
import { CollectionNavigation } from "../collection-navigation";
import styles from "../collections.module.css";

export const dynamic = "force-static";

const description = `奇妙收藏馆的手办展柜：整理 ${figureCollection.length} 件真实手办收藏；大 Fufu 已迁入独立分馆。`;

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
const pendingCount = figureCollection.filter(
  (entry) => entry.verification === "pending",
).length;

export default function CollectionsFiguresPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.figurePage}`}>
      <PageMasthead
        currentHref="/collections/"
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
            label: "仍待确认",
            value: `${String(pendingCount).padStart(2, "0")} 件`,
          },
        ]}
      />

      <section
        className={`${styles.figureArchive} section-shell section-pad`}
        aria-labelledby="figure-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 03 / FIGURE COLLECTION</p>
            <h2 id="figure-archive-title">每一件，都先从真实记录开始。</h2>
          </div>
          <p>
            截图可以确认收藏数量与大部分角色，但不能可靠确认厂商、比例和商品版本；大
            Fufu 已进入独立分馆，其余字段会等本人核对后再补。
          </p>
        </div>

        <CollectionNavigation current="figures" />

        <aside className={styles.figureNotice} aria-label="大 Fufu 收藏迁移说明">
          <div>
            <span>COLLECTION MOVE / FUFU</span>
            <strong>大 Fufu 已回到独立分馆</strong>
          </div>
          <p>
            原记录编号继续保留，但不再重复出现在手办清单中；生肖 Fufu
            也会在同一分馆按年份排列。
          </p>
          <CollectionLink href="/collections/fufu/">前往 Fufu 收藏 ↗</CollectionLink>
        </aside>

        <div className={styles.figureStatus} aria-label="手办收藏公开范围">
          <div>
            <span>PUBLIC / 01</span>
            <strong>角色与收藏类型</strong>
            <p>只展示当前可以稳妥确认的公开信息。</p>
          </div>
          <div>
            <span>PRIVATE / 02</span>
            <strong>价格、订单与购买平台</strong>
            <p>个人消费信息不会进入公开收藏目录。</p>
          </div>
          <div>
            <span>NEXT / 03</span>
            <strong>本人拍摄的实物照片</strong>
            <p>以后用自己的照片逐件替换视觉占位。</p>
          </div>
        </div>

        <ol
          className={styles.figureGrid}
          aria-label={`${figureCollection.length} 件手办收藏`}
        >
          {figureCollection.map((entry, index) => {
            const titleId = `${entry.id}-title`;
            const isPending = entry.verification === "pending";

            return (
              <li key={entry.id}>
                <article
                  className={styles.figureCard}
                  data-tone={entry.tone}
                  data-pending={isPending || undefined}
                  aria-labelledby={titleId}
                >
                  <div className={styles.figureVisual} aria-hidden="true">
                    <span>FIG / {String(index + 1).padStart(3, "0")}</span>
                    <strong>{entry.motif}</strong>
                    <i>{entry.format}</i>
                  </div>
                  <div className={styles.figureBody}>
                    <p>{isPending ? "NEEDS CONFIRMATION" : "CHARACTER CONFIRMED"}</p>
                    <h3 id={titleId}>{entry.character}</h3>
                    <span>
                      {isPending
                        ? "角色与具体商品资料待本人确认。"
                        : "具体商品名、厂商、比例与系列待核对。"}
                    </span>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <aside className={styles.figureNotice} aria-label="手办收藏资料边界说明">
          <div>
            <span>OWNER RECORD / RIGHTS NOTICE</span>
            <strong>{figureCollectionMeta.sourceLabel}</strong>
          </div>
          <p>{figureCollectionMeta.rightsNote}</p>
          <b>实物照片待补充</b>
        </aside>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
