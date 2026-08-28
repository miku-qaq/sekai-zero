"use client";

import Image from "next/image";
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
    <div className={styles.catalog}>
      <div className={styles.catalogControls}>
        <form
          className={styles.toolbar}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={styles.search}>
            <span>搜索 Steam 收藏</span>
            <span className={styles.searchField}>
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
            <button className={styles.reset} type="button" onClick={resetSearch}>
              清除搜索
            </button>
          ) : null}
        </form>

        <div className={styles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            已展示 <strong>{String(visibleGames.length).padStart(3, "0")}</strong> /
            找到 {String(filteredGames.length).padStart(3, "0")} / 总计{" "}
            {String(gameCatalog.length).padStart(3, "0")} 款
          </p>
          <span>PLAYED ON STEAM · NO PLAYTIME · NO RANKING</span>
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <>
          <ol className={styles.catalogGrid}>
            {visibleGames.map((game, index) => {
              const titleId = `${game.id}-title`;

              return (
                <li key={game.id}>
                  <article className={styles.card} aria-labelledby={titleId}>
                    <div className={styles.cover}>
                      {game.image ? (
                        <Image
                          src={sitePath(game.image)}
                          alt={`${game.title} 的 Steam 游戏封面`}
                          width={420}
                          height={630}
                          sizes="(max-width: 420px) 44vw, (max-width: 760px) 46vw, (max-width: 1200px) 30vw, 240px"
                          loading="lazy"
                          unoptimized
                        />
                      ) : (
                        <div className={styles.coverFallback} aria-hidden="true">
                          <span>STEAM</span>
                          <strong>{coverInitial(game.title)}</strong>
                          <i>封面待缓存</i>
                        </div>
                      )}
                      <span className={styles.cardIndex} aria-hidden="true">
                        {String(index + 1).padStart(3, "0")}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 id={titleId}>{game.title}</h3>
                      <a
                        href={game.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`在 Steam 商店查看 ${game.title}（将在新标签页打开）`}
                      >
                        查看官方商店页 <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          {remaining > 0 ? (
            <div className={styles.loadMore}>
              <p>还有 {remaining} 款游戏尚未展开。</p>
              <button
                type="button"
                onClick={() => setVisibleLimit((limit) => limit + PAGE_SIZE)}
              >
                再展开 {Math.min(PAGE_SIZE, remaining)} 款
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">NO MATCHING GAME</span>
          <h3>没有找到对应的游戏。</h3>
          <p>检查一下名称，或恢复完整的 Steam 收藏。</p>
          <button type="button" onClick={resetSearch}>
            清除搜索
          </button>
        </div>
      )}
    </div>
  );
}
