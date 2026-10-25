"use client";

import Image from "next/image";
import { useState } from "react";
import { deviceCollection } from "@/content/devices";
import { collectionStories } from "@/content/collection-stories";
import { sitePath } from "@/lib/site-path";
import { CollectionLightbox, type CollectionImage } from "../collection-lightbox";
import styles from "./devices.module.css";

const previewItems = deviceCollection.flatMap((entry): CollectionImage[] =>
  entry.image
    ? [
        {
          id: entry.id,
          title: entry.title,
          subtitle: entry.edition ?? "版本待补充",
          image: entry.image,
          imageAlt: entry.imageAlt,
          sourceUrl: entry.sourceUrl,
          sourceLabel: "Nintendo 官方",
          imageNote: entry.imageNote,
          story: collectionStories[entry.id] ?? "",
        },
      ]
    : [],
);

export function DeviceCatalog() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <ol className={styles.grid} aria-label={`${deviceCollection.length} 台设备收藏`}>
        {deviceCollection.map((entry, index) => (
          <li key={entry.id}>
            <article
              className={styles.card}
              data-tone={entry.tone}
              aria-labelledby={`${entry.id}-title`}
            >
              <div
                className={styles.photo}
                data-placeholder={!entry.image || undefined}
              >
                {entry.image ? (
                  <button
                    type="button"
                    onClick={() => setSelectedId(entry.id)}
                    aria-label={`查看大图：${entry.title}`}
                    aria-haspopup="dialog"
                  >
                    <Image
                      src={sitePath(entry.image)}
                      alt={entry.imageAlt}
                      width={800}
                      height={600}
                      sizes="(max-width: 700px) 90vw, 44vw"
                      loading="lazy"
                      unoptimized
                    />
                    <span className={styles.zoomHint} aria-hidden="true">
                      查看大图 ↗
                    </span>
                  </button>
                ) : (
                  <div
                    className={styles.placeholder}
                    role="img"
                    aria-label={`${entry.title}暂无展示图`}
                  >
                    <span>CONSOLE</span>
                    <strong>{entry.shortName}</strong>
                  </div>
                )}
                <span className={styles.recordId}>
                  DEVICE / {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.brand}>
                  {entry.brand}
                  <span>{entry.category}</span>
                </p>
                <h3 id={`${entry.id}-title`}>{entry.title}</h3>
                <p className={styles.edition}>{entry.edition ?? "版本待补充"}</p>
                {entry.image ? (
                  <p className={styles.imageNote}>{entry.imageNote}</p>
                ) : null}
                <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Nintendo 官方 <span aria-hidden="true">↗</span>
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
