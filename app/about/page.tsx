import type { Metadata } from "next";
import Image from "next/image";
import { currentFocus, profileQuestions } from "@/content/about";
import { profileFacts, publicProfile } from "@/content/profile";
import { characterBanner, favoriteChannels } from "@/content/site";
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
        artwork={characterBanner}
        title={`你好，我是 ${publicProfile.handle}。`}
        lead="南京大学 CS 在读，喜欢动漫和游戏，也喜欢把所学与热爱记下来。"
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
              <h2 id="influence-title">喜欢的角色。</h2>
            </div>
            <p>音乐、远行与摇滚，组成这个小世界。</p>
          </div>
          <div className="influence-grid">
            {favoriteChannels.map((signal) => (
              <article
                className={`influence-card influence-${signal.id}`}
                key={signal.id}
              >
                <a
                  className="influence-artwork"
                  href={sitePath(signal.image)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`查看${signal.name}插画大图（新标签页）`}
                >
                  <Image
                    src={sitePath(signal.image)}
                    alt={signal.imageAlt}
                    width={1024}
                    height={1536}
                    sizes="(max-width: 760px) 44vw, 30vw"
                  />
                  <span aria-hidden="true">↗</span>
                </a>
                <div className="influence-caption">
                  <span className="influence-topline">{signal.index} / FAVORITES</span>
                  <p>{signal.romanized}</p>
                  <h3>{signal.name}</h3>
                  <span className="influence-copy">{signal.note}</span>
                </div>
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
            <h2 id="focus-title">最近在做。</h2>
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
