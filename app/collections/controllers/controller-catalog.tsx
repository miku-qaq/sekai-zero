"use client";

import Image from "next/image";
import { useState } from "react";
import { controllerCollection } from "@/content/controllers";
import { sitePath } from "@/lib/site-path";
import styles from "./controllers.module.css";
import { CollectionLightbox } from "../collection-lightbox";

const previewItems = controllerCollection.map((entry) => ({
  id: entry.id,
  title: entry.title,
  subtitle: entry.edition,
  image: entry.image,
  imageAlt: entry.imageAlt,
  sourceUrl: entry.sourceUrl,
}));

export function ControllerCatalog() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
                  onClick={() => setSelectedId(entry.id)}
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
      {selectedId ? (
        <CollectionLightbox
          items={previewItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </>
  );
}
