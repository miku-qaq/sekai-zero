"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collectionItems } from "@/content/collection-items";
import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { browserTimers } from "@/lib/browser-timers";
import { createCapsuleDraw, type CapsulePhase } from "@/lib/capsule-draw";
import { createFortuneReveal, type FortunePhase } from "@/lib/fortune-draw";
import { sitePath } from "@/lib/site-path";
import { CapsuleMachine } from "./capsule-machine";
import styles from "./collection-discovery.module.css";

type DiscoveryFilter = "all" | CollectionRoomId;
type DiscoveryMode = "capsule" | "paper";

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

/** Both views share room bags and results; changing views never draws again. */
export function CollectionDiscovery() {
  const [mode, setMode] = useState<DiscoveryMode>("capsule");
  const modeRef = useRef<DiscoveryMode>("capsule");
  const [filter, setFilter] = useState<DiscoveryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [paperPhase, setPaperPhase] = useState<FortunePhase>("idle");
  const [capsulePhase, setCapsulePhase] = useState<CapsulePhase>("idle");
  const [encounter, setEncounter] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollToResult = useRef(false);
  const bags = useRef<Partial<Record<DiscoveryFilter, string[]>>>({});
  const paperRef = useRef<ReturnType<typeof createFortuneReveal> | null>(null);
  const capsuleRef = useRef<ReturnType<typeof createCapsuleDraw> | null>(null);
  const item = collectionItems.find((entry) => entry.id === selectedId) ?? firstItem;
  const room = collectionRooms.find((entry) => entry.id === item?.room);
  const phase = mode === "capsule" ? capsulePhase : paperPhase;
  const busy = phase !== "idle";
  const hasResult = selectedId !== null || mode === "paper";

  useEffect(() => {
    function select(id: string) {
      const next = collectionItems.find((entry) => entry.id === id);
      if (!next) return;
      setSelectedId(id);
      setEncounter((value) => value + 1);
      setAnnouncement(`这次遇见：${next.title}`);
    }
    const paper = createFortuneReveal({
      clock: browserTimers,
      motionAllowed: () => modeRef.current === "paper" && allowsMotion(),
      onPhase: setPaperPhase,
      onSelect: select,
    });
    const capsule = createCapsuleDraw({
      clock: browserTimers,
      motionAllowed: () => modeRef.current === "capsule" && allowsMotion(),
      onPhase: setCapsulePhase,
      onSelect: select,
    });
    paperRef.current = paper;
    capsuleRef.current = capsule;
    const preference = window.matchMedia(reducedMotion);
    const update = () => {
      if (document.hidden) scrollToResult.current = false;
      paper.motionChanged();
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
      paper.destroy();
      capsule.destroy();
      paperRef.current = null;
      capsuleRef.current = null;
      observer.disconnect();
      preference.removeEventListener("change", update);
      window.removeEventListener("sekai-motion-change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (
      mode !== "capsule" ||
      capsulePhase !== "idle" ||
      !selectedId ||
      !scrollToResult.current
    )
      return;
    scrollToResult.current = false;
    if (document.hidden || !window.matchMedia("(max-width: 760px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      const result = resultRef.current;
      if (!result || document.hidden || modeRef.current !== "capsule") return;
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
  }, [capsulePhase, selectedId, mode]);

  function changeMode(next: DiscoveryMode) {
    if (next === modeRef.current) return;
    modeRef.current = next;
    scrollToResult.current = false;
    // Finish the accepted draw before switching views; keep its result and count.
    paperRef.current?.motionChanged();
    capsuleRef.current?.motionChanged();
    setMode(next);
  }

  function draw(nextFilter: DiscoveryFilter) {
    const candidates = collectionItems.filter(
      (entry) => nextFilter === "all" || entry.room === nextFilter,
    );
    if (!candidates.length) return;
    const currentId = selectedId ?? (mode === "paper" ? firstItem?.id : null);
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
    const accepted =
      mode === "capsule"
        ? capsuleRef.current?.draw(next.id)
        : paperRef.current?.reveal(next.id, false);
    if (!accepted) return;
    scrollToResult.current = mode === "capsule";
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
      data-mode={mode}
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>COLLECTION / LITTLE SURPRISE</p>
          <h2 id="collection-discovery-title">
            {mode === "capsule" ? "收藏扭蛋机" : "随机逛一件"}
          </h2>
        </div>
        <div className={styles.modes} role="group" aria-label="选择随机收藏的展示方式">
          <button
            type="button"
            aria-pressed={mode === "capsule"}
            onClick={() => changeMode("capsule")}
          >
            扭蛋机
          </button>
          <button
            type="button"
            aria-pressed={mode === "paper"}
            onClick={() => changeMode("paper")}
          >
            画册
          </button>
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
                onChange={(event) => {
                  const next = event.target.value as DiscoveryFilter;
                  if (mode === "paper") draw(next);
                  else setFilter(next);
                }}
              >
                <option value="all">所有收藏</option>
                {collectionRooms.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
            {mode === "paper" ? (
              <button
                className={styles.draw}
                type="button"
                onClick={() => draw(filter)}
                aria-disabled={busy}
              >
                {busy ? "翻开中" : "换一件"}
              </button>
            ) : null}
          </div>
        </div>
        {mode === "capsule" ? (
          <div className={styles.cabinet}>
            <CapsuleMachine
              phase={capsulePhase}
              drawCount={encounter}
              onDraw={() => draw(filter)}
            />
          </div>
        ) : null}
        <div className={styles.stage} data-phase={phase} ref={resultRef}>
          <div className={styles.topline}>
            <span>
              {encounter ? "这次遇见" : hasResult ? "展柜一瞥" : "等待一颗小惊喜"}
            </span>
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
