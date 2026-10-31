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
    "Mikureina 的学习笔记：整理大模型分布式训练系统，从 Transformer、多维并行、MoE 与 Parallel Folding，到自动并行策略和 GPU/NPU 性能实验。保留 CS224N 与 CS231n 笔记。",
  openGraph: {
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "大模型分布式训练系统：八个学习主题、十二个研究问题，连接 Transformer、并行训练、MoE 与工程实验。",
    images: [{ url: "og-study.png", alt: "SEKAI / 00 计算机学习舱分享卡片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "计算机学习舱 · SEKAI / 00",
    description:
      "大模型分布式训练系统：八个学习主题、十二个研究问题，连接 Transformer、并行训练、MoE 与工程实验。",
    images: ["og-study.png"],
  },
};

export default function StudyPage() {
  return (
    <main id="main-content" className={`subpage-main ${styles.studyPage}`}>
      <PageMasthead
        currentHref="/study/"
        title="把所学，记成自己的理解。"
        lead="最近在学大模型分布式训练系统。从计算原理到并行策略，再到源码与性能实验。"
        meta={[
          {
            label: "当前笔记",
            value: `${String(studyNotes.length).padStart(2, "0")} ENTRIES`,
          },
          { label: "当前主线", value: "大模型分布式训练系统" },
        ]}
      />

      <section className={styles.archive} aria-labelledby="archive-title">
        <div className="section-shell section-pad">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">01 / STUDY NOTES</p>
              <h2 id="archive-title">学习笔记</h2>
            </div>
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
