import type { Metadata } from "next";
import {
  futureCase,
  nextCheckpoints,
  productionChapters,
  projectCaseStudy,
  projectDecisions,
  projectShifts,
  projectSystemFlow,
  qualityGates,
} from "@/content/projects";
import { sitePath } from "@/lib/site-path";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import styles from "./projects.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "制作档案",
  description:
    "SEKAI / 00 的第一份真实项目案例：记录目标、设计语言、技术结构、质量门禁与长期演进。",
  openGraph: {
    title: "制作档案 · SEKAI / 00",
    description: "把网站怎样长成现在的样子，整理成一份可以验证的项目案例。",
    images: [{ url: "og-projects.png", alt: "SEKAI / 00 制作档案分享卡片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "制作档案 · SEKAI / 00",
    description: "把网站怎样长成现在的样子，整理成一份可以验证的项目案例。",
    images: ["og-projects.png"],
  },
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.projectsPage}`}>
      <PageMasthead
        episode="FILE 03"
        eyebrow="PRODUCTION ARCHIVE / CASE 001 ONLINE"
        title="把制作过程，也做成一份作品。"
        lead="成熟的项目档案不只放一张好看的截图。这里从真实问题出发，记录 SEKAI / 00 的目标、选择、系统与演进，也诚实保留还没有完成的部分。"
        motif="制"
        tone="amber"
        meta={[
          { label: "当前案例", value: "CASE 001 / SEKAI 00" },
          { label: "项目状态", value: "长期连载中" },
          { label: "记录原则", value: "真实证据优先" },
        ]}
      />

      <section
        className={`${styles.caseIntro} section-shell section-pad`}
        aria-labelledby="case-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / PROJECT BRIEF</p>
            <h2 id="case-title">第一份案例，就是这座正在生长的网站。</h2>
          </div>
          <p>
            没有编造客户、访问量或商业结果；只展示当前仓库里真正存在、能够继续验证的工作。
          </p>
        </div>

        <article className={styles.caseBoard}>
          <div className={styles.caseTopline}>
            <span>{projectCaseStudy.code}</span>
            <span>{projectCaseStudy.status}</span>
          </div>
          <div className={styles.caseStatement}>
            <div>
              <span>PROJECT / LONG-RUN PERSONAL SEKAI</span>
              <h3>{projectCaseStudy.title}</h3>
            </div>
            <p>{projectCaseStudy.subtitle}</p>
          </div>
          <p className={styles.caseSummary}>{projectCaseStudy.summary}</p>
          <dl className={styles.caseFacts}>
            {projectCaseStudy.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section
        className={`${styles.shiftSection} section-pad`}
        aria-labelledby="shift-title"
      >
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">02 / PROBLEM → RESPONSE</p>
              <h2 id="shift-title">不靠口号，用结构回答问题。</h2>
            </div>
            <p>每项变化都对应一个长期维护问题，而不是为了让功能清单显得更长。</p>
          </div>
          <div className={styles.shiftGrid}>
            {projectShifts.map((shift) => (
              <article className={styles[`shift-${shift.tone}`]} key={shift.index}>
                <div>
                  <span>{shift.index}</span>
                  <span>{shift.label}</span>
                </div>
                <section>
                  <span>BEFORE</span>
                  <p>{shift.before}</p>
                </section>
                <i aria-hidden="true">↓</i>
                <section>
                  <span>NOW</span>
                  <p>{shift.now}</p>
                </section>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.systemSection} section-pad`}
        aria-labelledby="system-title"
      >
        <div className="section-shell">
          <div className={`section-heading horizontal-heading ${styles.systemHeading}`}>
            <div>
              <p className="section-index">03 / SYSTEM MAP</p>
              <h2 id="system-title">内容怎样走到公开页面。</h2>
            </div>
            <p>
              平台代码被限制在边界里，内容和大部分界面保持可迁移；以后换到 Mac
              或更换部署目标，不需要重写整个世界。
            </p>
          </div>
          <ol className={styles.systemFlow}>
            {projectSystemFlow.map((node) => (
              <li key={node.index}>
                <div>
                  <span>{node.index}</span>
                  <span>{node.label}</span>
                </div>
                <h3>{node.title}</h3>
                <p>{node.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className={`${styles.chapters} section-shell section-pad`}
        aria-labelledby="chapters-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">04 / PRODUCTION REEL</p>
            <h2 id="chapters-title">
              已经连载 {productionChapters.length} 话，没有一次推倒重来。
            </h2>
          </div>
          <p>
            每一话都留下能够被下一话复用的结构；项目演进本身，就是这份案例最重要的证据。
          </p>
        </div>
        <ol className={styles.chapterReel}>
          {productionChapters.map((chapter, index) => (
            <li key={chapter.episode}>
              <div className={styles.chapterMarker}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.chapterCopy}>
                <div>
                  <span>{chapter.episode}</span>
                  <span>{chapter.evidence}</span>
                </div>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`${styles.qualitySection} section-pad`}
        aria-labelledby="quality-title"
      >
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">05 / RELEASE STANDARD</p>
              <h2 id="quality-title">“完成”必须经过四道门。</h2>
            </div>
            <p>
              这些不是装饰性的技术名词，而是每次公开版本都会重复执行的最低质量标准。
            </p>
          </div>
          <div className={styles.qualityGrid}>
            {qualityGates.map((gate) => (
              <article key={gate.code}>
                <span>{gate.code}</span>
                <h3>{gate.title}</h3>
                <p>{gate.copy}</p>
                <i aria-hidden="true">REQUIRED</i>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.decisions} section-shell section-pad`}
        aria-labelledby="decisions-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">06 / DECISION NOTES</p>
            <h2 id="decisions-title">真正影响维护成本的选择。</h2>
          </div>
          <p>
            展开查看决定与取舍；以后架构发生变化时，也会留下新的说明，而不是悄悄覆盖过去。
          </p>
        </div>
        <div className={styles.decisionList}>
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

        <aside className={styles.nextBoard} aria-labelledby="checkpoint-title">
          <span>NEXT PRODUCTION CHECKPOINTS</span>
          <h3 id="checkpoint-title">这份案例还没有结案。</h3>
          <ol>
            {nextCheckpoints.map((checkpoint, index) => (
              <li key={checkpoint}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {checkpoint}
              </li>
            ))}
          </ol>
        </aside>

        <aside className={styles.futureCase} aria-label="下一份项目案例状态">
          <div>
            <span>{futureCase.code}</span>
            <span>{futureCase.status}</span>
          </div>
          <p>{futureCase.copy}</p>
        </aside>
      </section>

      <section className="subpage-next section-shell" aria-labelledby="next-title">
        <span>NEXT FILE / COMPUTER STUDY DECK</span>
        <h2 id="next-title">制作档案说清怎么建，学习舱继续记录学到了什么。</h2>
        <a className="button button-primary" href={sitePath("/study/")}>
          打开计算机学习舱 <span aria-hidden="true">↗</span>
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
