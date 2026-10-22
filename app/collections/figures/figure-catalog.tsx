"use client";

import Image from "next/image";
import catalogStyles from "../catalog.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { figureCollection, type FigureCollectionEntry } from "@/content/figures";
import { sitePath } from "@/lib/site-path";
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

  const [selected, setSelected] = useState<FigureCollectionEntry | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return figureCollection.filter((entry) => {
      const matchesGroup =
        filter === "all" ||
        (filter === "miku" && entry.character === "初音未来") ||
        (filter === "others" && entry.character !== "初音未来");
      const searchable =
        `${entry.character} ${entry.work} ${entry.product?.title ?? ""} ${entry.product?.manufacturer ?? ""}`.toLocaleLowerCase(
          "zh-CN",
        );

      return matchesGroup && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, query]);

  const hasActiveFilters = filter !== "all" || query.trim() !== "";

  function resetFilters() {
    setFilter("all");
    setQuery("");
  }

  return (
    <div className={catalogStyles.catalog} data-catalog="figures">
      <div className={catalogStyles.catalogControls}>
        <form
          className={catalogStyles.toolbar}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={catalogStyles.search}>
            <span>搜索角色、作品或款式</span>
            <span className={catalogStyles.searchField}>
              <i aria-hidden="true">⌕</i>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：初音未来、赛车、TAITO"
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
            <button
              className={catalogStyles.reset}
              type="button"
              onClick={resetFilters}
            >
              清除筛选
            </button>
          ) : null}
        </form>

        <div className={catalogStyles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            当前展示 <strong>{String(visibleEntries.length).padStart(2, "0")}</strong> /
            总计 {String(figureCollection.length).padStart(2, "0")} 件
          </p>
          <span>点击图片，查看收藏细节</span>
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <ol
          className={styles.grid}
          aria-label={`${figureCollection.length} 件手办收藏`}
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
                  <div className={styles.visual}>
                    {entry.product?.image ? (
                      <button
                        type="button"
                        className={styles.photoButton}
                        onClick={() => setSelected(entry)}
                        aria-label={`查看大图：${entry.product.title}`}
                        aria-haspopup="dialog"
                      >
                        <Image
                          src={sitePath(entry.product.image)}
                          alt={entry.product.imageAlt ?? entry.product.title}
                          width={800}
                          height={900}
                          sizes="(max-width: 600px) 90vw, (max-width: 1120px) 30vw, 24vw"
                          loading="lazy"
                          unoptimized
                        />
                        <span className={styles.zoomHint} aria-hidden="true">
                          查看大图 ↗
                        </span>
                      </button>
                    ) : (
                      <div className={styles.orbit} aria-hidden="true">
                        <strong>{entry.motif}</strong>
                      </div>
                    )}
                    <span className={styles.recordId}>FIG / {number}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 id={titleId}>{entry.character}</h3>
                    {entry.product ? (
                      <p className={styles.variant}>{entry.product.title}</p>
                    ) : null}
                    <dl>
                      <div>
                        <dt>作品</dt>
                        <dd>{entry.work}</dd>
                      </div>
                      <div>
                        <dt>厂商</dt>
                        <dd>{entry.product?.manufacturer ?? "待补充"}</dd>
                      </div>
                      {entry.product?.scale ? (
                        <div>
                          <dt>比例</dt>
                          <dd>{entry.product.scale}</dd>
                        </div>
                      ) : null}
                    </dl>

                    {entry.product ? (
                      <a
                        href={entry.product.productUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        商品资料 <span aria-hidden="true">↗</span>
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
        <div className={catalogStyles.empty}>
          <span aria-hidden="true">NO MATCHING FIGURE</span>
          <h3>没有找到对应的收藏。</h3>
          <p>换一个角色、作品或款式名称，也可以恢复完整展柜。</p>
          <button
            className="button button-primary"
            type="button"
            onClick={resetFilters}
          >
            查看全部手办
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-labelledby="figure-preview-title"
        onClose={() => setSelected(null)}
      >
        {selected?.product ? (
          <>
            <div className={styles.lightboxHeading}>
              <div>
                <h2 id="figure-preview-title">{selected.product.title}</h2>
                <p>
                  {selected.product.manufacturer}
                  {selected.product.scale ? ` · ${selected.product.scale}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="关闭大图"
              >
                ×
              </button>
            </div>
            {selected.product.image ? (
              <Image
                src={sitePath(selected.product.image)}
                alt={selected.product.imageAlt ?? selected.product.title}
                width={800}
                height={900}
                unoptimized
              />
            ) : null}
            <p className={styles.lightboxNote}>商品展示图 · 非本人实拍</p>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
