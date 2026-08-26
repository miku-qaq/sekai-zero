"use client";

import { useMemo, useState } from "react";
import {
  linkEntries,
  linkGroups,
  linkPlaceholder,
  type LinkEntry,
} from "@/content/links";
import { sitePath } from "@/lib/site-path";

type GroupId = (typeof linkGroups)[number]["id"];

function resolvedHref(entry: LinkEntry): string {
  return entry.external ? entry.href : sitePath(entry.href);
}

/** Searchable route terminal with a playful, deterministic content model. */
export function LinkTerminal() {
  const [group, setGroup] = useState<GroupId>("all");
  const [query, setQuery] = useState("");
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return linkEntries.filter((entry) => {
      const inGroup = group === "all" || entry.group === group;
      const haystack = [entry.label, entry.eyebrow, entry.reason, ...entry.tags]
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      return inGroup && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [group, query]);

  function recommendRandomEntry() {
    if (visibleEntries.length === 0) return;
    const entry = visibleEntries[Math.floor(Math.random() * visibleEntries.length)];
    setRecommendedId(entry.id);

    window.requestAnimationFrame(() => {
      const card = document.getElementById(`route-${entry.id}`);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      card?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  const showPlaceholder =
    (group === "all" || group === "favorite") && query.trim() === "";

  return (
    <div className="link-terminal">
      <div className="terminal-toolbar">
        <div className="terminal-filters" role="group" aria-label="筛选航线">
          {linkGroups.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={group === item.id}
              onClick={() => {
                setGroup(item.id);
                setRecommendedId(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="terminal-search">
          <span className="sr-only">搜索航线</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setRecommendedId(null);
            }}
            placeholder="搜索理由或标签"
          />
        </label>
        <button
          className="terminal-random"
          type="button"
          onClick={recommendRandomEntry}
          disabled={visibleEntries.length === 0}
        >
          随机推荐 <span aria-hidden="true">✦</span>
        </button>
      </div>

      <p className="terminal-count" aria-live="polite">
        找到 {String(visibleEntries.length).padStart(2, "0")} 个入口
        {showPlaceholder ? " · 另有 01 个内容留白" : ""}
        {recommendedId
          ? ` · 推荐：${linkEntries.find((entry) => entry.id === recommendedId)?.label ?? ""}`
          : ""}
      </p>

      {visibleEntries.length > 0 ? (
        <div className="terminal-grid">
          {visibleEntries.map((entry, index) => (
            <a
              className={`terminal-card terminal-card-${entry.group}`}
              id={`route-${entry.id}`}
              href={resolvedHref(entry)}
              key={entry.id}
              data-recommended={recommendedId === entry.id || undefined}
              target={entry.external ? "_blank" : undefined}
              rel={entry.external ? "noreferrer" : undefined}
            >
              <span className="terminal-card-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{entry.eyebrow}</p>
              <h3>{entry.label}</h3>
              <span className="terminal-reason">{entry.reason}</span>
              <ul aria-label={`${entry.label} 标签`}>
                {entry.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
              <strong>
                {entry.action ?? (entry.external ? "打开外部坐标" : "进入频道")}
                <span aria-hidden="true">↗</span>
              </strong>
            </a>
          ))}
          {showPlaceholder ? (
            <article
              className="terminal-card terminal-card-placeholder"
              aria-label="待补充的收藏位置"
            >
              <span className="terminal-card-number">＋</span>
              <p>{linkPlaceholder.eyebrow}</p>
              <h3>{linkPlaceholder.label}</h3>
              <span className="terminal-reason">{linkPlaceholder.reason}</span>
              <ul aria-label="占位说明">
                {linkPlaceholder.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
              <strong>内容待填充</strong>
            </article>
          ) : null}
        </div>
      ) : (
        <div className="terminal-empty">
          <span aria-hidden="true">NO MATCHING LINK</span>
          <h3>没有找到匹配的入口。</h3>
          <p>试试“CS224N”“Bilibili”或“联系”，也可以清除筛选。</p>
          <button
            type="button"
            onClick={() => {
              setGroup("all");
              setQuery("");
              setRecommendedId(null);
            }}
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}
