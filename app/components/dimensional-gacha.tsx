"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { dimensionalFortunes } from "@/content/site";
import {
  createFortuneReveal,
  nextFortune,
  readFortuneAlbum,
  type FortunePhase,
} from "@/lib/fortune-draw";
import { sitePath } from "@/lib/site-path";
import styles from "./dimensional-gacha.module.css";

const ALBUM_KEY = "sekai-fortune-album";
const ALBUM_EVENT = "sekai-fortune-album-change";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const ids = dimensionalFortunes.map((card) => card.id);
const names = { miku: "初音未来", elaina: "伊蕾娜", bocchi: "波奇" };
let memoryAlbum: string | null = null;

function albumSnapshot() {
  if (memoryAlbum !== null) return memoryAlbum;
  try {
    return window.localStorage.getItem(ALBUM_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function serverAlbum() {
  return "[]";
}

function subscribeAlbum(notify: () => void) {
  function updateStorage(event: StorageEvent) {
    if (event.key !== ALBUM_KEY && event.key !== null) return;
    memoryAlbum = null;
    notify();
  }
  window.addEventListener(ALBUM_EVENT, notify);
  window.addEventListener("storage", updateStorage);
  return () => {
    window.removeEventListener(ALBUM_EVENT, notify);
    window.removeEventListener("storage", updateStorage);
  };
}

function collectFortune(id: string) {
  const previous = readFortuneAlbum(albumSnapshot(), ids);
  if (previous.includes(id)) return;
  const serialized = JSON.stringify([...previous, id]);
  try {
    window.localStorage.setItem(ALBUM_KEY, serialized);
    memoryAlbum = null;
  } catch {
    memoryAlbum = serialized;
  }
  window.dispatchEvent(new Event(ALBUM_EVENT));
}

function allowsMotion() {
  return (
    document.documentElement.dataset.motion !== "off" &&
    !window.matchMedia(REDUCED_MOTION).matches
  );
}

/** Original character tickets, revealed on demand and kept in a device-local album. */
export function DimensionalGacha() {
  const [activeId, setActiveId] = useState<string>(ids[0]);
  const [phase, setPhase] = useState<FortunePhase>("idle");
  const [announcement, setAnnouncement] = useState("");
  const revealRef = useRef<ReturnType<typeof createFortuneReveal> | null>(null);
  const rawAlbum = useSyncExternalStore(subscribeAlbum, albumSnapshot, serverAlbum);
  const collected = useMemo(() => readFortuneAlbum(rawAlbum, ids), [rawAlbum]);
  const fortune =
    dimensionalFortunes.find((entry) => entry.id === activeId) ??
    dimensionalFortunes[0];
  const busy = phase !== "idle";

  useEffect(() => {
    const controller = createFortuneReveal({
      motionAllowed: allowsMotion,
      clock: {
        setTimeout: (callback, delay) => setTimeout(callback, delay),
        clearTimeout,
      },
      onPhase: setPhase,
      onSelect(id) {
        setActiveId(id);
        const card = dimensionalFortunes.find((entry) => entry.id === id);
        if (card)
          setAnnouncement(`${names[card.channel]}：${card.title}。${card.message}`);
      },
    });
    revealRef.current = controller;
    const preference = window.matchMedia(REDUCED_MOTION);
    const update = () => controller.motionChanged();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    preference.addEventListener("change", update);
    window.addEventListener("sekai-motion-change", update);
    return () => {
      controller.destroy();
      revealRef.current = null;
      observer.disconnect();
      preference.removeEventListener("change", update);
      window.removeEventListener("sekai-motion-change", update);
    };
  }, []);

  function drawFortune() {
    const next = nextFortune(ids, activeId, readFortuneAlbum(albumSnapshot(), ids));
    // Persist only an accepted draw, before its animation can be interrupted by navigation.
    if (next && revealRef.current?.reveal(next, true)) collectFortune(next);
  }

  return (
    <div className={styles.machine}>
      <div className={styles.stage}>
        <article
          className={styles.ticket}
          data-channel={fortune.channel}
          data-phase={phase}
          aria-busy={busy}
        >
          <div className={styles.topline}>
            <span>来自{names[fortune.channel]}的灵感</span>
            <strong>{fortune.rarity}</strong>
          </div>
          <div className={styles.content}>
            <div className={styles.character} aria-hidden="true">
              <Image
                src={sitePath(`/characters/companions/${fortune.channel}-v1.webp`)}
                alt=""
                width={512}
                height={512}
                sizes="(max-width: 600px) 108px, 160px"
              />
            </div>
            <div className={styles.copy}>
              <h3>{fortune.title}</h3>
              <p className={styles.message}>{fortune.message}</p>
            </div>
          </div>
          <p className={styles.action}>
            {fortune.action.replace(/^行动指令：/, "今天的小事 · ")}
          </p>
        </article>
      </div>
      <div className={styles.controls}>
        <div className={styles.deck} aria-hidden="true">
          <span />
          <span />
          <span>
            <i>好き</i>
          </span>
        </div>
        <h3>翻开一点好心情。</h3>
        <p>六张原创小签，慢慢遇见。</p>
        <button
          className={styles.draw}
          type="button"
          onClick={drawFortune}
          aria-disabled={busy}
        >
          抽取下一张
        </button>
      </div>
      <details className={styles.album}>
        <summary>
          <span>
            我的签册{" "}
            <b>
              {collected.length} / {dimensionalFortunes.length}
            </b>
          </span>
          <span className={styles.albumHint}>翻看小签</span>
        </summary>
        <div className={styles.albumGrid}>
          {dimensionalFortunes.map((card, index) =>
            collected.includes(card.id) ? (
              <button
                className={styles.savedCard}
                key={card.id}
                type="button"
                data-channel={card.channel}
                aria-label={`翻看签卡：${card.title}`}
                aria-pressed={activeId === card.id}
                aria-disabled={busy}
                onClick={() => {
                  if (activeId !== card.id) revealRef.current?.reveal(card.id, false);
                }}
              >
                <Image
                  src={sitePath(`/characters/companions/${card.channel}-v1.webp`)}
                  alt=""
                  width={512}
                  height={512}
                  sizes="80px"
                />
                <span>{card.title}</span>
              </button>
            ) : (
              <div
                className={styles.emptySlot}
                key={card.id}
                role="img"
                aria-label={`第 ${index + 1} 张签卡尚未遇见`}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
            ),
          )}
        </div>
        <p className={styles.localNote}>小签保存在此浏览器。</p>
      </details>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
