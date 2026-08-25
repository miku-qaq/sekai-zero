"use client";

import { useEffect, useMemo, useState } from "react";
import { studyCategories, studyNotes, type StudyCategoryId } from "@/content/study";
import { sitePath } from "@/lib/site-path";
import styles from "../study/study.module.css";

type FilterId = "all" | StudyCategoryId;

/** Client-side discovery only; the notes themselves remain static and indexable. */
export function StudyNotebook() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [targetNoteId, setTargetNoteId] = useState<string | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return studyNotes.filter((note) => {
      const matchesFilter = filter === "all" || note.category === filter;
      const searchable = [
        note.title,
        note.summary,
        ...note.tags,
        ...note.sections.flatMap((section) => [
          section.heading,
          ...(section.paragraphs ?? []),
          ...(section.points ?? []),
        ]),
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN");

      return (
        matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [filter, query]);

  useEffect(() => {
    function syncHashTarget() {
      let id = "";
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }

      if (!studyNotes.some((note) => note.id === id)) return;

      // A shared URL must reveal its note even if a previous local filter hid it.
      setFilter("all");
      setQuery("");
      setTargetNoteId(id);
    }

    syncHashTarget();
    window.addEventListener("hashchange", syncHashTarget);
    return () => window.removeEventListener("hashchange", syncHashTarget);
  }, []);

  useEffect(() => {
    if (!targetNoteId) return;

    const target = document.getElementById(targetNoteId);
    if (!(target instanceof HTMLDetailsElement)) return;

    target.open = true;
    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    const highlightTimer = window.setTimeout(() => {
      setTargetNoteId((current) => (current === targetNoteId ? null : current));
    }, 2400);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(highlightTimer);
    };
  }, [targetNoteId, visibleNotes]);

  async function copyNoteLink(noteId: string) {
    const url = new URL(window.location.href);
    url.hash = noteId;

    try {
      await navigator.clipboard.writeText(url.href);
      setCopiedNoteId(noteId);
      setCopyStatus("本篇笔记链接已复制。");
    } catch {
      setCopiedNoteId(null);
      setCopyStatus("浏览器没有允许自动复制，请从地址栏复制当前链接。");
    }
  }

  return (
    <div className={styles.notebook}>
      <form
        className={styles.toolbar}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={styles.filters} role="group" aria-label="筛选学习笔记">
          {studyCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              <span>{category.shortLabel}</span>
              {category.label}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">搜索计算机学习笔记</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、概念或标签"
          />
        </label>
      </form>

      <div className={styles.resultLine}>
        <span role="status" aria-live="polite" aria-atomic="true">
          NOTES FOUND / {String(visibleNotes.length).padStart(2, "0")}
        </span>
        <span>点击标题展开完整笔记</span>
      </div>

      {visibleNotes.length > 0 ? (
        <div className={styles.noteList}>
          {visibleNotes.map((note) => (
            <details
              className={styles.note}
              id={note.id}
              data-current={note.current || undefined}
              data-targeted={targetNoteId === note.id || undefined}
              key={note.id}
            >
              <summary>
                <div className={styles.noteIndex}>
                  <span>{note.chapter}</span>
                  <time dateTime={note.updatedAt.replaceAll(".", "-")}>
                    {note.updatedAt}
                  </time>
                </div>
                <div className={styles.noteIntro}>
                  <div className={styles.noteMeta}>
                    {note.current ? (
                      <span className={styles.currentBadge}>CURRENTLY LEARNING</span>
                    ) : null}
                    <span>{note.level}</span>
                    <span>{note.readingTime}</span>
                  </div>
                  <h3>{note.title}</h3>
                  <p>{note.summary}</p>
                  <ul aria-label={`${note.title} 标签`}>
                    {note.tags.map((tag) => (
                      <li key={tag}>#{tag}</li>
                    ))}
                  </ul>
                </div>
                <span className={styles.expandIcon} aria-hidden="true">
                  ＋
                </span>
              </summary>

              <div className={styles.noteBody}>
                <div className={styles.noteActions}>
                  <button type="button" onClick={() => copyNoteLink(note.id)}>
                    {copiedNoteId === note.id ? "链接已复制" : "复制本篇链接"}
                    <span aria-hidden="true">⌁</span>
                  </button>
                  <a href={sitePath("/study/#learning-queue")}>
                    查看下一学习节点 <span aria-hidden="true">↓</span>
                  </a>
                </div>
                <div className={styles.noteSections}>
                  {note.sections.map((section) => (
                    <section key={section.heading}>
                      <h4>{section.heading}</h4>
                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.points ? (
                        <ul>
                          {section.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                      {section.code ? (
                        <div className={styles.codeBlock}>
                          <span>{section.codeLabel ?? "CODE"}</span>
                          <pre>
                            <code>{section.code}</code>
                          </pre>
                        </div>
                      ) : null}
                    </section>
                  ))}
                </div>

                <aside className={styles.recall} aria-label="主动回忆问题">
                  <span>RECALL CHECK</span>
                  <h4>先别往下查，试着回答。</h4>
                  <ol>
                    {note.recall.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </aside>

                <div className={styles.sources}>
                  <span>SOURCE CHECK</span>
                  <h4>继续向一手资料确认。</h4>
                  <ul>
                    {note.sources.map((source) => (
                      <li key={source.href}>
                        <a href={source.href} target="_blank" rel="noreferrer">
                          <span>{source.publisher}</span>
                          <strong>
                            {source.label}
                            <span className="sr-only">（将在新标签页打开）</span>
                          </strong>
                          <i aria-hidden="true">↗</i>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>NO MATCHING NOTE</span>
          <h3>这个知识坐标还没有被记录。</h3>
          <p>换一个关键词，或者回到“全部笔记”继续浏览。</p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
          >
            清除筛选
          </button>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copyStatus}
      </p>
    </div>
  );
}
