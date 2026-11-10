"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collectionItems } from "@/content/collection-items";
import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { browserTimers } from "@/lib/browser-timers";
import { createFortuneReveal, type FortunePhase } from "@/lib/fortune-draw";
import { sitePath } from "@/lib/site-path";
import styles from "./collection-discovery.module.css";

type DiscoveryFilter = "all" | CollectionRoomId;

const firstItem =
  collectionItems.find((item) => item.id === "figure-001") ?? collectionItems[0];
const reducedMotion = "(prefers-reduced-motion: reduce)";

function allowsMotion() {
  return (
    document.documentElement.dataset.motion !== "off" &&
    !window.matchMedia(reducedMotion).matches &&
    !document.hidden
  );
}

function shuffled(ids: readonly string[]) {
  const result = [...ids];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

/** Each room keeps its own shuffled bag, so a visit can uncover more than one favourite. */
export function CollectionDiscovery() {
  const [filter, setFilter] = useState<DiscoveryFilter>("all");
  const [selectedId, setSelectedId] = useState(firstItem?.id ?? "");
  const [announcement, setAnnouncement] = useState("");
  const [phase, setPhase] = useState<FortunePhase>("idle");
  const [encounter, setEncounter] = useState(1);
  const bags = useRef<Partial<Record<DiscoveryFilter, string[]>>>({});
  const revealRef = useRef<ReturnType<typeof createFortuneReveal> | null>(null);
  const item = collectionItems.find((entry) => entry.id === selectedId);
  const room = collectionRooms.find((entry) => entry.id === item?.room);
  const busy = phase !== "idle";

  useEffect(() => {
    const reveal = createFortuneReveal({
      clock: browserTimers,
      motionAllowed: allowsMotion,
      onPhase: setPhase,
      onSelect(id) {
        const next = collectionItems.find((entry) => entry.id === id);
        if (!next) return;
        setSelectedId(id);
        setEncounter((value) => value + 1);
        setAnnouncement(`这次遇见：${next.title}`);
      },
    });
    revealRef.current = reveal;
    const preference = window.matchMedia(reducedMotion);
    const update = () => reveal.motionChanged();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    preference.addEventListener("change", update);
    window.addEventListener("sekai-motion-change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      reveal.destroy();
      revealRef.current = null;
      observer.disconnect();
      preference.removeEventListener("change", update);
      window.removeEventListener("sekai-motion-change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  function draw(nextFilter: DiscoveryFilter) {
    const candidates = collectionItems.filter(
      (entry) => nextFilter === "all" || entry.room === nextFilter,
    );
    if (!candidates.length) return;

    // Work on a copy: a click rejected during a reveal must not consume a piece.
    const previousBag = bags.current[nextFilter];
    let bag = previousBag ? [...previousBag] : undefined;
    if (!bag) {
      // The first visible piece already counts as seen in this room.
      bag = shuffled(
        candidates
          .filter((entry) => entry.id !== selectedId || candidates.length === 1)
          .map((entry) => entry.id),
      );
    } else if (!bag.length) {
      bag = shuffled(candidates.map((entry) => entry.id));
    }

    // Another room may already have revealed the last remaining piece.
    if (bag.length === 1 && bag[0] === selectedId && candidates.length > 1) {
      bag = shuffled(
        candidates.filter((entry) => entry.id !== selectedId).map((entry) => entry.id),
      );
    }

    // A new cycle should not land on the piece that is still on screen.
    const last = bag.length - 1;
    if (bag.length > 1 && bag[last] === selectedId) {
      [bag[0], bag[last]] = [bag[last], bag[0]];
    }
    const nextId = bag.pop();
    const next = collectionItems.find((entry) => entry.id === nextId);
    if (!next || !revealRef.current?.reveal(next.id, false)) return;

    bags.current[nextFilter] = bag;
    setFilter(nextFilter);
  }

  if (!item || !room) return null;

  return (
    <section
      className={`section-shell ${styles.discovery}`}
      id="collection-discovery"
      aria-labelledby="collection-discovery-title"
    >
      <div className={styles.controls}>
        <span className={styles.motif} aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none">
            <path d="m7 5 15 2-2 18-15-2Z" />
            <rect x="7" y="3" width="15" height="19" rx="2" />
            <path d="M11 8h7M11 12h5" />
          </svg>
        </span>
        <h2 id="collection-discovery-title">随机逛一件</h2>
        <div className={styles.actions}>
          <label className={styles.filter}>
            <span className="sr-only">随机收藏的分类</span>
            <select
              value={filter}
              aria-disabled={busy}
              onChange={(event) => draw(event.target.value as DiscoveryFilter)}
            >
              <option value="all">所有收藏</option>
              {collectionRooms.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className={styles.draw}
            type="button"
            onClick={() => draw(filter)}
            aria-disabled={busy}
          >
            {busy ? "翻开中" : "换一件"}
          </button>
        </div>
      </div>

      <div className={styles.stage} data-phase={phase}>
        <div className={styles.topline}>
          <span>这次遇见</span>
          <span className={styles.counter} aria-label={`本次漫游第 ${encounter} 件`}>
            NO. {String(encounter).padStart(3, "0")}
          </span>
        </div>
        <a
          className={styles.card}
          href={sitePath(
            `/collections/gallery/?room=${item.room}&item=${encodeURIComponent(item.id)}`,
          )}
          aria-label={`在画册中查看${item.title}`}
          aria-disabled={busy || undefined}
          aria-busy={busy}
          onClick={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          <div className={styles.preview}>
            <div className={styles.artwork}>
              <Image
                key={item.id}
                src={sitePath(item.image)}
                alt={item.imageAlt}
                width={360}
                height={480}
                sizes="(max-width: 600px) 108px, 132px"
                className={styles.image}
                style={{ objectFit: item.fit }}
              />
            </div>
            <div className={styles.identity}>
              <span className={styles.room}>{room.label}</span>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <span className={styles.open}>打开画册</span>
            </div>
          </div>
        </a>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}
