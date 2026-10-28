import type { Metadata } from "next";
import {
  gameCatalog,
  gameCatalogMeta,
  switchCollectionPlaceholder,
} from "@/content/games";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionCredit } from "../collection-credit";
import { CollectionNavigation } from "../collection-navigation";
import { GameCatalog } from "../game-catalog";
import styles from "../games.module.css";

export const dynamic = "force-static";

const description =
  "奇妙收藏馆的游戏展柜：整理 Mikureina 在 Steam 留下的实际游玩记录，并为 Nintendo Switch 收藏保留可扩展入口。";

export const metadata: Metadata = {
  title: "游戏收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/games/") },
  openGraph: { title: "游戏收藏 · 奇妙收藏馆", description },
  twitter: { title: "游戏收藏 · 奇妙收藏馆", description },
};

const coverCount = gameCatalog.filter((game) => game.image).length;

export default function CollectionsGamesPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.gamesPage}`}>
      <PageMasthead
        currentHref="/collections/"
        animate={false}
        subpageLabel="游戏展柜"
        title="玩过的世界，也值得收藏。"
        lead="我的 Steam 游玩记录，总有一段想重温的旅程。"
        meta={[
          {
            label: "Steam 记录",
            value: `${String(gameCatalog.length).padStart(3, "0")} 款`,
          },
          { label: "作品封面", value: `${String(coverCount).padStart(3, "0")} 张` },
          { label: "展示方式", value: "玩过 / 不排名" },
        ]}
      />

      <section
        className={`${styles.archive} section-shell section-pad`}
        aria-labelledby="game-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 02 / PLAYED GAMES</p>
            <h2 id="game-archive-title">Steam 游戏库</h2>
          </div>
        </div>

        <CollectionNavigation current="games" />

        <GameCatalog />

        <aside className={styles.platformShelf} aria-label="游戏平台收藏状态">
          <div className={styles.platformIntro}>
            <span>PLATFORM SHELVES</span>
            <strong>游戏平台</strong>
          </div>
          <div className={styles.platformCurrent}>
            <span>01 / ONLINE</span>
            <strong>Steam</strong>
            <small>
              {gameCatalog.length} 款 · {coverCount} 张封面 ·{" "}
              {gameCatalogMeta.updatedAt}
            </small>
          </div>
          <div className={styles.platformFuture}>
            <span>02 / NEXT</span>
            <b>{switchCollectionPlaceholder.title}</b>
            <small>{switchCollectionPlaceholder.copy}</small>
            <strong>正在整理中</strong>
          </div>
        </aside>

        <CollectionCredit label="游戏资料与封面来源" source="Steam">
          <p>{gameCatalogMeta.rightsNote}</p>
          <a href={gameCatalogMeta.sourceUrl} target="_blank" rel="noreferrer">
            打开 Steam 商店<span className="sr-only">（将在新标签页打开）</span>
          </a>
        </CollectionCredit>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
