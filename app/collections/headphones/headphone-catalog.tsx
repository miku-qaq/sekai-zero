"use client";

import Image from "next/image";
import { useState } from "react";
import { headphoneCollection } from "@/content/headphones";
import { collectionStories } from "@/content/collection-stories";
import { sitePath } from "@/lib/site-path";
import { CollectionLightbox, type CollectionImage } from "../collection-lightbox";
import styles from "../devices/devices.module.css";

const brands = [
  { id: "all", label: "全部" },
  { id: "Sony", label: "Sony" },
  { id: "Apple", label: "Apple" },
] as const;
type BrandFilter = (typeof brands)[number]["id"];

// 原始编号与品牌筛选无关；迁入耳机馆的藏品继续使用原有稳定 ID。
const indexedHeadphones = headphoneCollection.map((entry, index) => ({ entry, index }));

export function HeadphoneCatalog() {
  const [brand, setBrand] = useState<BrandFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filteredHeadphones = indexedHeadphones.filter(
    ({ entry }) => brand === "all" || entry.brand === brand,
  );
  const previewItems = filteredHeadphones.flatMap(({ entry }): CollectionImage[] =>
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
      <div className={styles.filters} role="group" aria-label="耳机品牌">
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
        显示 {filteredHeadphones.length} / {headphoneCollection.length} 副耳机收藏
      </p>
      <ol
        className={styles.grid}
        aria-label={`${filteredHeadphones.length} 副耳机收藏`}
      >
        {filteredHeadphones.map(({ entry, index }) => (
          <li key={entry.id} data-collection-card={entry.id}>
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
                      查看大图
                    </span>
                  </button>
                ) : (
                  <div
                    className={styles.placeholder}
                    role="img"
                    aria-label={`${entry.title}暂无展示图`}
                  >
                    <span>HEADPHONES</span>
                    <strong>{entry.shortName}</strong>
                  </div>
                )}
                <span className={styles.recordId}>
                  AUDIO / {String(index + 1).padStart(2, "0")}
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
                <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {entry.brand} 官方
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
