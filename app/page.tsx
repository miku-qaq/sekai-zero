import Image from "next/image";
import { currentBroadcast } from "@/content/now";
import { publicProfile } from "@/content/profile";
import { homepageFacts } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import { CurrentBroadcast } from "./components/current-broadcast";
import { DimensionalGacha } from "./components/dimensional-gacha";
import { ShareButton } from "./components/share-button";
import { FavoriteChannels } from "./components/favorite-channels";
import { SiteFooter } from "./components/site-footer";
import { WorldMap } from "./components/world-map";

const heroImage = sitePath("/hero-anime-v2.webp");

// The homepage has no request-time data. Declaring the contract explicitly
// keeps Vinext's conservative static analyzer from skipping Pages export.
export const dynamic = "force-static";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero section-shell" id="top" aria-labelledby="hero-title">
        <div className="hero-heading">
          <p className="eyebrow reveal reveal-one">
            <span className="status-dot" aria-hidden="true" />
            PERSONAL SEKAI · SIGNAL ONLINE
          </p>
          <h1 id="hero-title" className="reveal reveal-two">
            你好，我是 {publicProfile.handle}。<span>欢迎来到我的个人世界。</span>
          </h1>
        </div>
        <div className="hero-details">
          <p className="hero-description reveal reveal-three">
            {publicProfile.academicStatus}，喜欢{publicProfile.interests.join("和")}
            。这里收录我的计算机学习笔记、 兴趣收藏，以及想长期保存的生活与思考。
          </p>
          <div className="hero-actions reveal reveal-four">
            <a
              className="button button-primary"
              href={sitePath("/study/#cs224n-nlp-word-vectors")}
            >
              继续当前学习
              <span aria-hidden="true">↘</span>
            </a>
            <a className="button button-ghost" href={sitePath("/about/")}>
              认识 Mikureina
            </a>
          </div>
          <dl className="hero-meta reveal reveal-four">
            <div>
              <dt>最近在学</dt>
              <dd>{currentBroadcast.signals[0].title}</dd>
            </div>
            <div>
              <dt>常玩平台</dt>
              <dd>{publicProfile.gamingPlatforms.join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual reveal reveal-three">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <figure className="identity-card anime-key-visual">
            <div className="identity-card-topline">
              <span>ORIGINAL KEY VISUAL / 00</span>
              <span className="online-label">ON AIR</span>
            </div>
            <div className="portrait-frame">
              <Image
                className="hero-anime-image"
                src={heroImage}
                alt="原创动漫群像：青发电子歌者、银发旅行魔女与粉发吉他手置身星空舞台"
                width={1024}
                height={1536}
                sizes="(max-width: 760px) 300px, (max-width: 900px) 430px, 438px"
                priority
              />
              <div className="portrait-halftone" aria-hidden="true" />
              <span className="coordinate coordinate-a" aria-hidden="true">
                SCENE / MAIN
              </span>
              <span className="coordinate coordinate-b" aria-hidden="true">
                好き × 3
              </span>
            </div>
            <figcaption className="identity-card-caption">
              <div>
                <span>DIMENSIONAL STUDIO</span>
                <strong>SONG · MAGIC · ROCK</strong>
              </div>
              <span className="identity-number">#SEKAI</span>
            </figcaption>
          </figure>
          <div className="speech-bubble speech-bubble-top">今天也要把未来唱出来！</div>
          <div className="floating-label floating-label-top">原创次元主视觉</div>
          <div className="floating-label floating-label-bottom" lang="ja">
            推しが尊い!
          </div>
        </div>
      </section>

      <div className="signal-strip" aria-label="网站主题关键词">
        <div className="signal-track">
          {[0, 1].map((group) => (
            <div className="signal-group" key={group} aria-hidden={group === 1}>
              <span>ANIME</span>
              <i>✦</i>
              <span>MANGA</span>
              <i>✦</i>
              <span>MUSIC</span>
              <i>✦</i>
              <span>MAGIC</span>
              <i>✦</i>
              <span>ROCK</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </div>

      <section
        className="manga-moments section-shell"
        aria-label="Mikureina 的三条个人信息"
      >
        {homepageFacts.map((moment) => (
          <article className={`manga-moment manga-${moment.tone}`} key={moment.index}>
            <div className="manga-moment-meta">
              <span>FRAME {moment.index}</span>
              <span>{moment.label}</span>
            </div>
            <span className="manga-moment-motif" aria-hidden="true">
              {moment.motif}
            </span>
            <h3>{moment.copy}</h3>
            <span className="manga-sfx" lang="ja" aria-hidden="true">
              {moment.soundEffect}
            </span>
          </article>
        ))}
      </section>

      <CurrentBroadcast />

      <WorldMap />

      <section
        className="favorites section-pad"
        id="favorites"
        aria-labelledby="favorites-title"
      >
        <div className="section-shell favorites-layout">
          <div className="section-heading favorites-heading">
            <p className="section-index">03 / FAVORITE FREQUENCIES</p>
            <h2 id="favorites-title">
              我的三位二次元老婆
              <br />
              各自接通一条频道。
            </h2>
            <p>
              初音未来、伊蕾娜和波奇是我最喜欢的三个角色。本站用薄荷音符、雾紫星轨与樱粉节拍，为她们设计了三个原创主题频道。
            </p>
          </div>
          <FavoriteChannels />
        </div>
      </section>

      <section
        className="gacha-section section-shell section-pad"
        id="gacha"
        aria-labelledby="gacha-title"
      >
        <div className="section-heading horizontal-heading gacha-heading">
          <div>
            <p className="section-index">BONUS TRACK / DIMENSIONAL GACHA</p>
            <h2 id="gacha-title">抽一张今天的次元签。</h2>
          </div>
          <p>
            不是角色原台词，而是从音乐、远行与摇滚精神延伸出的原创小签；给今天一个轻松但可以执行的开场。
          </p>
        </div>
        <DimensionalGacha />
      </section>

      <section className="finale section-shell" aria-labelledby="finale-title">
        <div className="finale-grid" aria-hidden="true" />
        <p className="eyebrow">
          <span className="status-dot" /> THANKS FOR VISITING
        </p>
        <h2 id="finale-title">谢谢你逛到这里。</h2>
        <p>想继续了解我，可以阅读当前 CS224N 学习笔记，或在关于页面找到联系邮箱。</p>
        <div className="finale-actions">
          <a
            className="button button-primary"
            href={sitePath("/study/#cs224n-nlp-word-vectors")}
          >
            阅读当前笔记 <span aria-hidden="true">↗</span>
          </a>
          <a className="button button-ghost" href={sitePath("/about/#contact")}>
            联系我
          </a>
          <ShareButton />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
