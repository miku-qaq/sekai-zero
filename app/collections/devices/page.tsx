import type { Metadata } from "next";
import { deviceCollection } from "@/content/devices";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionCredit } from "../collection-credit";
import { CollectionLink } from "../collection-link";
import { CollectionNavigation } from "../collection-navigation";
import { DeviceCatalog } from "./device-catalog";
import styles from "./devices.module.css";

export const dynamic = "force-static";

const description =
  "Mikureina 的设备收藏：Apple 的手机与平板，以及 Nintendo 的游戏主机。";

export const metadata: Metadata = {
  title: "设备收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/devices/") },
  openGraph: { title: "设备收藏 · 奇妙收藏馆", description },
  twitter: { title: "设备收藏 · 奇妙收藏馆", description },
};

export default function CollectionsDevicesPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.devicePage}`}>
      <PageMasthead
        currentHref="/collections/"
        subpageLabel="设备收藏"
        animate={false}
        title="日常与游戏，都有它们。"
        lead={`Apple 与 Nintendo，陪伴我的 ${deviceCollection.length} 件设备。`}
      />
      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="device-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 06 / DEVICE COLLECTION</p>
            <h2 id="device-archive-title">设备图鉴</h2>
          </div>
          <p>{deviceCollection.length} 件收藏</p>
        </div>
        <CollectionNavigation current="devices" />
        <DeviceCatalog />
        <nav className={styles.related} aria-label="继续浏览相关收藏">
          <CollectionLink href="/collections/controllers/">
            手柄展柜 <span aria-hidden="true">→</span>
          </CollectionLink>
          <CollectionLink href="/collections/gallery/?room=devices">
            设备画册 <span aria-hidden="true">→</span>
          </CollectionLink>
        </nav>
        <CollectionCredit label="设备图片与资料" source="Apple · Nintendo 官方">
          <p>图片与资料来自 Apple 与 Nintendo 官方，展示图非本人实拍。</p>
        </CollectionCredit>
      </section>
      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
