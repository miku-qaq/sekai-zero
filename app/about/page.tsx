import type { Metadata } from "next";
import {
  influenceSignals,
  profileFacts,
  profileQuestions,
  profileTimeline,
} from "@/content/about";
import { sitePath } from "@/lib/site-path";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "角色设定档",
  description:
    "认识 SEKAI / 00 背后正在长期建设个人网站的人，以及音乐、旅行与摇滚构成的三种能量。",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        episode="FILE 01"
        eyebrow="PROFILE SIGNAL / VERIFIED FACTS ONLY"
        title="欢迎来到我的角色设定页。"
        lead="现实资料保持克制，喜欢的事认真展开。这里不会用一串标签假装认识我，而是记录我正在构建、正在学习和愿意长期坚持的东西。"
        motif="私"
        tone="mint"
        meta={[
          { label: "当前主线", value: "长期建设 SEKAI / 00" },
          { label: "次元属性", value: "音乐 × 旅行 × 摇滚" },
          { label: "档案状态", value: "持续补完中" },
        ]}
      />

      <section
        className="profile-overview section-shell section-pad"
        aria-labelledby="profile-title"
      >
        <div className="section-heading profile-heading">
          <p className="section-index">01 / VERIFIED PROFILE</p>
          <h2 id="profile-title">先从真实的四件事开始。</h2>
          <p>
            称呼、职业、所在地等现实信息尚未由主人公开，因此不会为了“看起来完整”而代填。
          </p>
        </div>
        <div className="profile-sheet">
          <div className="profile-avatar" aria-hidden="true">
            <span>00</span>
            <strong>PLAYER</strong>
            <i />
          </div>
          <dl className="profile-facts">
            {profileFacts.map((fact, index) => (
              <div key={fact.label}>
                <dt>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {fact.label}
                </dt>
                <dd>
                  <strong>{fact.value}</strong>
                  <span>{fact.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="influence-section section-pad"
        aria-labelledby="influence-title"
      >
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">02 / INFLUENCE SIGNALS</p>
              <h2 id="influence-title">构成我的三种能量。</h2>
            </div>
            <p>不是借角色替我发言，而是诚实记录我从她们身上感受到的创作方向。</p>
          </div>
          <div className="influence-grid">
            {influenceSignals.map((signal) => (
              <article
                className={`influence-card influence-${signal.tone}`}
                key={signal.name}
              >
                <div className="influence-topline">
                  <span>CH / {signal.index}</span>
                  <span>{signal.channel}</span>
                </div>
                <span className="influence-motif" aria-hidden="true">
                  {signal.motif}
                </span>
                <p>{signal.romanized}</p>
                <h3>{signal.name}</h3>
                <span className="influence-copy">{signal.copy}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="profile-dialogue section-shell section-pad"
        aria-labelledby="dialogue-title"
      >
        <div className="section-heading">
          <p className="section-index">03 / DIALOGUE OPTIONS</p>
          <h2 id="dialogue-title">想继续了解的话，选一句对白。</h2>
        </div>
        <div className="dialogue-list">
          {profileQuestions.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                <span>Q{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.question}</strong>
                <i aria-hidden="true">＋</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        className="profile-timeline section-pad"
        aria-labelledby="timeline-title"
      >
        <div className="section-shell timeline-layout">
          <div className="section-heading">
            <p className="section-index">04 / ORIGIN STORY</p>
            <h2 id="timeline-title">这条世界线如何抵达现在。</h2>
          </div>
          <ol>
            {profileTimeline.map((item, index) => (
              <li key={item.episode}>
                <span className="timeline-marker">{index + 1}</span>
                <div>
                  <p>{item.episode}</p>
                  <h3>{item.title}</h3>
                  <span>{item.copy}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="subpage-next section-shell" aria-labelledby="next-title">
        <span>下一站 / ROUTE 02</span>
        <h2 id="next-title">沿着信号，看看我愿意反复返回的坐标。</h2>
        <a className="button button-primary" href={sitePath("/links/")}>
          前往航线终端 <span aria-hidden="true">↗</span>
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
