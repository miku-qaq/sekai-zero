"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { collectionItems } from "@/content/collection-items";
import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { browserTimers } from "@/lib/browser-timers";
import {
  capsuleTiming,
  createCapsuleDraw,
  type CapsulePhase,
} from "@/lib/capsule-draw";
import { sitePath } from "@/lib/site-path";
import { CapsuleMachine } from "./capsule-machine";
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

/** Each accepted turn reveals one piece from its room's shuffled bag. */
export function CollectionDiscovery() {
  const [filter, setFilter] = useState<DiscoveryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [phase, setPhase] = useState<CapsulePhase>("idle");
  const [encounter, setEncounter] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollToResult = useRef(false);
  const bags = useRef<Partial<Record<DiscoveryFilter, string[]>>>({});
  const capsuleRef = useRef<ReturnType<typeof createCapsuleDraw> | null>(null);
  const item = collectionItems.find((entry) => entry.id === selectedId) ?? firstItem;
  const room = collectionRooms.find((entry) => entry.id === item?.room);
  const busy = phase !== "idle";
  const hasResult = selectedId !== null;

  useEffect(() => {
    function select(id: string) {
      const next = collectionItems.find((entry) => entry.id === id);
      if (!next) return;
      setSelectedId(id);
      setEncounter((value) => value + 1);
      setAnnouncement(`这次遇见：${next.title}`);
    }
    const capsule = createCapsuleDraw({
      clock: browserTimers,
      motionAllowed: allowsMotion,
      onPhase: setPhase,
      onSelect: select,
    });
    capsuleRef.current = capsule;
    const preference = window.matchMedia(reducedMotion);
    const update = () => {
      if (document.hidden) scrollToResult.current = false;
      capsule.motionChanged();
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    preference.addEventListener("change", update);
    window.addEventListener("sekai-motion-change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      capsule.destroy();
      capsuleRef.current = null;
      observer.disconnect();
      preference.removeEventListener("change", update);
      window.removeEventListener("sekai-motion-change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (phase !== "idle" || !selectedId || !scrollToResult.current) return;
    scrollToResult.current = false;
    if (document.hidden || !window.matchMedia("(max-width: 760px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      const result = resultRef.current;
      if (!result || document.hidden) return;
      // Only follow an explicit turn while focus is still inside this exhibit.
      if (!result.closest("section")?.contains(document.activeElement)) return;
      const bounds = result.getBoundingClientRect();
      if (bounds.bottom > window.innerHeight - 16)
        result.scrollIntoView({
          block: "nearest",
          behavior: allowsMotion() ? "smooth" : "auto",
        });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, selectedId]);

  function draw(nextFilter: DiscoveryFilter) {
    const candidates = collectionItems.filter(
      (entry) => nextFilter === "all" || entry.room === nextFilter,
    );
    if (!candidates.length) return;
    const currentId = selectedId;
    // A rejected click must not consume a result from the room's shuffled bag.
    const previousBag = bags.current[nextFilter];
    let bag = previousBag ? [...previousBag] : undefined;
    if (!bag) {
      bag = shuffled(
        candidates
          .filter((entry) => entry.id !== currentId || candidates.length === 1)
          .map((entry) => entry.id),
      );
    } else if (!bag.length) {
      bag = shuffled(candidates.map((entry) => entry.id));
    }
    if (bag.length === 1 && bag[0] === currentId && candidates.length > 1) {
      bag = shuffled(
        candidates.filter((entry) => entry.id !== currentId).map((entry) => entry.id),
      );
    }
    const last = bag.length - 1;
    if (bag.length > 1 && bag[last] === currentId)
      [bag[0], bag[last]] = [bag[last], bag[0]];
    const nextId = bag.pop();
    const next = collectionItems.find((entry) => entry.id === nextId);
    if (!next) return;
    const accepted = capsuleRef.current?.draw(next.id);
    if (!accepted) return;
    scrollToResult.current = true;
    bags.current[nextFilter] = bag;
    setFilter(nextFilter);
    // Start loading the local cover during the reveal, without blocking controls.
    const preview = new window.Image();
    preview.src = sitePath(next.image);
  }

  if (!item || !room) return null;

  return (
    <section
      className={`section-shell ${styles.discovery}`}
      id="collection-discovery"
      aria-labelledby="collection-discovery-title"
      style={
        { "--capsule-reveal-duration": `${capsuleTiming.revealing}ms` } as CSSProperties
      }
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>COLLECTION / LITTLE SURPRISE</p>
          <h2 id="collection-discovery-title">收藏扭蛋机</h2>
        </div>
      </div>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.actions}>
            <label className={styles.filter}>
              <span>挑个展柜</span>
              <select
                value={filter}
                disabled={busy}
                onChange={(event) => setFilter(event.target.value as DiscoveryFilter)}
              >
                <option value="all">所有收藏</option>
                {collectionRooms.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className={styles.cabinet}>
          <CapsuleMachine
            phase={phase}
            drawCount={encounter}
            onDraw={() => draw(filter)}
          />
        </div>
        <div className={styles.stage} data-phase={phase} ref={resultRef}>
          <div className={styles.topline}>
            <span>{encounter ? "这次遇见" : "等待一颗小惊喜"}</span>
            <span
              className={styles.counter}
              aria-label={encounter ? `本次漫游第 ${encounter} 件` : undefined}
            >
              {encounter ? `NO. ${String(encounter).padStart(3, "0")}` : "SEKAI / 00"}
            </span>
          </div>
          {hasResult ? (
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
                    sizes="(max-width: 400px) 88px, (max-width: 600px) 108px, 132px"
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
          ) : (
            <div className={styles.unopened}>
              <div className={styles.sealedCapsule} aria-hidden="true">
                <span>?</span>
              </div>
              <p>下一件喜欢，等你来发现。</p>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}
