"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { animeCatalog } from "@/content/anime";
import { sitePath } from "@/lib/site-path";
import styles from "./anime.module.css";

type AnimeCatalogEntry = {
  id: string;
  title: string;
  image: string;
  year?: number | string | null;
  format?: string | null;
  status: string;
  source: {
    label: string;
    url: string;
  };
};

const entries = animeCatalog as readonly AnimeCatalogEntry[];
const ALL = "all";

function yearFor(entry: AnimeCatalogEntry) {
  if (typeof entry.year === "number" && Number.isFinite(entry.year)) {
    return String(entry.year);
  }
  return typeof entry.year === "string" && entry.year.trim()
    ? entry.year.trim()
    : "年份待补充";
}

function formatFor(entry: AnimeCatalogEntry) {
  return entry.format?.trim() || "类型待补充";
}

function watchedStatus(status: string) {
  const value = status.trim();
  const normalized = value.toLocaleLowerCase("zh-CN");
  return ["watched", "completed", "complete", "看过"].includes(normalized)
    ? "已看"
    : value || "已看";
}

function byNewest(left: string, right: string) {
  if (left === "年份待补充") return 1;
  if (right === "年份待补充") return -1;
  return right.localeCompare(left, "zh-CN", {
    numeric: true,
    sensitivity: "base",
  });
}

/** Client-side discovery only; every catalog card remains in the initial HTML. */
export function AnimeCatalog() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState(ALL);
  const [year, setYear] = useState(ALL);

  const formats = useMemo(
    () =>
      [...new Set(entries.map(formatFor))].sort((left, right) =>
        left.localeCompare(right, "zh-CN"),
      ),
    [],
  );

  const years = useMemo(() => [...new Set(entries.map(yearFor))].sort(byNewest), []);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return entries.filter((entry) => {
      const entryFormat = formatFor(entry);
      const entryYear = yearFor(entry);
      const searchable = [entry.title, entryFormat, entryYear]
        .join(" ")
        .toLocaleLowerCase("zh-CN");

      return (
        (format === ALL || entryFormat === format) &&
        (year === ALL || entryYear === year) &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [format, query, year]);

  const hasActiveFilters = query.trim() !== "" || format !== ALL || year !== ALL;

  function resetFilters() {
    setQuery("");
    setFormat(ALL);
    setYear(ALL);
  }

  return (
    <div className={styles.catalog}>
      <form
        className={styles.toolbar}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className={styles.search}>
          <span>搜索收藏</span>
          <span className={styles.searchField}>
            <i aria-hidden="true">⌕</i>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索正式作品名"
            />
          </span>
        </label>

        <label className={styles.selectField}>
          <span>作品类型</span>
          <select value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value={ALL}>全部类型</option>
            {formats.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField}>
          <span>作品年份</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value={ALL}>全部年份</option>
            {years.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          className={styles.reset}
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          清除筛选
        </button>
      </form>

      <div className={styles.resultLine}>
        <p role="status" aria-live="polite" aria-atomic="true">
          显示 <strong>{String(visibleEntries.length).padStart(2, "0")}</strong> /{" "}
          {String(entries.length).padStart(2, "0")} 部
        </p>
        <span>WATCHED COLLECTION · NO RATING</span>
      </div>

      {visibleEntries.length > 0 ? (
        <ol className={styles.catalogGrid}>
          {visibleEntries.map((entry, index) => {
            const status = watchedStatus(entry.status);
            const titleId = `anime-${entry.id}-title`;

            return (
              <li key={entry.id}>
                <article className={styles.card} aria-labelledby={titleId}>
                  <div className={styles.cover}>
                    <Image
                      src={sitePath(entry.image)}
                      alt={`${entry.title} 的动画封面`}
                      width={640}
                      height={960}
                      sizes="(max-width: 420px) 44vw, (max-width: 760px) 46vw, (max-width: 1200px) 30vw, 260px"
                      loading="lazy"
                      unoptimized
                    />
                    <span className={styles.cardIndex} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.status} aria-label={`观看状态：${status}`}>
                      <i aria-hidden="true">✓</i> {status}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span>{formatFor(entry)}</span>
                      <span>{yearFor(entry)}</span>
                    </div>
                    <h3 id={titleId}>{entry.title}</h3>
                    <a
                      className={styles.sourceLink}
                      href={entry.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.source.label} 资料来源
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only">（将在新标签页打开）</span>
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">NO MATCHING ANIME</span>
          <h3>这组条件下还没有作品。</h3>
          <p>换个关键词或年份试试，也可以恢复完整收藏墙。</p>
          <button type="button" onClick={resetFilters}>
            清除全部筛选
          </button>
        </div>
      )}
    </div>
  );
}
