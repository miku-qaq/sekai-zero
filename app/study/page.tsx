import type { Metadata } from "next";
import { studyNotes, studyPrinciples, studyQueue } from "@/content/study";
import { sitePath } from "@/lib/site-path";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import { StudyNotebook } from "../components/study-notebook";
import styles from "./study.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "计算机学习舱",
  description:
    "Mikureina 的计算机学习笔记：正在自学 Stanford CS224N 公开课程资料，并用知识地图、最小实验与主动回忆整理 NLP、基础、编程、Web 与开发工具。",
  openGraph: {
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "正在自学 Stanford CS224N 公开课程资料；把 NLP 与计算机概念整理成可以反复返回、搜索与验证的知识地图。",
    images: [{ url: "og-study.png", alt: "SEKAI / 00 计算机学习舱分享卡片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "正在自学 Stanford CS224N 公开课程资料；把 NLP 与计算机概念整理成可以反复返回、搜索与验证的知识地图。",
    images: ["og-study.png"],
  },
};

export default function StudyPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.studyPage}`}>
      <PageMasthead
        episode="FILE 04"
        eyebrow="COMPUTER STUDY DECK / CS224N SIGNAL ONLINE"
        title="把学到的东西，整理成可以返回的地图。"
        lead="最近正在自学 Stanford CS224N 的公开课程资料。这里不复制一整份 syllabus 假装学完，而是从 NLP 的清晰主线出发，配合最小实验和主动回忆，把真正理解的概念逐篇连接起来。"
        motif="学"
        tone="blue"
        meta={[
          {
            label: "当前笔记",
            value: `${String(studyNotes.length).padStart(2, "0")} ENTRIES`,
          },
          { label: "当前主线", value: "Stanford CS224N / NLP" },
          { label: "更新方式", value: "自学中 / 理解后再整理" },
        ]}
      />

      <section
        className={`${styles.protocol} section-shell section-pad`}
        aria-labelledby="protocol-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / LEARNING PROTOCOL</p>
            <h2 id="protocol-title">不是抄答案，而是建立自己的模型。</h2>
          </div>
          <p>
            每篇笔记采用同一套整理方式，方便以后添加操作系统、网络、算法与更多编程语言。
          </p>
        </div>
        <div className={styles.principleGrid}>
          {studyPrinciples.map((principle) => (
            <article key={principle.index}>
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.archive} aria-labelledby="archive-title">
        <div className="section-shell section-pad">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">02 / KNOWLEDGE ARCHIVE</p>
              <h2 id="archive-title">计算机学习笔记。</h2>
            </div>
            <p>
              按频道筛选或直接搜索概念；展开笔记后，可以查看主线、例子、易错边界与回忆问题。
            </p>
          </div>
          <StudyNotebook />
        </div>
      </section>

      <section className={`${styles.queue} section-pad`} aria-labelledby="queue-title">
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">03 / LEARNING QUEUE</p>
              <h2 id="queue-title">接下来准备点亮的知识区域。</h2>
            </div>
            <p>
              这些是内容计划，不代表已经学完；只有完成理解、实验与复述后，才会进入正式笔记区。
            </p>
          </div>
          <ol className={styles.queueList}>
            {studyQueue.map((item) => (
              <li key={item.order}>
                <span>{item.order}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.scope}</p>
                </div>
                <i aria-hidden="true">○</i>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="subpage-next section-shell" aria-labelledby="next-title">
        <span>STUDY LOG / CONTINUE THE TIMELINE</span>
        <h2 id="next-title">学习内容会持续增长，每次整理也会留下版本记录。</h2>
        <a className="button button-primary" href={sitePath("/logs/")}>
          查看世界线日志 <span aria-hidden="true">↗</span>
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
