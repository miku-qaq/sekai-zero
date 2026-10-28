import type { Metadata } from "next";
import { figureCollection, figureCollectionMeta } from "@/content/figures";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionLink } from "../collection-link";
import { CollectionCredit } from "../collection-credit";
import { CollectionNavigation } from "../collection-navigation";
import { FigureCatalog } from "./figure-catalog";
import styles from "./figures.module.css";

export const dynamic = "force-static";

const description = `奇妙收藏馆的手办展柜：${figureCollection.length} 件手办均已匹配商品图与款式资料，支持角色、作品与厂商搜索。`;

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
const productConfirmedCount = figureCollection.filter(
  (entry) => entry.verification === "product-confirmed" && entry.product.image,
).length;

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
            label: "展柜收藏",
            value: `${String(figureCollection.length).padStart(2, "0")} 件`,
          },
          { label: "初音未来", value: `${String(mikuCount).padStart(2, "0")} 件` },
          {
            label: "款式配图",
            value: `${productConfirmedCount} / ${figureCollection.length}`,
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
            <h2 id="figure-archive-title">手办图鉴</h2>
          </div>
        </div>

        <CollectionNavigation current="figures" />

        <div className={styles.galleryNote}>
          <p>
            <span aria-hidden="true">◇</span> 商品展示图 · 非本人实拍
          </p>
          <CollectionLink href="/collections/fufu/">
            毛绒伙伴在 Fufu 展柜
          </CollectionLink>
        </div>

        <FigureCatalog />

        <CollectionCredit label="手办图片与款式资料" source="商品展示图 · 非本人实拍">
          <p>{figureCollectionMeta.rightsNote}</p>
        </CollectionCredit>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
