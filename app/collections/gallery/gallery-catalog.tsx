"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { collectionItems } from "@/content/collection-items";
import { collectionExhibitions } from "@/content/exhibitions";
import { sitePath } from "@/lib/site-path";
import { CollectionLightbox } from "../collection-lightbox";
import styles from "./gallery.module.css";

const PAGE_SIZE = 24;
const URL_EVENT = "sekai-gallery-url";
const itemsById = new Map(collectionItems.map((item) => [item.id, item]));
const rooms = [
  { id: "all", label: "全部" },
  { id: "anime", label: "动画" },
  { id: "games", label: "游戏" },
  { id: "figures", label: "手办" },
  { id: "fufu", label: "Fufu" },
  { id: "controllers", label: "手柄" },
] as const;

function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

function readUrl() {
  return window.location.search;
}

function serverUrl() {
  return "";
}

/** 地址是筛选状态的来源：静态导出无需服务端读取查询参数。 */
function updateUrl(changes: Record<string, string | null>, open = false) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  const state = { ...window.history.state };
  if (open) state.sekaiGalleryModal = window.location.pathname;
  else if (changes.item === null) delete state.sekaiGalleryModal;
  window.history[open ? "pushState" : "replaceState"](state, "", url);
  window.dispatchEvent(new Event(URL_EVENT));
}

