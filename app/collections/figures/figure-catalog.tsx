"use client";

import { useMemo, useState } from "react";
import { figureCollection } from "@/content/figures";
import styles from "./figures.module.css";

type FigureFilter = "all" | "miku" | "others";

const filters: readonly {
  id: FigureFilter;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "全部藏品", count: figureCollection.length },
  {
    id: "miku",
    label: "初音未来",
    count: figureCollection.filter((entry) => entry.character === "初音未来").length,
  },
  {
    id: "others",
    label: "其他角色",
    count: figureCollection.filter((entry) => entry.character !== "初音未来").length,
  },
];

/** Preserve the screenshot-era record number even after figure-003 moved rooms. */
function recordNumber(id: string) {
  return id.replace("figure-", "");
}

/** A small client island keeps discovery interactive without moving inventory truth. */
export function FigureCatalog() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FigureFilter>("all");

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return figureCollection.filter((entry) => {
      const matchesGroup =
        filter === "all" ||
        (filter === "miku" && entry.character === "初音未来") ||
        (filter === "others" && entry.character !== "初音未来");
      const searchable = `${entry.character} ${entry.work}`.toLocaleLowerCase("zh-CN");

      return matchesGroup && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, query]);

  const hasActiveFilters = filter !== "all" || query.trim() !== "";

  function resetFilters() {
    setFilter("all");
    setQuery("");
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
            <span>搜索角色或作品</span>
            <span className={styles.searchField}>
              <i aria-hidden="true">⌕</i>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：初音未来、游戏人生"
              />
            </span>
          </label>

          <div className={styles.filterGroup} role="group" aria-label="筛选手办角色">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                <span>{item.label}</span>
                <b>{String(item.count).padStart(2, "0")}</b>
              </button>
            ))}
          </div>

          {hasActiveFilters ? (
            <button className={styles.reset} type="button" onClick={resetFilters}>
              清除筛选
            </button>
          ) : null}
        </form>

        <div className={styles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            当前展示 <strong>{String(visibleEntries.length).padStart(2, "0")}</strong> /
            总计 {String(figureCollection.length).padStart(2, "0")} 件
          </p>
          <span>{figureCollection.length} CHARACTER &amp; WORK RECORDS VERIFIED</span>
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <ol
          className={styles.grid}
          aria-label={`${figureCollection.length} 件手办收藏核对目录`}
        >
          {visibleEntries.map((entry) => {
            const titleId = `${entry.id}-title`;
            const number = recordNumber(entry.id);

            return (
              <li key={entry.id}>
                <article
                  className={styles.card}
                  data-tone={entry.tone}
                  data-miku={entry.character === "初音未来" || undefined}
                  aria-labelledby={titleId}
                >
                  <div className={styles.visual} aria-hidden="true">
                    <span className={styles.recordId}>FIG / {number}</span>
                    <span className={styles.workTag}>{entry.work}</span>
                    <div className={styles.orbit}>
                      <i />
                      <strong>{entry.motif}</strong>
                    </div>
                    <b className={styles.shelfMark}>SEKAI / SHELF {number}</b>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.verifyLine}>
                      <span aria-hidden="true">●</span> 角色已核对
                    </p>
                    <h3 id={titleId}>{entry.character}</h3>
                    <dl>
                      <div>
                        <dt>作品</dt>
                        <dd>{entry.work}</dd>
                      </div>
                      <div>
                        <dt>类型</dt>
                        <dd>{entry.format}</dd>
                      </div>
                    </dl>

                    {entry.product ? (
                      <a
                        href={entry.product.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {entry.product.title} <span aria-hidden="true">↗</span>
                        <span className="sr-only">（将在新标签页打开）</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">NO MATCHING FIGURE</span>
          <h3>没有找到对应的收藏。</h3>
          <p>换一个角色或作品名称，也可以恢复完整展柜。</p>
          <button type="button" onClick={resetFilters}>
            查看全部手办
          </button>
        </div>
      )}
    </div>
  );
}
