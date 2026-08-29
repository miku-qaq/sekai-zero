import type { Metadata } from "next";
import Image from "next/image";
import { animeCatalog } from "@/content/anime";
import { collectionRecordCount, collectionRooms } from "@/content/collections";
import { figureCollection } from "@/content/figures";
import { gameCatalog } from "@/content/games";
import { sitePath } from "@/lib/site-path";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import styles from "./collections.module.css";

export const dynamic = "force-static";

const description =
  "Mikureina 的奇妙收藏馆：统一整理看过的动画、玩过的游戏与真实手办收藏，并保留各自清晰的资料边界。";

export const metadata: Metadata = {
  title: "奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/") },
  openGraph: { title: "奇妙收藏馆 · SEKAI / 00", description },
  twitter: { title: "奇妙收藏馆 · SEKAI / 00", description },
};

const animePreview = animeCatalog.slice(0, 4);
const gamePreview = gameCatalog.filter((entry) => entry.image).slice(0, 4);
const figurePreview = figureCollection.slice(0, 7);

export default function CollectionsPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.collectionPage}`}>
      <PageMasthead
        currentHref="/collections/"
        title="把喜欢的世界，收进同一座馆。"
        lead="奇妙收藏馆把动画、游戏与手办放进同一条清晰的浏览路径；每个展区保留自己的检索方式、内容模型与真实性边界。"
        meta={[
          { label: "独立展柜", value: "03 间" },
          { label: "真实记录", value: `${collectionRecordCount} 条` },
          { label: "展示原则", value: "不排名 / 不虚构" },
        ]}
      />

      <section
        className={`${styles.index} section-shell section-pad`}
        aria-labelledby="collection-directory-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">00 / COLLECTION DIRECTORY</p>
            <h2 id="collection-directory-title">从一张馆内导览开始。</h2>
          </div>
          <p>
            顶层导航只保留一座收藏馆；动画、游戏和手办各自进入独立展柜，因此内容不会再散落，也不会混成一条难以浏览的长墙。
          </p>
        </div>

        <div className={styles.rooms}>
          {collectionRooms.map((room) => (
            <a href={sitePath(room.href)} key={room.id} data-tone={room.tone}>
              <span>{room.index} / ROOM</span>
              <strong aria-hidden="true">{room.motif}</strong>
              <div>
                <h3>{room.label}</h3>
                <b>
                  {room.count} {room.unit}
                </b>
                <p>{room.description}</p>
              </div>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <section
        className={`${styles.previewSection} section-shell section-pad`}
        aria-labelledby="collection-preview-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / CURATOR&apos;S PREVIEW</p>
            <h2 id="collection-preview-title">三间展柜，各有自己的观看方式。</h2>
          </div>
          <p>这里仅展示少量预览；完整搜索、筛选、来源与隐私说明都保留在对应分馆。</p>
        </div>

        <article className={`${styles.previewCard} ${styles.figurePreview}`}>
          <div className={styles.previewCopy}>
            <span>NEW ROOM / FIGURES &amp; GOODS</span>
            <h3>手办与周边收藏，正式入馆。</h3>
            <p>
              两张本人收藏记录去重后确认 17
              件。首版公开角色与收藏类型，价格、订单和无法可靠核对的商品型号不会进入公网页面。
            </p>
            <a href={sitePath("/collections/figures/")}>查看 17 件收藏记录 ↗</a>
          </div>
          <div className={styles.figurePreviewRail} aria-hidden="true">
            {figurePreview.map((entry, index) => (
              <span key={entry.id} data-tone={entry.tone}>
                <i>F-{String(index + 1).padStart(2, "0")}</i>
                <strong>{entry.motif}</strong>
                <b>{entry.character}</b>
              </span>
            ))}
          </div>
        </article>

        <div className={styles.mediaPreviews}>
          <article className={styles.previewCard}>
            <div className={styles.previewMedia}>
              {animePreview.map((entry) => (
                <Image
                  key={entry.id}
                  src={sitePath(entry.image)}
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={480}
                  sizes="(max-width: 700px) 22vw, 120px"
                  loading="lazy"
                  unoptimized
                />
              ))}
            </div>
            <div className={styles.previewCopy}>
              <span>ROOM 01 / ANIME</span>
              <h3>{animeCatalog.length} 部已经看过的动画。</h3>
              <p>保留正式名称、年份、类型与 Bangumi 资料来源，不做分数排行。</p>
              <a href={sitePath("/collections/anime/")}>进入动画展柜 ↗</a>
            </div>
          </article>

          <article className={styles.previewCard}>
            <div className={styles.previewMedia}>
              {gamePreview.map((entry) => (
                <Image
                  key={entry.id}
                  src={sitePath(entry.image ?? "")}
                  alt=""
                  aria-hidden="true"
                  width={280}
                  height={420}
                  sizes="(max-width: 700px) 22vw, 120px"
                  loading="lazy"
                  unoptimized
                />
              ))}
            </div>
            <div className={styles.previewCopy}>
              <span>ROOM 02 / GAMES</span>
              <h3>{gameCatalog.length} 款真实 Steam 游玩记录。</h3>
              <p>只公开作品名、识别封面与商店入口；账号、时长与最近上线保持私有。</p>
              <a href={sitePath("/collections/games/")}>进入游戏展柜 ↗</a>
            </div>
          </article>
        </div>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
