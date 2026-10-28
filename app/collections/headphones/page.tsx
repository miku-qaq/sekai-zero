import type { Metadata } from "next";
import { headphoneCollection } from "@/content/headphones";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionCredit } from "../collection-credit";
import { CollectionLink } from "../collection-link";
import { CollectionNavigation } from "../collection-navigation";
import { HeadphoneCatalog } from "./headphone-catalog";
import styles from "../devices/devices.module.css";

export const dynamic = "force-static";

const description = "Mikureina 的耳机收藏：Sony 与 Apple，陪伴日常的声音。";

export const metadata: Metadata = {
  title: "耳机收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/headphones/") },
  openGraph: { title: "耳机收藏 · 奇妙收藏馆", description },
  twitter: { title: "耳机收藏 · 奇妙收藏馆", description },
};

export default function CollectionsHeadphonesPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.devicePage}`}>
      <PageMasthead
        currentHref="/collections/"
        subpageLabel="耳机收藏"
        animate={false}
        title="喜欢的声音，留在耳边。"
        lead={`Sony 与 Apple，${headphoneCollection.length} 副耳机的收藏。`}
      />
      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="headphone-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 07 / HEADPHONE COLLECTION</p>
            <h2 id="headphone-archive-title">耳机图鉴</h2>
          </div>
          <p>{headphoneCollection.length} 副收藏</p>
        </div>
        <CollectionNavigation current="headphones" />
        <HeadphoneCatalog />
        <nav className={styles.related} aria-label="继续浏览相关收藏">
          <CollectionLink href="/collections/devices/">设备展柜</CollectionLink>
          <CollectionLink href="/collections/gallery/?room=headphones">
            耳机画册
          </CollectionLink>
        </nav>
        <CollectionCredit label="耳机图片与资料" source="Sony · Apple 官方">
          <p>各卡片保留官方产品入口，图片与产品设计版权归各自权利方。</p>
        </CollectionCredit>
      </section>
      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
