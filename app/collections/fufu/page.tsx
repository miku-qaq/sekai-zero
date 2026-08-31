import type { Metadata } from "next";
import { fufuCollection, fufuCollectionMeta } from "@/content/fufu";
import { absoluteSiteUrl } from "@/lib/site-url";
import { JourneyNavigation } from "../../components/journey-navigation";
import { PageMasthead } from "../../components/page-masthead";
import { SiteFooter } from "../../components/site-footer";
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
            <h2 id="fufu-archive-title">从一只大 Fufu，到每年延续的生肖队列。</h2>
          </div>
          <p>
            “Fufu”是本站使用的收藏称呼；每张生肖卡都保留 SEGA
            公布的正式商品名，不自行添加别名或猜测购买信息。
          </p>
        </div>

        <CollectionNavigation current="fufu" />

        <div className={styles.originPanel}>
          <div className={styles.originYear} aria-hidden="true">
            <span>COLLECTION START</span>
            <strong>{firstZodiac?.year ?? "—"}</strong>
            <i>{firstZodiac?.zodiac ?? "始"}</i>
          </div>
          <div className={styles.originCopy}>
            <span>OWNER CONFIRMED / ZODIAC LINE</span>
            <h3>我的生肖 Fufu 收藏，从虎年开始。</h3>
            <p>
              {zodiacLabels}依次连接成{zodiacFufu.length}
              年的收藏时间线。这里记录“我拥有哪一只”和官方正式名称；价格、订单、商家与购入日期继续保持私有。
            </p>
          </div>
          <div className={styles.zodiacRibbon} aria-label="生肖收藏顺序">
            {zodiacFufu.map((entry) => (
              <span key={entry.id} data-tone={entry.tone}>
                <b>{entry.zodiac}</b>
                <small>{entry.year}</small>
              </span>
            ))}
          </div>
        </div>

        {largeFufu ? (
          <article
            className={styles.largeFufu}
            aria-labelledby={`${largeFufu.id}-title`}
          >
            <div className={styles.largeVisual} aria-hidden="true">
              <span>FUFU / BIG</span>
              <div className={styles.plushFace}>
                <i />
                <b>• ◡ •</b>
                <em>39</em>
              </div>
              <strong>大</strong>
            </div>
            <div className={styles.largeCopy}>
              <span>MOVED FROM FIGURE ROOM / OWNER CONFIRMED</span>
              <h3 id={`${largeFufu.id}-title`}>{largeFufu.title}</h3>
              <p>
                这只就是之前记录在手办区的大 Fufu。现在它回到独立的 Fufu
                分馆，并保留原记录编号，因此不会在两个展柜里重复计数。
              </p>
              <a href={largeFufu.officialUrl} target="_blank" rel="noreferrer">
                查看 SEGA 正式商品资料（新窗口） ↗
              </a>
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
          {zodiacFufu.map((entry, index) => {
            const titleId = `${entry.id}-title`;
            return (
              <li key={entry.id}>
                <article
                  className={styles.fufuCard}
                  data-tone={entry.tone}
                  aria-labelledby={titleId}
                >
                  <div className={styles.fufuVisual} aria-hidden="true">
                    <span>FUFU / {String(index + 1).padStart(2, "0")}</span>
                    <strong>{entry.motif}</strong>
                    <div className={styles.miniFace}>• ω •</div>
                    <i>{entry.year}</i>
                  </div>
                  <div className={styles.fufuBody}>
                    <p>ZODIAC / {entry.zodiac} · OWNER CONFIRMED</p>
                    <h3 id={titleId}>{entry.title}</h3>
                    <a href={entry.officialUrl} target="_blank" rel="noreferrer">
                      SEGA 正式资料（新窗口） ↗
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <aside className={styles.fufuNotice} aria-label="Fufu 收藏资料说明">
          <div>
            <span>COLLECTION NOTE / 39</span>
            <strong>{fufuCollectionMeta.sourceLabel}</strong>
          </div>
          <p>{fufuCollectionMeta.rightsNote}</p>
          <b>本人实拍待补充</b>
        </aside>
      </section>

      <JourneyNavigation currentHref="/collections/" />
      <SiteFooter />
    </main>
  );
}
