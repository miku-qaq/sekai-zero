import type { Metadata } from "next";
import { buildLogs } from "@/content/logs";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "世界线日志",
  description: "记录 SEKAI / 00 每一话的变化、设计决定、工程边界与下一步方向。",
};

export default function LogsPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        episode="FILE 05"
        eyebrow="TIMELINE ARCHIVE / ITERATION BROADCAST"
        title="把网站的成长，也写成内容。"
        lead="这里不只发布“更新了”三个字。每一话都会留下问题、选择与复盘，让未来的自己知道为什么走到这里。"
        motif="記"
        tone="pink"
        meta={[
          {
            label: "收录话数",
            value: `${String(buildLogs.length).padStart(2, "0")} EPISODES`,
          },
          { label: "当前话", value: buildLogs[0].episode },
          { label: "更新节奏", value: "随每次有效迭代" },
        ]}
      />

      <section
        className="logs-index section-shell section-pad"
        aria-labelledby="logs-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / EPISODE INDEX</p>
            <h2 id="logs-title">从最新世界线开始追更。</h2>
          </div>
          <p>
            展开任意一话可以查看完整摘要与当时确认的决定；以后单篇文章会从这里继续生长。
          </p>
        </div>
        <div className="logs-list">
          {buildLogs.map((log, index) => (
            <details id={`ep-${log.number}`} key={log.episode} open={index === 0}>
              <summary>
                <div className="log-episode">
                  <span>{log.episode}</span>
                  <time dateTime={log.date.replaceAll(".", "-")}>{log.date}</time>
                </div>
                <div className="log-summary-copy">
                  <span>{log.status}</span>
                  <h3>{log.title}</h3>
                  <p>{log.summary}</p>
                </div>
                <i aria-hidden="true">＋</i>
              </summary>
              <div className="log-expanded">
                <div className="log-body">
                  {log.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="log-decisions">
                  <span>本话决定 / DECISIONS</span>
                  <ul>
                    {log.decisions.map((decision) => (
                      <li key={decision}>{decision}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section
        className="release-protocol section-pad"
        aria-labelledby="protocol-title"
      >
        <div className="section-shell release-layout">
          <div className="section-heading">
            <p className="section-index">02 / RELEASE PROTOCOL</p>
            <h2 id="protocol-title">每次放送前，都要回答四个问题。</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <strong>它解决了什么真实问题？</strong>
            </li>
            <li>
              <span>02</span>
              <strong>手机、桌面和两种主题都好用吗？</strong>
            </li>
            <li>
              <span>03</span>
              <strong>构建、类型与页面测试都通过了吗？</strong>
            </li>
            <li>
              <span>04</span>
              <strong>下一次维护时，未来的自己仍能看懂并继续吗？</strong>
            </li>
          </ol>
        </div>
      </section>

      <JourneyNavigation currentHref="/logs/" />
      <SiteFooter />
    </main>
  );
}
