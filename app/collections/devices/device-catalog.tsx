"use client";

import Image from "next/image";
import { useState } from "react";
import { deviceCollection } from "@/content/devices";
import { collectionStories } from "@/content/collection-stories";
import { sitePath } from "@/lib/site-path";
import { CollectionLightbox, type CollectionImage } from "../collection-lightbox";
import styles from "./devices.module.css";

const brands = [
  { id: "all", label: "全部" },
  { id: "Apple", label: "Apple" },
  { id: "Nintendo", label: "Nintendo" },
] as const;
type BrandFilter = (typeof brands)[number]["id"];

// 编号属于设备本身，切换品牌后不会按当前结果重新编号。
const indexedDevices = deviceCollection.map((entry, index) => ({ entry, index }));

export function DeviceCatalog() {
  const [brand, setBrand] = useState<BrandFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filteredDevices = indexedDevices.filter(
    ({ entry }) => brand === "all" || entry.brand === brand,
  );
  const previewItems = filteredDevices.flatMap(({ entry }): CollectionImage[] =>
    entry.image
      ? [
          {
            id: entry.id,
            title: entry.title,
            subtitle: entry.edition || entry.category,
            image: entry.image,
            imageAlt: entry.imageAlt,
            sourceUrl: entry.sourceUrl,
            sourceLabel: `${entry.brand} 官方`,
            imageNote: entry.imageNote,
            story: collectionStories[entry.id] ?? "",
          },
        ]
      : [],
  );

  return (
    <>
      <div className={styles.filters} role="group" aria-label="设备品牌">
        {brands.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={brand === option.id}
            onClick={() => {
              setSelectedId(null);
              setBrand(option.id);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        显示 {filteredDevices.length} / {deviceCollection.length} 件设备收藏
      </p>
      <ol className={styles.grid} aria-label={`${filteredDevices.length} 件设备收藏`}>
        {filteredDevices.map(({ entry, index }) => (
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
                    <span>DEVICE</span>
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
                {entry.edition ? (
                  <p className={styles.edition}>{entry.edition}</p>
                ) : null}
                {entry.image ? (
                  <p className={styles.imageNote}>{entry.imageNote}</p>
                ) : null}
                <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {entry.brand} 官方 <span aria-hidden="true">↗</span>
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
