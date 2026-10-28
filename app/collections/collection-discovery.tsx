"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { collectionItems } from "@/content/collection-items";
import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { sitePath } from "@/lib/site-path";
import styles from "./collection-discovery.module.css";

type DiscoveryFilter = "all" | CollectionRoomId;

const firstItem =
  collectionItems.find((item) => item.id === "figure-001") ?? collectionItems[0];

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
  const bags = useRef<Partial<Record<DiscoveryFilter, string[]>>>({});
  const item = collectionItems.find((entry) => entry.id === selectedId);
  const room = collectionRooms.find((entry) => entry.id === item?.room);

  function draw(nextFilter: DiscoveryFilter) {
    const candidates = collectionItems.filter(
      (entry) => nextFilter === "all" || entry.room === nextFilter,
    );
    if (!candidates.length) return;

    let bag = bags.current[nextFilter];
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
    bags.current[nextFilter] = bag;
    const next = collectionItems.find((entry) => entry.id === nextId);
    if (!next) return;

    setFilter(nextFilter);
    setSelectedId(next.id);
    setAnnouncement(next.title);
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
          ✦
        </span>
        <h2 id="collection-discovery-title">随机逛一件</h2>
        <div className={styles.actions}>
          <label className={styles.filter}>
            <span className="sr-only">随机收藏的分类</span>
            <select
              value={filter}
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
          <button className={styles.draw} type="button" onClick={() => draw(filter)}>
            换一件
          </button>
        </div>
      </div>

      <a
        className={styles.card}
        href={sitePath(
          `/collections/gallery/?room=${item.room}&item=${encodeURIComponent(item.id)}`,
        )}
        aria-label={`在画册中查看${item.title}`}
      >
        <div className={styles.preview} key={item.id}>
          <div className={styles.artwork}>
            <Image
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
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}
