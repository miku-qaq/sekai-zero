import type { Metadata } from "next";
import { studyNotes, studyPrinciples } from "@/content/study";
import { JourneyNavigation } from "../components/journey-navigation";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";
import { StudyNotebook } from "../components/study-notebook";
import styles from "./study.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "计算机学习笔记",
  description:
    "Mikureina 的计算机学习笔记：正在自学 Stanford CS224N，也回顾此前学习过的 Stanford CS231n，持续整理自然语言处理、计算机视觉与计算机基础。",
  openGraph: {
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "正在自学 Stanford CS224N，也回顾此前学习过的 CS231n；把视觉、语言与计算机基础整理成可以反复返回的知识地图。",
    images: [{ url: "og-study.png", alt: "SEKAI / 00 计算机学习舱分享卡片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "正在自学 Stanford CS224N，也回顾此前学习过的 CS231n；把视觉、语言与计算机基础整理成可以反复返回的知识地图。",
    images: ["og-study.png"],
  },
};

export default function StudyPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.studyPage}`}>
      <PageMasthead
        currentHref="/study/"
        title="把学到的东西，整理成可以返回的地图。"
        lead="当前正在自学 Stanford CS224N 的公开课程资料，也会回顾此前学习过的 CS231n。这里不把课程目录包装成个人完成度，而是用知识地图、最小实验与主动回忆，整理真正理解过的内容。"
        meta={[
          {
            label: "当前笔记",
            value: `${String(studyNotes.length).padStart(2, "0")} ENTRIES`,
          },
          { label: "当前主线", value: "Stanford CS224N / NLP" },
          { label: "更新方式", value: "自学中 / 理解后再整理" },
        ]}
      />

      <section className={styles.archive} aria-labelledby="archive-title">
        <div className="section-shell section-pad">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">01 / STUDY NOTES</p>
              <h2 id="archive-title">先读已经整理好的笔记。</h2>
            </div>
            <p>
              按分类筛选或直接搜索概念；展开后可以查看解释、例子、易错边界、回忆问题与一手来源。
            </p>
          </div>
          <StudyNotebook />
        </div>
      </section>

      <section
        className={`${styles.protocol} section-shell section-pad`}
        aria-labelledby="protocol-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">02 / HOW I TAKE NOTES</p>
            <h2 id="protocol-title">每篇笔记怎样整理。</h2>
          </div>
          <p>
            目前收录 AI、计算机视觉与 NLP，以及 Web、Git、TypeScript
            和编码基础；所有笔记都保留摘要、回忆题与一手来源。
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

      <JourneyNavigation currentHref="/study/" />
      <SiteFooter />
    </main>
  );
}
