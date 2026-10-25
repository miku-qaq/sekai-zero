"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { sitePath } from "@/lib/site-path";
import styles from "./collection-lightbox.module.css";

export type CollectionImage = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel?: string;
  imageNote?: string;
  story?: string;
};

/** One viewer for the current filtered collection; moving never opens a new dialog. */
export function CollectionLightbox({
  items,
  selectedId,
  onSelect,
  onClose,
}: {
  items: readonly CollectionImage[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const closingRef = useRef(false);
  const titleId = useId();
  const index = items.findIndex((item) => item.id === selectedId);
  const item = items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  function moveBy(offset: number) {
    const next = items[index + offset];
    if (next) onSelect(next.id);
  }

  function requestClose() {
    // 地址栏返回是异步的，拦住快速连点，避免一次关闭退回两页。
    if (closingRef.current) return;
    closingRef.current = true;
    onClose();
  }

  if (!item) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native modal dialog owns the gallery arrow keys and backdrop dismissal; showModal provides focus containment.
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        // Only the backdrop dismisses the viewer; padding and image clicks stay put.
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          requestClose();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("input, textarea, select, [contenteditable='true']")
        )
          return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          moveBy(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>
            COLLECTION / {String(index + 1).padStart(2, "0")}
          </span>
          <h2 id={titleId}>{item.title}</h2>
          {item.subtitle ? <p>{item.subtitle}</p> : null}
        </div>
        <button
          className={styles.close}
          type="button"
          onClick={requestClose}
          aria-label="关闭大图"
        >
          ×
        </button>
      </div>
      <div
        className={styles.stage}
        onTouchStart={(event) => {
          // 多指缩放与放大后的平移交给浏览器，不将它们误认为翻页。
          if (
            event.touches.length !== 1 ||
            (window.visualViewport?.scale ?? 1) > 1.05
          ) {
            touchRef.current = null;
            return;
          }
          const touch = event.touches[0];
          touchRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
        }}
        onTouchMove={(event) => {
          if (event.touches.length !== 1) touchRef.current = null;
        }}
        onTouchCancel={() => {
          touchRef.current = null;
        }}
        onTouchEnd={(event) => {
          const start = touchRef.current;
          touchRef.current = null;
          if (
            !start ||
            event.touches.length ||
            (window.visualViewport?.scale ?? 1) > 1.05
          )
            return;
          const touch = event.changedTouches[0];
          if (!touch) return;
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (
            Math.abs(dx) >= 56 &&
            Math.abs(dx) > Math.abs(dy) * 1.5 &&
            Date.now() - start.time < 850
          ) {
            moveBy(dx < 0 ? 1 : -1);
          }
        }}
      >
        <Image
          key={item.id}
          src={sitePath(item.image)}
          alt={item.imageAlt}
          width={900}
          height={900}
          unoptimized
          draggable={false}
        />
      </div>
      <div className={styles.navigation} aria-label="浏览收藏大图">
        <button
          type="button"
          onClick={() => moveBy(-1)}
          disabled={index === 0}
          aria-label="上一件收藏"
        >
          ← <span>上一件</span>
        </button>
        <p role="status" aria-live="polite" aria-atomic="true">
          <strong>{String(index + 1).padStart(2, "0")}</strong> /{" "}
          {String(items.length).padStart(2, "0")}
          <span className="sr-only"> · {item.title}</span>
        </p>
        <button
          type="button"
          onClick={() => moveBy(1)}
          disabled={index === items.length - 1}
          aria-label="下一件收藏"
        >
          <span>下一件</span> →
        </button>
      </div>
      <div className={styles.footer}>
        <span>{item.imageNote ?? "商品展示图 · 非本人实拍"}</span>
        {item.sourceUrl ? (
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            {item.sourceLabel ?? "商品资料"} ↗
            <span className="sr-only">（将在新标签页打开）</span>
          </a>
        ) : null}
      </div>
      {item.story !== undefined ? (
        <details key={`story-${item.id}`} className={styles.story}>
          <summary>小故事</summary>
          <div
            className={styles.storyPage}
            role="note"
            aria-label={item.story ? undefined : "留给未来的小故事"}
          >
            {item.story ? <p>{item.story}</p> : null}
          </div>
        </details>
      ) : null}
    </dialog>
  );
}
