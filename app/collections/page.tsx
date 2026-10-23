import type { Metadata } from "next";
import Image from "next/image";
import { animeCatalog } from "@/content/anime";
import { collectionRecordCount, collectionRooms } from "@/content/collections";
import { controllerCollection } from "@/content/controllers";
import { figureCollection } from "@/content/figures";
import { fufuCollection } from "@/content/fufu";
import { gameCatalog } from "@/content/games";
import { sitePath } from "@/lib/site-path";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import { CollectionLink } from "./collection-link";
import styles from "./collections.module.css";

export const dynamic = "force-static";

const description =
  "Mikureina 的奇妙收藏馆：统一整理看过的动画、玩过的游戏、手办、初音未来 Fufu 与手柄收藏。";

export const metadata: Metadata = {
  title: "奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/") },
  openGraph: { title: "奇妙收藏馆 · SEKAI / 00", description },
  twitter: { title: "奇妙收藏馆 · SEKAI / 00", description },
};

const animePreview = animeCatalog.slice(0, 4);
const gamePreview = gameCatalog.filter((entry) => entry.image).slice(0, 4);
const figurePreviewIds = [
  "figure-001",
  "figure-002",
  "figure-007",
  "figure-009",
] as const;
const figurePreview = figurePreviewIds.flatMap((id) =>
  figureCollection.filter((entry) => entry.id === id),
);
const figureMikuCount = figureCollection.filter(
  (entry) => entry.character === "初音未来",
).length;
const fufuPreview = fufuCollection;
const zodiacFufu = fufuCollection.filter((entry) => entry.kind === "zodiac");
const firstZodiacFufu = zodiacFufu.at(0);
const latestZodiacFufu = zodiacFufu.at(-1);
const fufuTimeline =
  firstZodiacFufu && latestZodiacFufu
    ? `${firstZodiacFufu.zodiac} ${firstZodiacFufu.year} 到 ${latestZodiacFufu.zodiac} ${latestZodiacFufu.year}`
    : "持续更新中的生肖时间线";

export default function CollectionsPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.collectionPage}`}>
      <PageMasthead
        currentHref="/collections/"
        animate={false}
        title="把喜欢的世界，收进同一座馆。"
        lead="看过的动画、玩过的游戏，和陪在身边的小小收藏。"
        meta={[
          {
            label: "独立展柜",
            value: `${String(collectionRooms.length).padStart(2, "0")} 间`,
          },
          { label: "收藏记录", value: `${collectionRecordCount} 条` },
          { label: "馆内漫游", value: "故事 / 日常 / 热爱" },
        ]}
      />

      <section
        className={`${styles.index} section-shell section-pad`}
        aria-labelledby="collection-directory-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">00 / COLLECTION DIRECTORY</p>
            <h2 id="collection-directory-title">今天，想逛哪一间？</h2>
          </div>
        </div>

        <div className={styles.exhibits}>
          {collectionRooms.map((room) => (
            <CollectionLink
              href={room.href}
              key={room.id}
              className={styles.exhibit}
              data-tone={room.tone}
              data-room={room.id}
            >
              <div className={styles.exhibitHeading}>
                <span>{room.index} / ROOM</span>
                <span>
                  {room.count} {room.unit}
                </span>
              </div>
              <div className={styles.exhibitArtwork} aria-hidden="true">
                {room.id === "anime" || room.id === "games" ? (
                  <div className={styles.coverShelf}>
                    {(room.id === "anime" ? animePreview : gamePreview).map((entry) => (
                      <Image
                        key={entry.id}
                        src={sitePath(entry.image ?? "")}
                        alt=""
                        width={280}
                        height={420}
                        sizes="(max-width: 600px) 22vw, (max-width: 900px) 20vw, 12vw"
                        loading="lazy"
                        unoptimized
                      />
                    ))}
                  </div>
                ) : room.id === "figures" ? (
                  <div className={styles.figureShelf}>
                    {figurePreview.slice(0, 4).map((entry) => (
                      <span key={entry.id}>
                        {entry.product?.image ? (
                          <Image
                            src={sitePath(entry.product.image)}
                            alt=""
                            width={200}
                            height={260}
                            sizes="(max-width: 600px) 22vw, 12vw"
                            loading="lazy"
                            unoptimized
                          />
                        ) : (
                          <strong>{entry.motif}</strong>
                        )}
                        <b>{entry.character}</b>
                      </span>
                    ))}
                  </div>
                ) : room.id === "fufu" ? (
                  <div className={styles.plushShelf}>
                    {fufuPreview.map((entry) => (
                      <span key={entry.id}>
                        <Image
                          src={sitePath(entry.image)}
                          alt=""
                          width={160}
                          height={160}
                          sizes="(max-width: 600px) 24vw, 120px"
                          loading="lazy"
                          unoptimized
                        />
                        <b>{entry.year ?? "BIG"}</b>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className={styles.controllerShelf}>
                    {controllerCollection.map((entry) => (
                      <span key={entry.id}>
                        <Image
                          src={sitePath(entry.image)}
                          alt=""
                          width={200}
                          height={160}
                          sizes="(max-width: 600px) 22vw, 160px"
                          loading="lazy"
                          unoptimized
                        />
                        <b>{entry.shortName}</b>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.exhibitCopy}>
                <h3>{room.label}</h3>
                <p>
                  {room.id === "anime"
                    ? `看过的故事，留在这一面封面墙。`
                    : room.id === "games"
                      ? `Steam 里的足迹，总有想重温的世界。`
                      : room.id === "figures"
                        ? `${figureMikuCount} 种初音未来，还有来自不同作品的伙伴。`
                        : room.id === "fufu"
                          ? `从${fufuTimeline}，还有一只大 Fufu。`
                          : `Xbox、两代 Switch Pro，还有八重神子联名款。`}
                </p>
                <div className={styles.exhibitFooter}>
                  <span>
                    {room.id === "anime"
                      ? "作品搜索 · 年份 / 类型筛选"
                      : room.id === "games"
                        ? "名称搜索 · Steam 商店入口"
                        : room.id === "figures"
                          ? "款式搜索 · 点击查看大图"
                          : room.id === "fufu"
                            ? "生肖时间线 · 官方资料"
                            : "标准款与角色联名 · 商品图鉴"}
                  </span>
                  <b>
                    进入展柜 <span aria-hidden="true">↗</span>
                  </b>
                </div>
              </div>
            </CollectionLink>
          ))}
        </div>
        <p className={styles.collectionNote}>
          手办、Fufu 与手柄使用商品展示图，非本人实拍。
        </p>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
