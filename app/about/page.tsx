import type { Metadata } from "next";
import { currentFocus, influenceSignals, profileQuestions } from "@/content/about";
import { profileFacts, publicProfile } from "@/content/profile";
import { sitePath } from "@/lib/site-path";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "关于我",
  description:
    "认识 Mikureina：南京大学 CS 在读，喜欢动漫与游戏，也在长期建设 SEKAI / 00。",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        currentHref="/about/"
        title="你好，我是 Mikureina。"
        lead="南京大学 CS 在读，喜欢动漫和游戏，也喜欢把所学与热爱记下来。"
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
          <p className="section-index">01 / ABOUT ME</p>
          <h2 id="profile-title">我的小档案</h2>
        </div>
        <div className="profile-sheet">
          <article className="profile-id-card" aria-labelledby="profile-handle">
            <div className="profile-id-topline">
              <span>MIKUREINA / PUBLIC PROFILE</span>
              <strong>ONLINE</strong>
            </div>
            <div className="profile-id-body">
              <span className="profile-id-mark" aria-hidden="true">
                {publicProfile.monogram}
              </span>
              <div>
                <p>CN / MIKUREINA</p>
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
              <span aria-hidden="true" /> WELCOME TO MY SEKAI
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
                  {fact.note ? <span>{fact.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="influence-section section-pad"
        id="interests"
        aria-labelledby="influence-title"
      >
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">02 / INFLUENCE SIGNALS</p>
              <h2 id="influence-title">我喜欢的三个角色频道。</h2>
            </div>
            <p>音乐、远行与摇滚，是这个小世界的三种颜色。</p>
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
          <h2 id="dialogue-title">再聊几句。</h2>
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

      <section className="profile-timeline section-pad" aria-labelledby="focus-title">
        <div className="section-shell timeline-layout">
          <div className="section-heading">
            <p className="section-index">04 / CURRENT FOCUS</p>
            <h2 id="focus-title">最近在投入的事情。</h2>
          </div>
          <ol>
            {currentFocus.map((item, index) => (
              <li key={item.code}>
                <span className="timeline-marker">{index + 1}</span>
                <div>
                  <p>{item.code}</p>
                  <h3>{item.title}</h3>
                  <span>{item.copy}</span>
                  <a className="section-text-link" href={sitePath(item.href)}>
                    {item.action} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <JourneyNavigation currentHref="/about/" />
      <SiteFooter />
    </main>
  );
}
