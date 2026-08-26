import type { Metadata } from "next";
import { buildLogs } from "@/content/logs";
import {
  projectCaseStudy,
  projectDecisions,
  projectEvidence,
  projectFeatures,
} from "@/content/projects";
import { sitePath } from "@/lib/site-path";
import { HashDetailsController } from "../components/hash-details-controller";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "世界线日志",
  description: "SEKAI / 00 的制作说明与每次有效更新，都集中记录在这条世界线上。",
};

export default function LogsPage() {
  return (
    <main id="main-content" className="subpage-main">
      <HashDetailsController />
      <PageMasthead
        currentHref="/logs/"
        title="网站怎样成长，都记录在这里。"
        lead="这里集中收录 SEKAI / 00 的项目说明、制作选择与每次有效更新。首页负责让访客认识我，工程细节只在这条世界线展开。"
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
        id="project-overview"
        className="logs-project section-shell section-pad"
        aria-labelledby="project-overview-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / PROJECT OVERVIEW</p>
            <h2 id="project-overview-title">关于 SEKAI / 00 的制作记录。</h2>
          </div>
          <p>
            原“制作档案”已并入日志。这里保留项目目标、现有能力与关键取舍，完整变化按话数继续向下追更。
          </p>
        </div>

        <article className="logs-project-card">
          <div className="logs-project-topline">
            <span>{projectCaseStudy.code}</span>
            <span>{projectCaseStudy.status}</span>
          </div>
          <div className="logs-project-intro">
            <div>
              <p>LONG-RUN PERSONAL SEKAI</p>
              <h3>{projectCaseStudy.title}</h3>
            </div>
            <p>{projectCaseStudy.subtitle}</p>
          </div>
          <p className="logs-project-summary">{projectCaseStudy.summary}</p>
          <dl className="logs-project-facts">
            {projectCaseStudy.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <nav className="logs-project-evidence" aria-label="项目公开入口">
            {projectEvidence.map((item) => (
              <a
                href={item.external ? item.href : sitePath(item.href)}
                key={item.code}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span>{item.code}</span>
                <strong>{item.label}</strong>
                <i aria-hidden="true">↗</i>
                {item.external ? (
                  <span className="sr-only">（将在新标签页打开）</span>
                ) : null}
              </a>
            ))}
          </nav>
        </article>

        <div className="logs-feature-grid" aria-label="目前已经上线的功能">
          {projectFeatures.map((feature) => (
            <article key={feature.code}>
              <span>{feature.code}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>

        <div className="logs-decisions" aria-labelledby="project-decisions-title">
          <div>
            <p className="section-index">PROJECT DECISIONS</p>
            <h3 id="project-decisions-title">影响长期维护的选择。</h3>
          </div>
          <div>
            {projectDecisions.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span>D{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question}</strong>
                  <i aria-hidden="true">＋</i>
                </summary>
                <p>{item.decision}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="logs-index section-shell section-pad"
        aria-labelledby="logs-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">02 / EPISODE INDEX</p>
            <h2 id="logs-title">从最新世界线开始追更。</h2>
          </div>
          <p>展开任意一条记录，可以查看改动摘要与当时的主要取舍。</p>
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

      <JourneyNavigation currentHref="/logs/" />
      <SiteFooter />
    </main>
  );
}
