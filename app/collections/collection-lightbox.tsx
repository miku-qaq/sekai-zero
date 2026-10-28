"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
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
  const filmstripRef = useRef<HTMLDivElement>(null);
  const restoreThumbnailFocus = useRef(false);
  const touchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const closingRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);
  const [direction, setDirection] = useState("next");
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
      if (closeTimer.current) clearTimeout(closeTimer.current);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    if (!restoreThumbnailFocus.current) return;
    restoreThumbnailFocus.current = false;
    // 缩略图窗口移动时，继续把键盘焦点留在当前藏品上。
    filmstripRef.current
      ?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
      ?.focus({ preventScroll: true });
  }, [selectedId]);

  function moveBy(offset: number) {
    const next = items[index + offset];
    if (next && !closingRef.current) {
      restoreThumbnailFocus.current =
        filmstripRef.current?.contains(document.activeElement) ?? false;
      setDirection(offset < 0 ? "previous" : "next");
      onSelect(next.id);
    }
  }

  function requestClose() {
    // 地址栏返回是异步的，拦住快速连点，避免一次关闭退回两页。
    if (closingRef.current) return;
    closingRef.current = true;
    const reduceMotion =
      document.documentElement.dataset.motion === "off" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) onClose();
    else {
      setClosing(true);
      closeTimer.current = setTimeout(onClose, 180);
    }
  }

  if (!item) return null;
  const firstPreview = Math.max(0, Math.min(index - 2, items.length - 5));
  const previews = items.slice(firstPreview, firstPreview + 5);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native modal dialog owns the gallery arrow keys and backdrop dismissal; showModal provides focus containment.
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-labelledby={titleId}
      data-closing={closing || undefined}
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
      <div className={styles.topline}>
        <span>
          奇妙收藏馆 <i aria-hidden="true" /> 藏品画册
        </span>
        <button
          className={styles.close}
          type="button"
          onClick={requestClose}
          aria-label="关闭大图"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className={styles.spread}>
        <div className={styles.visual}>
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
              touchRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now(),
              };
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
            <div className={styles.imageScene} key={item.id} data-direction={direction}>
              <Image
                className={styles.imageWash}
                src={sitePath(item.image)}
                alt=""
                aria-hidden="true"
                width={900}
                height={900}
                unoptimized
                draggable={false}
              />
              <Image
                className={styles.artwork}
                src={sitePath(item.image)}
                alt={item.imageAlt}
                width={900}
                height={900}
                unoptimized
                draggable={false}
              />
            </div>
          </div>
          {items.length > 1 ? (
            <div
              ref={filmstripRef}
              className={styles.filmstrip}
              role="group"
              aria-label="附近的收藏"
            >
              {previews.map((preview, offset) => (
                <button
                  key={preview.id}
                  type="button"
                  aria-label={`查看${preview.title}大图`}
                  aria-pressed={preview.id === item.id}
                  onClick={() => moveBy(firstPreview + offset - index)}
                >
                  <Image
                    src={sitePath(preview.image)}
                    alt=""
                    width={100}
                    height={120}
                    unoptimized
                    draggable={false}
                  />
                  <span>{String(firstPreview + offset + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.details}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              COLLECTION / {String(index + 1).padStart(2, "0")}
            </span>
            <h2 id={titleId}>{item.title}</h2>
            {item.subtitle ? <p>{item.subtitle}</p> : null}
          </div>
          <div className={styles.recordLine}>
            <span>收藏记录</span>
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
          </div>
          <div className={styles.navigation} aria-label="浏览收藏大图">
            <button
              type="button"
              onClick={() => moveBy(-1)}
              disabled={index === 0}
              aria-label="上一件收藏"
            >
              上一件
            </button>
            <button
              type="button"
              onClick={() => moveBy(1)}
              disabled={index === items.length - 1}
              aria-label="下一件收藏"
            >
              下一件
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            第 {index + 1} 件，共 {items.length} 件：{item.title}
          </p>
          <div className={styles.footer}>
            <span>{item.imageNote ?? "商品展示图 · 非本人实拍"}</span>
            {item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                {item.sourceLabel ?? "商品资料"}
                <span className="sr-only">（将在新标签页打开）</span>
              </a>
            ) : null}
          </div>
          {item.story ? (
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
        </div>
      </div>
    </dialog>
  );
}
