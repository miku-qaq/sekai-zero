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
  source: {
    label: string;
    url: string;
  };
};

const entries = animeCatalog as readonly AnimeCatalogEntry[];
const ALL = "all";
const PAGE_SIZE = 24;

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

function byNewest(left: string, right: string) {
  if (left === "年份待补充") return 1;
  if (right === "年份待补充") return -1;
  return right.localeCompare(left, "zh-CN", {
    numeric: true,
    sensitivity: "base",
  });
}

/** Client-side discovery with a small initial batch and progressive reveal. */
export function AnimeCatalog() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

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
  const displayedEntries = visibleEntries.slice(0, visibleLimit);
  const remaining = Math.max(visibleEntries.length - displayedEntries.length, 0);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleLimit(PAGE_SIZE);
  }

  function updateFormat(value: string) {
    setFormat(value);
    setVisibleLimit(PAGE_SIZE);
  }

  function updateYear(value: string) {
    setYear(value);
    setVisibleLimit(PAGE_SIZE);
  }

  function resetFilters() {
    setQuery("");
    setFormat(ALL);
    setYear(ALL);
    setVisibleLimit(PAGE_SIZE);
  }

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogControls}>
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
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="搜索正式作品名"
              />
            </span>
          </label>

          <label className={styles.selectField}>
            <span>作品类型</span>
            <select
              value={format}
              onChange={(event) => updateFormat(event.target.value)}
            >
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
            <select value={year} onChange={(event) => updateYear(event.target.value)}>
              <option value={ALL}>全部年份</option>
              {years.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {hasActiveFilters ? (
            <button className={styles.reset} type="button" onClick={resetFilters}>
              清除筛选
            </button>
          ) : null}
        </form>

        <div className={styles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            已展示 <strong>{String(displayedEntries.length).padStart(2, "0")}</strong> /
            找到 {String(visibleEntries.length).padStart(2, "0")} / 总计{" "}
            {String(entries.length).padStart(2, "0")} 部
          </p>
          <span>WATCHED COLLECTION · NO RATING</span>
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <>
          <ol className={styles.catalogGrid}>
            {displayedEntries.map((entry, index) => {
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
                        查看 {entry.source.label} 资料
                        <span aria-hidden="true">↗</span>
                        <span className="sr-only">（将在新标签页打开）</span>
                      </a>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
          {remaining > 0 ? (
            <div className={styles.loadMore}>
              <p>还有 {remaining} 部动画尚未展开。</p>
              <button
                type="button"
                onClick={() => setVisibleLimit((limit) => limit + PAGE_SIZE)}
              >
                再展开 {Math.min(PAGE_SIZE, remaining)} 部
              </button>
            </div>
          ) : null}
        </>
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
