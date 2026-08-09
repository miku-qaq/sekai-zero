import { fieldNotes, projectHighlights, roadmap } from "@/content/site";
import { ShareButton } from "./components/share-button";
import { FavoriteChannels } from "./components/favorite-channels";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero section-shell" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow reveal reveal-one">
            <span className="status-dot" aria-hidden="true" />
            PERSONAL SIGNAL · ONLINE
          </p>
          <h1 id="hero-title" className="reveal reveal-two">
            在现实与
            <span>次元之间，</span>
            认真生活。
          </h1>
          <p className="hero-description reveal reveal-three">
            这里是我的个人空间：收藏作品、想法与喜欢的事物，
            也记录一个网站如何一周一周地长大。
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button button-primary" href="#works">
              查看第一话
              <span aria-hidden="true">↘</span>
            </a>
            <a className="button button-ghost" href="#about">
              阅读设定集
            </a>
          </div>
          <dl className="hero-meta reveal reveal-four">
            <div>
              <dt>现在播放</dt>
              <dd>第 001 话 · 个人宇宙启动</dd>
            </div>
            <div>
              <dt>更新计划</dt>
              <dd>每周持续连载</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual reveal reveal-three" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <article className="identity-card">
            <div className="identity-card-topline">
              <span>PLAYER / 01</span>
              <span className="online-label">ONLINE</span>
            </div>
            <div className="portrait-frame">
              <div className="portrait-grid" />
              <div className="portrait-halo" />
              <div className="portrait-core">✦</div>
              <div className="portrait-signal signal-a" />
              <div className="portrait-signal signal-b" />
              <span className="coordinate coordinate-a">X 39.9</span>
              <span className="coordinate coordinate-b">Y 00.1</span>
            </div>
            <div className="identity-card-caption">
              <div>
                <span>CODENAME</span>
                <strong>STILL WRITING</strong>
              </div>
              <span className="identity-number">#001</span>
            </div>
          </article>
          <div className="floating-label floating-label-top">次元接続中</div>
          <div className="floating-label floating-label-bottom">REAL × IMAGINE</div>
        </div>
      </section>

      <div className="signal-strip" aria-label="网站主题关键词">
        <div className="signal-track">
          {[0, 1].map((group) => (
            <div className="signal-group" key={group} aria-hidden={group === 1}>
              <span>ANIME</span>
              <i>✦</i>
              <span>DESIGN</span>
              <i>✦</i>
              <span>CODE</span>
              <i>✦</i>
              <span>NOTES</span>
              <i>✦</i>
              <span>CURIOSITY</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </div>

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
            我想要的不是一张永远不变的网络名片，而是一处会随着经历、作品和兴趣持续变化的个人空间。
          </p>
          <p>
            所以第一版先保持克制：不虚构尚未提供的个人资料，不用未经授权的动漫素材，也不为了“看起来高级”而堆砌交互。我们从稳固的工程结构与一套有记忆点的视觉语言开始。
          </p>
          <div className="principles-grid">
            <article>
              <span className="principle-number">01</span>
              <h3>真实优先</h3>
              <p>公开内容由你确认，空白可以等待，身份不被想象代替。</p>
            </article>
            <article>
              <span className="principle-number">02</span>
              <h3>模块生长</h3>
              <p>博客、作品、相册与实验室各自扩展，避免一次改动牵动全站。</p>
            </article>
            <article>
              <span className="principle-number">03</span>
              <h3>细节有趣</h3>
              <p>动漫感来自色彩、节奏与文案，不依赖复制某个现成角色。</p>
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
              三条特别喜欢的
              <br />
              世界线。
            </h2>
            <p>
              不复制官方画面，用色彩、声音与性格做成属于本站的致意。选一个频道，看看世界如何回应。
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
        <h2 id="finale-title">这只是第 001 话。</h2>
        <p>下一次更新，会让这个世界更像你一点。</p>
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
