"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { studyNotes } from "@/content/study";
import { drawResearchQuestion } from "@/lib/research-prompt";
import { sitePath } from "@/lib/site-path";
import styles from "./research-prompt.module.css";

const researchNote = studyNotes.find(
  (note) => note.id === "distributed-training-questions",
);
const questions =
  researchNote?.sections.flatMap((section) => section.points ?? []) ?? [];

/** An invitation to think, drawn only from the owner's existing research outline. */
export function ResearchPrompt({ onOpen }: { onOpen: (noteId: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const remaining = useRef<number[]>([]);
  const current = useRef<number | null>(null);

  function draw() {
    const next = drawResearchQuestion(
      questions.length,
      current.current,
      remaining.current,
    );
    if (!next) return;
    remaining.current = next.remaining;
    current.current = next.index;
    setSelected(next.index);
  }

  if (!researchNote || !questions.length) return null;

  return (
    <section className={styles.prompt} aria-labelledby="research-prompt-title">
      <div className={styles.intro}>
        <div className={styles.character} aria-hidden="true">
          <Image
            src={sitePath("/characters/companions/miku-v1.webp")}
            alt=""
            width={512}
            height={512}
            sizes="80px"
          />
        </div>
        <div>
          <span className={styles.label}>RESEARCH / {questions.length}</span>
          <h3 id="research-prompt-title">留一个问题给今天。</h3>
          <p>从正在研究的问题里，抽一张便签。</p>
        </div>
      </div>

      <div className={styles.paper}>
        <div
          className={styles.question}
          key={selected ?? "unopened"}
          data-revealed={selected !== null || undefined}
        >
          <span className={styles.number} aria-hidden="true">
            {selected === null ? "?" : String(selected + 1).padStart(2, "0")}
          </span>
          <p>{selected === null ? "今天，想从哪里开始？" : questions[selected]}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.draw} type="button" onClick={draw}>
            {selected === null ? "抽一道研究问题" : "再抽一道"}
          </button>
          {selected !== null ? (
            <a
              href={sitePath(`/study/#${researchNote.id}`)}
              onClick={() => onOpen(researchNote.id)}
            >
              查看研究笔记
            </a>
          ) : null}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {selected === null ? "" : `问题 ${selected + 1}：${questions[selected]}`}
      </span>
    </section>
  );
}
