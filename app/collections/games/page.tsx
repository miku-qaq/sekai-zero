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
        subpageLabel="游戏展柜"
        title="玩过的世界，也值得收藏。"
        lead="这里整理我在 Steam 留下实际游玩记录的作品。页面只公开游戏名称与识别封面，不公开账号、游玩时长、最近上线或好友信息。"
        meta={[
          {
            label: "Steam 记录",
            value: `${String(gameCatalog.length).padStart(3, "0")} 款`,
          },
          { label: "本地封面", value: `${String(coverCount).padStart(3, "0")} 张` },
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
            <h2 id="game-archive-title">从游戏库里找回旅程。</h2>
          </div>
          <p>
            按 Steam
            当前显示的作品名整理，可直接搜索。这里不是时长榜或推荐榜，只记录确认过的游玩足迹。
          </p>
        </div>

        <CollectionNavigation current="games" />

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
            <strong>内容待填充 · OWNER CONFIRMATION REQUIRED</strong>
          </div>
        </aside>

        <GameCatalog />

        <aside className={styles.privacyNotice} aria-label="Steam 数据隐私说明">
          <span aria-hidden="true">LOCK / LOCAL ONLY</span>
          <div>
            <h3>只留下适合公开的收藏信息。</h3>
            <p>
              同步脚本只把游戏
              ID、名称、平台、本地封面与公开商店地址写入仓库；账号标识、游玩时长、最近上线与授权数据不会进入公开目录。
            </p>
          </div>
        </aside>

        <aside className={styles.sourceNotice} aria-label="游戏资料与封面来源说明">
          <div>
            <span>IMAGE &amp; DATA CREDIT</span>
            <strong>{gameCatalogMeta.sourceLabel}</strong>
          </div>
          <p>{gameCatalogMeta.rightsNote}</p>
          <a href={gameCatalogMeta.sourceUrl} target="_blank" rel="noreferrer">
            打开 Steam 商店
            <span aria-hidden="true">↗</span>
            <span className="sr-only">（将在新标签页打开）</span>
          </a>
        </aside>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
