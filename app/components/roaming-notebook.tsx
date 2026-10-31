"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { browserTimers } from "@/lib/browser-timers";
import {
  addRoamingVisit,
  createRoamingStorage,
  createRoamingVisitTracker,
  readRoamingVisits,
  roamingPlaceForPath,
  roamingPlaces,
  roamingStorageKey,
  type RoamingPlaceId,
} from "@/lib/roaming-notebook";
import { sitePath } from "@/lib/site-path";
import styles from "./roaming-notebook.module.css";

const CHANGE_EVENT = "sekai-roaming-change";
const RESET_EVENT = "sekai-roaming-reset";
const visitStorage = createRoamingStorage(() => window.localStorage);

function clientSnapshot() {
  return visitStorage.read().join("|");
}

function serverSnapshot() {
  return "";
}

function subscribe(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === roamingStorageKey || event.key === null) notify();
  }
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", onStorage);
  };
}

function saveVisits(visits: RoamingPlaceId[], added?: RoamingPlaceId) {
  visitStorage.write(visits);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: added }));
}

function markVisit(place: RoamingPlaceId) {
  const previous = visitStorage.read();
  if (previous.includes(place)) return;
  saveVisits(addRoamingVisit(previous, place), place);
}

/** Mount exactly once in the root layout; the notebook and map are read-only views. */
export function RoamingTracker() {
  const pathname = usePathname();
  const trackerRef = useRef<ReturnType<typeof createRoamingVisitTracker> | null>(null);

  useEffect(() => {
    const tracker = createRoamingVisitTracker({
      clock: browserTimers,
      record: markVisit,
    });
    trackerRef.current = tracker;
    const updateVisibility = () => tracker.setVisible(!document.hidden);
    const reset = () => tracker.reset();
    function resetFromOtherTab(event: StorageEvent) {
      if (
        event.key === null ||
        (event.key === roamingStorageKey && !readRoamingVisits(event.newValue).length)
      )
        tracker.reset();
    }
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener(RESET_EVENT, reset);
    window.addEventListener("storage", resetFromOtherTab);
    return () => {
      tracker.destroy();
      trackerRef.current = null;
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener(RESET_EVENT, reset);
      window.removeEventListener("storage", resetFromOtherTab);
    };
  }, []);

  useEffect(() => {
    trackerRef.current?.navigate(pathname, sitePath("/"));
  }, [pathname]);

  return null;
}

/** Six small local memories, tucked away until the visitor opens the notebook. */
export function RoamingNotebook() {
  const snapshot = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const visited = snapshot ? snapshot.split("|") : [];
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [freshStamp, setFreshStamp] = useState<RoamingPlaceId | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onVisit(event: Event) {
      if (!(event instanceof CustomEvent) || !event.detail) return;
      const details = detailsRef.current;
      if (!details?.open || document.hidden) return;
      if (
        document.documentElement.dataset.motion === "off" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const bounds = details.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      setFreshStamp(event.detail);
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => setFreshStamp(null), 650);
    }
    window.addEventListener(CHANGE_EVENT, onVisit);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onVisit);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  function clearVisits() {
    if (!visited.length) return;
    window.dispatchEvent(new Event(RESET_EVENT));
    saveVisits([]);
    setFreshStamp(null);
  }

  return (
    <details className={styles.notebook} ref={detailsRef}>
      <summary className={styles.summary}>
        <span className={styles.bookMark} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 4h13a1 1 0 0 1 1 1v15H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" />
            <path d="M4 16h15M9 4v7l2-1.5 2 1.5V4" />
          </svg>
        </span>
        <span>漫游手帐</span>
        <span className={styles.count}>
          {visited.length} / {roamingPlaces.length}
        </span>
      </summary>
      <div className={styles.sheet}>
        <div className={styles.intro}>
          <strong>在这里，留下足迹。</strong>
          <span>只保存在此浏览器</span>
        </div>
        <ol className={styles.places}>
          {roamingPlaces.map((place) => {
            const seen = visited.includes(place.id);
            return (
              <li key={place.id} data-tone={place.tone} data-seen={seen}>
                <a
                  className={styles.place}
                  href={sitePath(place.href)}
                  aria-label={`${place.label}，${seen ? "已经来过" : "去逛逛"}`}
                >
                  <span
                    className={styles.seal}
                    data-fresh={freshStamp === place.id || undefined}
                    aria-hidden="true"
                  >
                    <span>{seen ? place.title : "·"}</span>
                    <small>{seen ? "来过" : "待启程"}</small>
                  </span>
                  <span className={styles.placeName}>{place.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
        <div className={styles.bottom}>
          <p>
            {visited.length === roamingPlaces.length
              ? "这一圈，收好了。"
              : "下一页，也许有新的喜欢。"}
          </p>
          <button
            type="button"
            onClick={clearVisits}
            aria-disabled={visited.length === 0}
          >
            清除本机印记
          </button>
        </div>
      </div>
    </details>
  );
}

/** A quiet badge for the existing homepage route cards, never a second tracker. */
export function RouteStamp({ href }: { href: string }) {
  const snapshot = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const place = roamingPlaceForPath(href, sitePath("/"));
  if (!place || !snapshot.split("|").includes(place)) return null;
  return <span className={styles.routeStamp}>来过</span>;
}
