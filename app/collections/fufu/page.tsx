import type { Metadata } from "next";
import Image from "next/image";
import { sitePath } from "@/lib/site-path";
import { fufuCollection, fufuCollectionMeta } from "@/content/fufu";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
import { CollectionCredit } from "../collection-credit";
import { CollectionNavigation } from "../collection-navigation";
import styles from "./fufu.module.css";

export const dynamic = "force-static";

const largeFufu = fufuCollection.find((entry) => entry.kind === "large");
const zodiacFufu = fufuCollection.filter((entry) => entry.kind === "zodiac");
const firstZodiac = zodiacFufu.at(0);
const latestZodiac = zodiacFufu.at(-1);
const zodiacRange =
  firstZodiac && latestZodiac
    ? `${firstZodiac.zodiac} ${firstZodiac.year} → ${latestZodiac.zodiac} ${latestZodiac.year}`
    : "等待生肖记录";
const zodiacLabels = zodiacFufu.map((entry) => entry.zodiac).join("、");
const description = `Mikureina 的 Fufu 毛绒收藏：大 Fufu 与 ${zodiacRange} 的 ${zodiacFufu.length} 只初音未来生肖 Fufu。`;

export const metadata: Metadata = {
  title: "Fufu 收藏 · 奇妙收藏馆",
  description,
  alternates: { canonical: absoluteSiteUrl("collections/fufu/") },
  openGraph: { title: "Fufu 收藏 · 奇妙收藏馆", description },
  twitter: { title: "Fufu 收藏 · 奇妙收藏馆", description },
};

export default function CollectionsFufuPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.fufuPage}`}>
      <PageMasthead
        currentHref="/collections/"
        animate={false}
        subpageLabel="Fufu 收藏"
        title="软乎乎的未来，也有自己的展柜。"
        lead={fufuCollectionMeta.summary}
        meta={[
          {
            label: "本人收藏",
            value: `${String(fufuCollection.length).padStart(2, "0")} 只`,
          },
          {
            label: "生肖成员",
            value: `${String(zodiacFufu.length).padStart(2, "0")} 只`,
          },
          { label: "收藏时间线", value: zodiacRange },
        ]}
      />

      <section
        className={`${styles.fufuArchive} section-shell section-pad`}
        aria-labelledby="fufu-archive-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">ROOM 04 / FUFU PLUSH COLLECTION</p>
            <h2 id="fufu-archive-title">一只大 Fufu，与每年延续的生肖队列。</h2>
          </div>
          <p>
            大个子的毛绒伙伴，和每年不同的生肖装扮。这里保留它们各自的正式名字与模样。
          </p>
        </div>

        <CollectionNavigation current="fufu" />

        <div className={styles.timeline}>
          <p>
            从虎年开始，{zodiacLabels}串起{zodiacFufu.length}
            年的生肖收藏。选一个年份，直接去看它。
          </p>
          <nav className={styles.zodiacRibbon} aria-label="生肖收藏顺序">
            {zodiacFufu.map((entry) => (
              <a key={entry.id} href={`#${entry.id}`} data-tone={entry.tone}>
                <b>{entry.zodiac}</b>
                <small>{entry.year}</small>
              </a>
            ))}
          </nav>
        </div>

        {largeFufu ? (
          <article
            className={styles.largeFufu}
            aria-labelledby={`${largeFufu.id}-title`}
          >
            <figure className={styles.productPhoto}>
              <a
                href={largeFufu.officialUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`查看 ${largeFufu.title} 的 SEGA 商品资料（将在新标签页打开）`}
              >
                <Image
                  src={sitePath(largeFufu.image)}
                  alt={`${largeFufu.title}，SEGA 官方商品示意图`}
                  width={800}
                  height={800}
                  sizes="(max-width: 760px) 90vw, 480px"
                  loading="lazy"
                  unoptimized
                />
              </a>
              <figcaption>SEGA 官方商品图 · 非本人实拍</figcaption>
            </figure>
            <div className={styles.largeCopy}>
              <span>THE BIG ONE / MIKU FUFU</span>
              <h3 id={`${largeFufu.id}-title`}>{largeFufu.title}</h3>
              <p>
                毛绒小队里的大个子，和每年的生肖伙伴一起，组成我的初音未来 Fufu 收藏。
              </p>
            </div>
          </article>
        ) : null}

        <div className={styles.zodiacHeading}>
          <div>
            <span>ANNUAL LINEUP / {String(zodiacFufu.length).padStart(2, "0")}</span>
            <h3>生肖 Fufu 时间线</h3>
          </div>
          <p>
            从第一弹{firstZodiac?.zodiac ?? "起点"}
            年款开始，按生肖年份排列；首款保留正式名称中的“ふわふわ”。
          </p>
        </div>

        <ol
          className={styles.fufuGrid}
          aria-label={`${zodiacFufu.length} 只生肖 Fufu 收藏`}
        >
          {zodiacFufu.map((entry) => {
            const titleId = `${entry.id}-title`;
            return (
              <li key={entry.id}>
                <article
                  id={entry.id}
                  className={styles.fufuCard}
                  data-tone={entry.tone}
                  aria-labelledby={titleId}
                >
                  <figure className={styles.productPhoto}>
                    <span className={styles.yearBadge}>
                      {entry.year} · {entry.zodiac}
                    </span>
                    <a
                      href={entry.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`查看 ${entry.title} 的 SEGA 商品资料（将在新标签页打开）`}
                    >
                      <Image
                        src={sitePath(entry.image)}
                        alt={`${entry.title}，SEGA 官方商品示意图`}
                        width={800}
                        height={800}
                        sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 340px"
                        loading="lazy"
                        unoptimized
                      />
                    </a>
                    <figcaption>SEGA 官方商品图 · 非本人实拍</figcaption>
                  </figure>
                  <div className={styles.fufuBody}>
                    <p>ZODIAC / {entry.zodiac}</p>
                    <h3 id={titleId}>{entry.title}</h3>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <CollectionCredit
          label="Fufu 图片与商品资料"
          source="SEGA 官方商品图 · 非本人实拍"
        >
          <p>{fufuCollectionMeta.rightsNote}</p>
        </CollectionCredit>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