export function GalleryCatalog() {
  const roomTabsRef = useRef<HTMLDivElement>(null);
  const search = useSyncExternalStore(subscribeUrl, readUrl, serverUrl);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const room = rooms.find((entry) => entry.id === params.get("room"))?.id ?? "all";
  const exhibition = collectionExhibitions.find(
    (entry) => entry.id === params.get("exhibit"),
  );
  const query = params.get("q") ?? "";
  const selected = itemsById.get(params.get("item") ?? "");
  const filterKey = `${room}|${exhibition?.id ?? ""}|${query}`;
  const [reveal, setReveal] = useState({ key: "", limit: PAGE_SIZE });

  useEffect(() => {
    const tabs = roomTabsRef.current;
    if (!tabs) return;

    function revealCurrentRoom() {
      if (!tabs || tabs.scrollWidth <= tabs.clientWidth) return;
      const current = tabs.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!current) return;
      const tabBounds = tabs.getBoundingClientRect();
      const currentBounds = current.getBoundingClientRect();
      if (
        currentBounds.left >= tabBounds.left &&
        currentBounds.right <= tabBounds.right
      )
        return;
      // 仅横向移动分类栏；深链或屏幕变窄时仍能看见当前分类。
      tabs.scrollLeft +=
        currentBounds.left -
        tabBounds.left -
        (tabs.clientWidth - currentBounds.width) / 2;
    }

    revealCurrentRoom();
    const observer = new ResizeObserver(revealCurrentRoom);
    observer.observe(tabs);
    return () => observer.disconnect();
  }, [room]);

  const filtered = useMemo(() => {
    const words = query.trim().toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean);
    const orderedItems = exhibition
      ? exhibition.items.flatMap((id) => {
          const item = itemsById.get(id);
          return item ? [item] : [];
        })
      : collectionItems;
    return orderedItems.filter((item) => {
      if (room !== "all" && item.room !== room) return false;
      const searchable = [item.title, item.subtitle, ...item.keywords]
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      return words.every((word) => searchable.includes(word));
    });
  }, [room, exhibition, query]);

  const selectedIndex = filtered.findIndex((entry) => entry.id === selected?.id);
  const selectionLimit = Math.ceil((selectedIndex + 1) / PAGE_SIZE) * PAGE_SIZE;
  const visibleLimit = Math.max(
    reveal.key === filterKey ? reveal.limit : PAGE_SIZE,
    selectionLimit,
  );
  const visibleItems = filtered.slice(0, visibleLimit);
  const remaining = filtered.length - visibleItems.length;
  const hasFilters = room !== "all" || Boolean(exhibition) || Boolean(query);
  // 即使有人手动拼出互相冲突的查询参数，指定的藏品仍能独立打开。
  const lightboxItems = selected && selectedIndex < 0 ? [selected] : filtered;

  function resetFilters() {
    setReveal({ key: "", limit: PAGE_SIZE });
    updateUrl({ room: null, exhibit: null, q: null, item: null });
  }

  function closeLightbox() {
    setReveal({ key: filterKey, limit: visibleLimit });
    if (window.history.state?.sekaiGalleryModal === window.location.pathname) {
      window.history.back();
    } else {
      updateUrl({ item: null });
    }
  }

  return (
    <div className={styles.gallery} data-catalog="gallery">
      <div className={styles.controls}>
        <div
          ref={roomTabsRef}
          className={styles.roomTabs}
          role="group"
          aria-label="画册分类"
        >
          {rooms.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={entry.id === room}
              onClick={() =>
                updateUrl({ room: entry.id === "all" ? null : entry.id, item: null })
              }
            >
              {entry.label}
            </button>
          ))}
        </div>
        <form
          className={styles.searchRow}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={styles.searchField}>
            <span className="sr-only">搜索收藏画册</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) =>
                updateUrl({ q: event.target.value || null, item: null })
              }
              placeholder="搜索名称、角色或作品"
            />
          </label>
          <label className={styles.exhibitionField}>
            <span className="sr-only">主题小展</span>
            <select
              value={exhibition?.id ?? ""}
              onChange={(event) =>
                updateUrl({ exhibit: event.target.value || null, item: null })
              }
            >
              <option value="">全部主题</option>
              {collectionExhibitions.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
          {hasFilters ? (
            <button className={styles.clear} type="button" onClick={resetFilters}>
              清空
            </button>
          ) : null}
        </form>
        <div className={styles.resultLine}>
          <p role="status" aria-live="polite" aria-atomic="true">
            <strong>{visibleItems.length}</strong> / {filtered.length} 件
          </p>
          <span>{exhibition?.title ?? "点击图片，翻看大图"}</span>
        </div>
      </div>

      {filtered.length ? (
        <>
          <ol className={styles.grid} aria-label="收藏图片">
            {visibleItems.map((item) => (
              <li key={item.id}>
                <button
                  className={styles.card}
                  type="button"
                  onClick={() => updateUrl({ item: item.id }, true)}
                  aria-label={`查看${item.title}大图`}
                >
                  <span className={styles.imageFrame} data-fit={item.fit}>
                    <Image
                      src={sitePath(item.image)}
                      alt={item.imageAlt}
                      width={420}
                      height={630}
                      sizes="(max-width: 600px) 44vw, (max-width: 900px) 29vw, (max-width: 1180px) 22vw, 15vw"
                      loading="lazy"
                      unoptimized
                    />
                    <span className={styles.openMark} aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <span className={styles.cardTitle}>{item.title}</span>
                </button>
              </li>
            ))}
          </ol>
          {remaining > 0 ? (
            <div className={styles.more}>
              <span>还有 {remaining} 件</span>
              <button
                className="button button-primary"
                type="button"
                onClick={() =>
                  setReveal({ key: filterKey, limit: visibleLimit + PAGE_SIZE })
                }
              >
                再翻 {Math.min(PAGE_SIZE, remaining)} 件
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">◇</span>
          <h2>这一页还没有收藏</h2>
          <p>换个关键词或分类试试。</p>
          <button
            className="button button-primary"
            type="button"
            onClick={resetFilters}
          >
            查看全部
          </button>
        </div>
      )}

      {selected ? (
        <CollectionLightbox
          items={lightboxItems}
          selectedId={selected.id}
          onSelect={(id) => {
            const nextIndex = filtered.findIndex((entry) => entry.id === id);
            setReveal({
              key: filterKey,
              limit: Math.max(
                visibleLimit,
                Math.ceil((nextIndex + 1) / PAGE_SIZE) * PAGE_SIZE,
              ),
            });
            updateUrl({ item: id });
          }}
          onClose={closeLightbox}
        />
      ) : null}
    </div>
  );
}
