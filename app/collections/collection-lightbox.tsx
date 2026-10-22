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

  if (!item) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native modal dialog owns the gallery arrow keys and backdrop dismissal; showModal provides focus containment.
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
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
          onClose();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          moveBy(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>COLLECTION / CLOSE-UP</span>
          <h2 id={titleId}>{item.title}</h2>
          <p>{item.subtitle}</p>
        </div>
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="关闭大图"
        >
          ×
        </button>
      </div>
      <div className={styles.stage}>
        <Image
          key={item.id}
          src={sitePath(item.image)}
          alt={item.imageAlt}
          width={900}
          height={900}
          unoptimized
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
        <span>商品展示图 · 非本人实拍</span>
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          商品资料 ↗<span className="sr-only">（将在新标签页打开）</span>
        </a>
      </div>
    </dialog>
  );
}
