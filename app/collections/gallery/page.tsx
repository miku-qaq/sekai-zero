import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionLink } from "../collection-link";
import { GalleryCatalog } from "./gallery-catalog";
import styles from "./gallery.module.css";

export const dynamic = "force-static";

const description = "一本可以慢慢翻的收藏画册：动画、游戏、手办、Fufu、手柄与设备。";

export const metadata: Metadata = {
  title: "收藏画册 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/gallery/") },
  openGraph: { title: "收藏画册 · 奇妙收藏馆", description },
  twitter: { title: "收藏画册 · 奇妙收藏馆", description },
};

export default function CollectionGalleryPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        currentHref="/collections/"
        subpageLabel="画册"
        animate={false}
        title="收藏画册"
        lead="把喜欢，一页页翻开。"
      />
      <section
        className={`section-shell section-pad ${styles.archive}`}
        aria-label="收藏画册"
      >
        <CollectionLink className={styles.backLink} href="/collections/">
          <span aria-hidden="true">←</span> 收藏馆
        </CollectionLink>
        <GalleryCatalog />
      </section>
      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
