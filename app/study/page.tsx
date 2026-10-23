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
        lead="自学 CS224N，回顾 CS231n。用例子、实验与回忆题，记下自己的理解。"
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
              <h2 id="archive-title">学习笔记</h2>
            </div>
            <p>解释、例子、回忆题与来源，都在笔记里。</p>
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
            <h2 id="protocol-title">我的笔记方法</h2>
          </div>
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
