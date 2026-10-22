"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  controllerCollection,
  type ControllerCollectionEntry,
} from "@/content/controllers";
import { sitePath } from "@/lib/site-path";
import styles from "./controllers.module.css";

export function ControllerCatalog() {
  const [selected, setSelected] = useState<ControllerCollectionEntry | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <>
      <ol
        className={styles.grid}
        aria-label={`${controllerCollection.length} 只手柄收藏`}
      >
        {controllerCollection.map((entry, index) => (
          <li key={entry.id}>
            <article
              className={styles.card}
              data-tone={entry.tone}
              aria-labelledby={`${entry.id}-title`}
            >
              <div className={styles.photo}>
                <button
                  type="button"
                  onClick={() => setSelected(entry)}
                  aria-label={`查看大图：${entry.title} · ${entry.edition}`}
                  aria-haspopup="dialog"
                >
                  <Image
                    src={sitePath(entry.image)}
                    alt={entry.imageAlt}
                    width={800}
                    height={800}
                    sizes="(max-width: 700px) 90vw, 44vw"
                    loading="lazy"
                    unoptimized
                  />
                  <span className={styles.zoomHint} aria-hidden="true">
                    查看大图 ↗
                  </span>
                </button>
                <span className={styles.recordId}>
                  PAD / {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.brand}>
                  {entry.brand}
                  <span>{entry.collaboration ? "角色联名" : "标准款"}</span>
                </p>
                <h3 id={`${entry.id}-title`}>{entry.title}</h3>
                <p className={styles.edition}>{entry.edition}</p>
                <p className={styles.note}>{entry.note}</p>
                <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                  商品资料 <span aria-hidden="true">↗</span>
                  <span className="sr-only">（将在新标签页打开）</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-labelledby="controller-preview-title"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <div className={styles.lightboxHeading}>
              <div>
                <h2 id="controller-preview-title">{selected.title}</h2>
                <p>{selected.edition}</p>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="关闭大图"
              >
                ×
              </button>
            </div>
            <Image
              src={sitePath(selected.image)}
              alt={selected.imageAlt}
              width={800}
              height={800}
              unoptimized
            />
            <p className={styles.lightboxNote}>商品展示图 · 非本人实拍</p>
          </>
        ) : null}
      </dialog>
    </>
  );
}
