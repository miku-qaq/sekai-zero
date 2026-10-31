"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  companionStorageKeys,
  createCompanionController,
  type CompanionAppearance,
  type CompanionStorage,
} from "@/lib/character-companion";
import { sitePath } from "@/lib/site-path";
import styles from "./character-companion.module.css";

const CHANGE_EVENT = "sekai-companion-change";
const SUMMON_EVENT = "sekai-companion-summon";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const fallbackStorage = new Map<string, string>();
const storage: CompanionStorage = {
  getItem(key) {
    if (fallbackStorage.has(key)) return fallbackStorage.get(key) ?? null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return fallbackStorage.get(key) ?? null;
    }
  },
  setItem(key, value) {
    fallbackStorage.set(key, value);
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // The current tab still works when browser storage is unavailable.
    }
  },
};

const characters = [
  { id: "miku", name: "初音未来", greeting: "一起慢慢逛。" },
  { id: "elaina", name: "伊蕾娜", greeting: "这里也有好风景。" },
  { id: "bocchi", name: "波奇", greeting: "再、再看一会儿。" },
] as const;

function companionSnapshot() {
  if (window.matchMedia(REDUCED_MOTION).matches) return "system";
  if (document.documentElement.dataset.motion === "off") return "motion-off";
  return storage.getItem(companionStorageKeys.preference) === "off" ? "off" : "on";
}

function serverSnapshot() {
  return "on" as const;
}

function subscribe(notify: () => void) {
  const preference = window.matchMedia(REDUCED_MOTION);
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  preference.addEventListener("change", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("sekai-motion-change", notify);
  return () => {
    observer.disconnect();
    preference.removeEventListener("change", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("sekai-motion-change", notify);
  };
}

function setEnabled(enabled: boolean) {
  storage.setItem(companionStorageKeys.preference, enabled ? "on" : "off");
  window.dispatchEvent(new Event(CHANGE_EVENT));
  if (enabled) window.dispatchEvent(new Event(SUMMON_EVENT));
}

function containsKeyboardFocus(root: HTMLElement | null) {
  const active = document.activeElement;
  return Boolean(
    root?.contains(active) &&
    active instanceof HTMLElement &&
    active.matches(":focus-visible"),
  );
}

/** One quiet visitor at the page edge; no looping animation or automatic speech. */
export function CharacterCompanion() {
  const [appearance, setAppearance] = useState<CompanionAppearance | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const hovering = useRef(false);
  const controllerRef = useRef<ReturnType<typeof createCompanionController> | null>(
    null,
  );
  const mode = useSyncExternalStore(subscribe, companionSnapshot, serverSnapshot);

  useEffect(() => {
    const prepared = new Set<string>();
    const firstCharacter = Math.max(
      0,
      characters.findIndex(
        (entry) => entry.id === document.documentElement.dataset.channel,
      ),
    );
    const controller = createCompanionController({
      storage,
      clock: {
        now: Date.now,
        setTimeout: (callback, delay) => setTimeout(callback, delay),
        clearTimeout,
      },
      onChange: setAppearance,
      onPrepare(index) {
        const src = sitePath(`/characters/companions/${characters[index].id}-v1.webp`);
        if (prepared.has(src)) return;
        prepared.add(src);
        const preload = new window.Image();
        preload.src = src;
      },
      firstCharacter,
    });
    controllerRef.current = controller;
    const preference = window.matchMedia(REDUCED_MOTION);

    function isBlocked() {
      const viewport = window.visualViewport;
      return (
        companionSnapshot() !== "on" ||
        document.hidden ||
        Boolean(
          document.querySelector("dialog[open], #mobile-navigation[data-open='true']"),
        ) ||
        Boolean(
          document.activeElement?.closest(
            "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
          ),
        ) ||
        Boolean(
          viewport &&
          (viewport.scale > 1.05 || viewport.height < window.innerHeight * 0.75),
        )
      );
    }

    function update() {
      const blocked = isBlocked();
      if (blocked) hovering.current = false;
      controller.setBlocked(blocked);
      controller.setHeld(hovering.current || containsKeyboardFocus(rootRef.current));
    }

    function updateFocus() {
      // focusout runs before activeElement has settled on its next target.
      queueMicrotask(update);
    }

    function summon() {
      update();
      controller.summon();
    }

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open", "data-open", "data-motion"],
    });
    controller.start(isBlocked());
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    document.addEventListener("focusin", updateFocus);
    document.addEventListener("focusout", updateFocus);
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener(SUMMON_EVENT, summon);
    window.addEventListener("sekai-motion-change", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      controller.destroy();
      controllerRef.current = null;
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("focusin", updateFocus);
      document.removeEventListener("focusout", updateFocus);
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener(SUMMON_EVENT, summon);
      window.removeEventListener("sekai-motion-change", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  if (!appearance || mode !== "on") return null;
  const character = characters[appearance.character];

  function holdPointer(held: boolean, pointerType: string) {
    if (pointerType !== "mouse" && pointerType !== "pen") return;
    hovering.current = held;
    controllerRef.current?.setHeld(held || containsKeyboardFocus(rootRef.current));
  }

  return (
    <aside
      ref={rootRef}
      className={styles.companion}
      data-character={character.id}
      data-phase={appearance.phase}
      aria-label="页角陪逛"
      inert={appearance.phase === "leaving"}
      onPointerEnter={(event) => holdPointer(true, event.pointerType)}
      onPointerLeave={(event) => holdPointer(false, event.pointerType)}
    >
      {appearance.message ? (
        <span className={styles.greeting} role="status">
          {character.greeting}
        </span>
      ) : null}
      <button
        className={styles.close}
        type="button"
        aria-label="暂时收起陪逛角色"
        title="本次浏览暂时收起"
        onClick={() => setEnabled(false)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 8 8 8M16 8l-8 8" />
        </svg>
      </button>
      <button
        className={styles.character}
        type="button"
        aria-label={`和${character.name}打个招呼`}
        onClick={() => controllerRef.current?.respond()}
      >
        <Image
          className={styles.portrait}
          src={sitePath(`/characters/companions/${character.id}-v1.webp`)}
          alt=""
          width={512}
          height={512}
          sizes="(max-width: 700px) 88px, 124px"
          loading="eager"
          draggable={false}
        />
      </button>
    </aside>
  );
}

export function CompanionToggle() {
  const mode = useSyncExternalStore(subscribe, companionSnapshot, serverSnapshot);
  const paused = mode === "motion-off" || mode === "system";
  const enabled = mode === "on";
  return (
    <button
      className={styles.toggle}
      type="button"
      aria-pressed={enabled}
      disabled={paused}
      title={paused ? "陪逛会随动效一起暂停" : undefined}
      onClick={() => setEnabled(!enabled)}
    >
      {paused ? "陪逛已暂停" : enabled ? "陪逛已开启" : "陪逛已收起"}
      {mode === "system" ? (
        <span className="sr-only">，遵循系统的减少动态效果设置</span>
      ) : null}
    </button>
  );
}
