"use client";

import { useMemo, useState } from "react";
import { linkEntries, linkGroups, type LinkEntry } from "@/content/links";
import { sitePath } from "@/lib/site-path";

type GroupId = (typeof linkGroups)[number]["id"];

function resolvedHref(entry: LinkEntry): string {
  return entry.external ? entry.href : sitePath(entry.href);
}

/** Searchable route terminal with a playful, deterministic content model. */
export function LinkTerminal() {
  const [group, setGroup] = useState<GroupId>("all");
  const [query, setQuery] = useState("");

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

  function randomJump() {
    if (visibleEntries.length === 0) return;
    const entry = visibleEntries[Math.floor(Math.random() * visibleEntries.length)];
    const href = resolvedHref(entry);

    if (entry.external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(href);
    }
  }

  return (
    <div className="link-terminal">
      <div className="terminal-toolbar">
        <div className="terminal-filters" role="group" aria-label="筛选航线">
          {linkGroups.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={group === item.id}
              onClick={() => setGroup(item.id)}
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索理由或标签"
          />
        </label>
        <button
          className="terminal-random"
          type="button"
          onClick={randomJump}
          disabled={visibleEntries.length === 0}
        >
          随机跃迁 <span aria-hidden="true">✦</span>
        </button>
      </div>

      <p className="terminal-count" aria-live="polite">
        SIGNAL FOUND / {String(visibleEntries.length).padStart(2, "0")}
      </p>

      {visibleEntries.length > 0 ? (
        <div className="terminal-grid">
          {visibleEntries.map((entry, index) => (
            <a
              className={`terminal-card terminal-card-${entry.group}`}
              href={resolvedHref(entry)}
              key={entry.id}
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
                {entry.external ? "打开外部坐标" : "进入频道"}
                <span aria-hidden="true">↗</span>
              </strong>
            </a>
          ))}
        </div>
      ) : (
        <div className="terminal-empty">
          <span aria-hidden="true">404 / NO SIGNAL</span>
          <h3>这条航线还没有被记录。</h3>
          <p>换一个关键词，或者回到全部航线继续探索。</p>
        </div>
      )}
    </div>
  );
}
