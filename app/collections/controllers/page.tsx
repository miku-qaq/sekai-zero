import type { Metadata } from "next";
import { controllerCollection } from "@/content/controllers";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionNavigation } from "../collection-navigation";
import { ControllerCatalog } from "./controller-catalog";
import styles from "./controllers.module.css";

export const dynamic = "force-static";
const description =
  "Mikureina 的手柄收藏：Xbox 碳黑款、Nintendo Switch Pro、Switch 2 Pro 与飞智八爪鱼 4 八重神子联名版。";
export const metadata: Metadata = {
  title: "手柄收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/controllers/") },
  openGraph: { title: "手柄收藏 · 奇妙收藏馆", description },
  twitter: { title: "手柄收藏 · 奇妙收藏馆", description },
};

export default function CollectionsControllersPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.controllerPage}`}>
      <PageMasthead
        currentHref="/collections/"
        subpageLabel="手柄收藏"
        animate={false}
        title="把冒险，握在手里。"
        lead="从 Xbox 的碳黑，到两代 Switch Pro，再到八重神子的樱粉。游戏之外，也收藏通往那些世界的手柄。"
        meta={[
          {
            label: "收藏手柄",
            value: `${String(controllerCollection.length).padStart(2, "0")} 只`,
          },
          {
            label: "品牌",
            value: `${String(new Set(controllerCollection.map((entry) => entry.brand)).size).padStart(2, "0")} 个`,
          },
          {
            label: "角色联名",
            value: `${String(controllerCollection.filter((entry) => entry.collaboration).length).padStart(2, "0")} 款`,
          },
        ]}
      />
      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="controller-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 05 / CONTROLLER COLLECTION</p>
            <h2 id="controller-archive-title">不同的手感，同一份喜欢。</h2>
          </div>
          <p>日常款与角色联名，一起留在这个小小展柜里。点击图片可以放大查看。</p>
        </div>
        <CollectionNavigation current="controllers" />
        <p className={styles.imageNote}>商品展示图 · 非本人实拍</p>
        <ControllerCatalog />
        <aside className={styles.sourceNote} aria-label="手柄图片来源说明">
          <span>COLLECTION NOTE / CONTROLLERS</span>
          <p>
            Xbox 与 Nintendo 图片来自官方商品页；八重神子联名款使用 WHOTAO
            商品资料图。每张卡片保留来源入口，图片与商品设计版权归各自权利方。
          </p>
        </aside>
      </section>
      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
