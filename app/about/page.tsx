import type { Metadata } from "next";
import { influenceSignals, profileQuestions, profileTimeline } from "@/content/about";
import { profileFacts, publicProfile } from "@/content/profile";
import { sitePath } from "@/lib/site-path";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "角色设定档",
  description:
    "认识 Mikureina：南京大学 CS 在读，喜欢动漫与游戏，也在长期建设 SEKAI / 00。",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        episode="FILE 01"
        eyebrow="PROFILE SIGNAL / VERIFIED FACTS ONLY"
        title="你好，我是 Mikureina。"
        lead="南京大学 CS 在读。平时喜欢动漫和游戏，也在这里记录计算机学习、作品与一座长期生长的个人次元站。"
        motif="M"
        tone="mint"
        meta={[
          { label: "CN 名", value: publicProfile.handle },
          { label: "当前状态", value: publicProfile.academicStatus },
          { label: "兴趣频道", value: publicProfile.interests.join(" × ") },
        ]}
      />

      <section
        className="profile-overview section-shell section-pad"
        aria-labelledby="profile-title"
      >
        <div className="section-heading profile-heading">
          <p className="section-index">01 / VERIFIED PROFILE</p>
          <h2 id="profile-title">已经确认的真实坐标。</h2>
          <p>
            以下资料均由本人确认公开；未提供的年级、经历、所在地与社交账号继续保持留白。
          </p>
        </div>
        <div className="profile-sheet">
          <article className="profile-id-card" aria-labelledby="profile-handle">
            <div className="profile-id-topline">
              <span>PUBLIC CHARACTER FILE</span>
              <strong>VERIFIED</strong>
            </div>
            <div className="profile-id-body">
              <span className="profile-id-mark" aria-hidden="true">
                {publicProfile.monogram}
              </span>
              <div>
                <p>CN / PLAYER 00</p>
                <h3 id="profile-handle">{publicProfile.handle}</h3>
                <span>{publicProfile.academicStatus}</span>
              </div>
            </div>
            <ul className="profile-id-tags" aria-label="公开兴趣与常玩平台">
              {[...publicProfile.interests, ...publicProfile.gamingPlatforms].map(
                (item) => (
                  <li key={item}>{item}</li>
                ),
              )}
            </ul>
            <p className="profile-id-status">
              <span aria-hidden="true" /> PROFILE ONLINE
            </p>
          </article>
          <dl className="profile-facts">
            {profileFacts.map((fact, index) => (
              <div id={fact.id} key={fact.label}>
                <dt>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {fact.label}
                </dt>
                <dd>
                  {fact.href ? (
                    <a
                      className="profile-fact-link"
                      href={fact.href}
                      aria-label={fact.ariaLabel}
                    >
                      {fact.value} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <strong>{fact.value}</strong>
                  )}
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
