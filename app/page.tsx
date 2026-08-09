import Image from "next/image";
import { fieldNotes, mangaMoments, projectHighlights, roadmap } from "@/content/site";
import { ShareButton } from "./components/share-button";
import { FavoriteChannels } from "./components/favorite-channels";

const pagesBaseSegment = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
const publicBasePath = pagesBaseSegment ? `/${pagesBaseSegment}` : "";

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
            EP.002 · ANIME SIGNAL ONLINE
          </p>
          <h1 id="hero-title" className="reveal reveal-two">
            我的日常，
            <span>正在二次元化。</span>
          </h1>
        </div>
        <div className="hero-details">
          <p className="hero-description reveal reveal-three">
            欢迎来到一部由代码、音乐、魔法和一点社恐能量共同连载的个人番剧。
            这里收藏作品，也收藏让我想继续向前的角色与瞬间。
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button button-primary" href="#favorites">
              进入角色频道
              <span aria-hidden="true">↘</span>
            </a>
            <a className="button button-ghost" href="#works">
              追更作品线
            </a>
          </div>
          <dl className="hero-meta reveal reveal-four">
            <div>
              <dt>现在播放</dt>
              <dd>第 002 话 · 次元浓度上升</dd>
            </div>
            <div>
              <dt>本话属性</dt>
              <dd>音乐 × 魔法 × 摇滚</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual reveal reveal-three">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <figure className="identity-card anime-key-visual">
            <div className="identity-card-topline">
              <span>ORIGINAL KEY VISUAL / 02</span>
              <span className="online-label">ON AIR</span>
            </div>
            <div className="portrait-frame">
              <Image
                className="hero-anime-image"
                src={`${publicBasePath}/hero-anime-v2.webp`}
                alt="原创动漫群像：青发电子歌者、银发旅行魔女与粉发吉他手置身星空舞台"
                width={1024}
                height={1536}
                sizes="(max-width: 760px) 300px, (max-width: 900px) 430px, 438px"
                priority
              />
              <div className="portrait-halftone" aria-hidden="true" />
              <span className="coordinate coordinate-a" aria-hidden="true">
                SCENE / 002
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
              <span className="identity-number">#002</span>
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

      <section className="manga-moments section-shell" aria-label="本话三个次元瞬间">
        {mangaMoments.map((moment) => (
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

      <section
        className="about section-shell section-pad"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="section-heading">
          <p className="section-index">01 / ABOUT THIS SEKAI</p>
          <h2 id="about-title">
            把个人网站，
            <br />
            当作一部长期连载。
          </h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            这不是贴几张角色图的主题模板，而是一处真正用漫画节奏、角色气质与互动细节构成的个人次元空间。
          </p>
          <p>
            第二话开始把“二次元”从彩蛋提升为主角：原创群像负责第一眼的情绪，频道卡负责可玩的个性，作品与日志则继续保持清晰、真实、可维护。
          </p>
          <div className="principles-grid">
            <article>
              <span className="principle-number">01</span>
              <h3>像一页漫画</h3>
              <p>对白框、网点与分镜服务阅读节奏，而不是遮住内容。</p>
            </article>
            <article>
              <span className="principle-number">02</span>
              <h3>像一部番剧</h3>
              <p>每周是一话，网站的变化本身也会被记录和收藏。</p>
            </article>
            <article>
              <span className="principle-number">03</span>
              <h3>像自己的世界</h3>
              <p>尊重喜欢的角色，也用原创素材建立长期个人品牌。</p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="favorites section-pad"
        id="favorites"
        aria-labelledby="favorites-title"
      >
        <div className="section-shell favorites-layout">
          <div className="section-heading favorites-heading">
            <p className="section-index">02 / FAVORITE FREQUENCIES</p>
            <h2 id="favorites-title">
              三张我的 SSR
              <br />
              推し角色卡。
            </h2>
            <p>
              初音未来、伊蕾娜和波奇，是三种让我持续向前的能量。抽一张角色卡，整站都会回应她的频道色。
            </p>
          </div>
          <FavoriteChannels />
        </div>
      </section>

      <section className="works section-pad" id="works" aria-labelledby="works-title">
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">03 / FEATURED STORY</p>
              <h2 id="works-title">正在发生的故事</h2>
            </div>
            <p>从一件真正存在的作品开始，之后每次更新都留下可以被看见的进展。</p>
          </div>
          <div className="project-grid">
            {projectHighlights.map((project) => (
              <article
                className={`project-card project-${project.tone}`}
                key={project.index}
              >
                <div className="project-card-header">
                  <span className="project-index">{project.index}</span>
                  <span className="project-status">{project.status}</span>
                </div>
                <div className="project-art" aria-hidden="true">
                  <span className="project-art-label">{project.subtitle}</span>
                  <div className="project-window">
                    <span />
                    <span />
                    <span />
                    <div className="project-window-line line-short" />
                    <div className="project-window-line" />
                    <div className="project-window-orb" />
                  </div>
                  <span className="project-art-number">{project.index}</span>
                </div>
                <div className="project-body">
                  <p>{project.subtitle}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul className="tag-list" aria-label={`${project.title} 标签`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="notes section-shell section-pad"
        id="notes"
        aria-labelledby="notes-title"
      >
        <div className="section-heading horizontal-heading notes-heading">
          <div>
            <p className="section-index">04 / FIELD NOTES</p>
            <h2 id="notes-title">世界线观测日志</h2>
          </div>
          <p>先记录建站过程；未来这里会成为完整的文章与灵感档案。</p>
        </div>
        <div className="notes-list">
          {fieldNotes.map((note) => (
            <article className="note-row" key={note.id}>
              <div className="note-meta">
                <span>{note.id}</span>
                <time>{note.date}</time>
              </div>
              <div className="note-copy">
                <h3>{note.title}</h3>
                <p>{note.excerpt}</p>
              </div>
              <span className="note-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="roadmap section-pad"
        id="roadmap"
        aria-labelledby="roadmap-title"
      >
        <div className="section-shell roadmap-layout">
          <div className="section-heading roadmap-heading">
            <p className="section-index">05 / CONTINUED NEXT WEEK</p>
            <h2 id="roadmap-title">
              长期项目，
              <br />
              小步更新。
            </h2>
            <p>每一阶段都应该独立可用、可以验证，也可以在需求变化时被替换。</p>
          </div>
          <ol className="roadmap-list">
            {roadmap.map((item) => (
              <li key={item.phase}>
                <span className="roadmap-phase">PHASE {item.phase}</span>
                <div>
                  <div className="roadmap-title-line">
                    <h3>{item.title}</h3>
                    <span>{item.status}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="finale section-shell" aria-labelledby="finale-title">
        <div className="finale-grid" aria-hidden="true" />
        <p className="eyebrow">
          <span className="status-dot" /> TO BE CONTINUED
        </p>
        <h2 id="finale-title">第 002 话，放送完毕。</h2>
        <p>主视觉已点亮；下一话，会继续加入真实作品与更有趣的次元实验。</p>
        <div className="finale-actions">
          <a className="button button-primary" href="#top">
            回到开场 <span aria-hidden="true">↑</span>
          </a>
          <ShareButton />
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            00
          </span>
          <div>
            <strong>SEKAI / 00</strong>
            <span>PERSONAL SIGNAL</span>
          </div>
        </div>
        <p>用好奇心、代码与一点点魔法持续构建。</p>
        <p>© {new Date().getFullYear()} · SIGNAL STILL ON</p>
      </footer>
    </main>
  );
}
