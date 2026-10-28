import type { Metadata } from "next";
import { controllerCollection } from "@/content/controllers";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionCredit } from "../collection-credit";
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
        lead="从 Xbox 的碳黑，到八重神子的樱粉，都是喜欢的手感。"
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
            <h2 id="controller-archive-title">手柄图鉴</h2>
          </div>
          <p>点击图片查看大图。</p>
        </div>
        <CollectionNavigation current="controllers" />
        <ControllerCatalog />
        <CollectionCredit label="手柄图片与商品资料" source="Xbox · Nintendo · WHOTAO">
          <p>每件收藏保留对应的商品资料入口，图片与商品设计版权归各自权利方。</p>
        </CollectionCredit>
      </section>
      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
