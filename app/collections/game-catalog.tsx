"use client";

import Image from "next/image";
import catalogStyles from "./catalog.module.css";
import { useMemo, useState } from "react";
import { gameCatalog } from "@/content/games";
import { sitePath } from "@/lib/site-path";
import styles from "./games.module.css";

const PAGE_SIZE = 24;

function coverInitial(title: string) {
  return title.match(/[\p{Letter}\p{Number}]/u)?.[0]?.toLocaleUpperCase("zh-CN") ?? "G";
}

/** Client-side search and progressive reveal; catalog truth stays in content/. */
export function GameCatalog() {
  const [query, setQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    if (!normalizedQuery) return gameCatalog;

    return gameCatalog.filter((game) =>
      game.title.toLocaleLowerCase("zh-CN").includes(normalizedQuery),
    );
  }, [query]);

  const visibleGames = filteredGames.slice(0, visibleLimit);
  const remaining = Math.max(filteredGames.length - visibleGames.length, 0);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleLimit(PAGE_SIZE);
  }

  function resetSearch() {
    setQuery("");
    setVisibleLimit(PAGE_SIZE);
  }

  return (
    <div className={catalogStyles.catalog} data-catalog="games">
      <div className={catalogStyles.catalogControls}>
        <form
          className={catalogStyles.toolbar}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={catalogStyles.search}>
            <span>搜索游戏</span>
            <span className={catalogStyles.searchField}>
              <i aria-hidden="true">⌕</i>
              <input
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="输入游戏名称"
              />
            </span>
          </label>
          {query.trim() ? (
            <button className={catalogStyles.reset} type="button" onClick={resetSearch}>
              清除搜索
            </button>
          ) : null}
        </form>

        <div className={catalogStyles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            已显示 <strong>{visibleGames.length}</strong> / {filteredGames.length} 款
            {query.trim() ? ` · 共 ${gameCatalog.length} 款` : null}
          </p>
          <span>点击封面，前往 Steam 商店 ↗</span>
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <>
          <ol className={catalogStyles.catalogGrid}>
            {visibleGames.map((game, index) => {
              const titleId = `${game.id}-title`;

              return (
                <li key={game.id}>
                  <article className={styles.card} aria-labelledby={titleId}>
                    <a
                      className={styles.cover}
                      href={game.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`在 Steam 商店查看 ${game.title}（将在新标签页打开）`}
                    >
                      {game.image ? (
                        <Image
                          src={sitePath(game.image)}
                          alt={`${game.title} 的 Steam 游戏封面`}
                          width={420}
                          height={630}
                          sizes="(max-width: 340px) 88vw, (max-width: 700px) 44vw, (max-width: 960px) 29vw, (max-width: 1180px) 22vw, 184px"
                          loading="lazy"
                          unoptimized
                        />
                      ) : (
                        <div className={styles.coverFallback} aria-hidden="true">
                          <span>STEAM</span>
                          <strong>{coverInitial(game.title)}</strong>
                          <i>封面待补充</i>
                        </div>
                      )}
                      <span className={styles.cardIndex} aria-hidden="true">
                        {String(index + 1).padStart(3, "0")}
                      </span>
                    </a>

                    <div className={styles.cardBody}>
                      <h3 id={titleId}>{game.title}</h3>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          {remaining > 0 ? (
            <div className={catalogStyles.loadMore}>
              <p>剩余 {remaining} 款</p>
              <div className={catalogStyles.loadMoreActions}>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => setVisibleLimit((limit) => limit + PAGE_SIZE)}
                >
                  展开 {Math.min(PAGE_SIZE, remaining)} 款
                </button>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => setVisibleLimit(filteredGames.length)}
                >
                  展开全部
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className={catalogStyles.empty}>
          <h3>未找到游戏</h3>
          <p>换个关键词试试。</p>
          <button className="button button-primary" type="button" onClick={resetSearch}>
            清除搜索
          </button>
        </div>
      )}
    </div>
  );
}
