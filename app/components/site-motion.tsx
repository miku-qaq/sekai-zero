"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styles from "./site-motion.module.css";

const MOTION_STORAGE_KEY = "sekai-motion";
const MOTION_CHANGE_EVENT = "sekai-motion-change";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(notify: () => void) {
  const preference = window.matchMedia(REDUCED_MOTION_QUERY);
  function syncStorage(event: StorageEvent) {
    if (event.key !== MOTION_STORAGE_KEY) return;
    document.documentElement.dataset.motion = event.newValue === "off" ? "off" : "on";
    notify();
  }
  preference.addEventListener("change", notify);
  window.addEventListener(MOTION_CHANGE_EVENT, notify);
  window.addEventListener("storage", syncStorage);
  return () => {
    preference.removeEventListener("change", notify);
    window.removeEventListener(MOTION_CHANGE_EVENT, notify);
    window.removeEventListener("storage", syncStorage);
  };
}

function motionSnapshot() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return "system";
  return document.documentElement.dataset.motion === "off" ? "off" : "on";
}

function serverMotionSnapshot() {
  return "on" as const;
}

/** 只为可见内容播放一次入场；正文从不依赖 JavaScript 才能显示。 */
export function SiteMotion() {
  const pathname = usePathname();
  const played = useRef(new WeakSet<Element>());
  const motion = useSyncExternalStore(
    subscribeToMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );

  useEffect(() => {
    if (motion !== "on" || !("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll(
      ".section-heading, .logs-list > details, .finale, [data-scene-reveal]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (played.current.has(entry.target)) continue;
          played.current.add(entry.target);
          entry.target.classList.add("scene-enter");
        }
      },
      { threshold: 0.08 },
    );
    for (const target of targets) observer.observe(target);
    return () => {
      observer.disconnect();
      for (const target of targets) target.classList.remove("scene-enter");
    };
  }, [pathname, motion]);

  return null;
}

export function MotionToggle() {
  const motion = useSyncExternalStore(
    subscribeToMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );
  const enabled = motion === "on";

  function toggleMotion() {
    const next = enabled ? "off" : "on";
    document.documentElement.dataset.motion = next;
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, next);
    } catch {
      // 无法保存时，当前页面的开关仍然有效。
    }
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
  }

  return (
    <button
      className={styles.toggle}
      type="button"
      onClick={toggleMotion}
      aria-pressed={enabled}
      disabled={motion === "system"}
      title={motion === "system" ? "已遵循系统的减少动态效果设置" : undefined}
    >
      <span className={styles.mark} aria-hidden="true">
        ✦
      </span>
      {enabled ? "动效已开启" : "动效已暂停"}
      {motion === "system" ? <span className="sr-only">，遵循系统设置</span> : null}
    </button>
  );
}
