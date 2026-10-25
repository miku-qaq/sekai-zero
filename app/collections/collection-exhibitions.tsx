import Image from "next/image";
import { collectionItems } from "@/content/collection-items";
import { collectionExhibitions } from "@/content/exhibitions";
import { sitePath } from "@/lib/site-path";
import { CollectionLink } from "./collection-link";
import styles from "./collection-exhibitions.module.css";

export function CollectionExhibitions() {
  return (
    <section
      className={`section-shell section-pad ${styles.section}`}
      aria-labelledby="exhibitions-title"
    >
      <div className={`section-heading horizontal-heading ${styles.heading}`}>
        <div>
          <p className="section-index">01 / LITTLE EXHIBITIONS</p>
          <h2 id="exhibitions-title">换个角度，逛收藏。</h2>
        </div>
        <CollectionLink className={styles.galleryLink} href="/collections/gallery/">
          打开画册 <span aria-hidden="true">↗</span>
        </CollectionLink>
      </div>
      <div className={styles.grid}>
        {collectionExhibitions.map((exhibition, index) => {
          const preview = exhibition.items
            .slice(0, 3)
            .flatMap((id) => collectionItems.filter((item) => item.id === id));
          return (
            <CollectionLink
              key={exhibition.id}
              href={`/collections/gallery/?exhibit=${exhibition.id}`}
              className={styles.exhibition}
              data-tone={exhibition.tone}
            >
              <div className={styles.topline}>
                <span>EXHIBITION / 0{index + 1}</span>
                <span>{exhibition.items.length} 件</span>
              </div>
              <div className={styles.pictures} aria-hidden="true">
                {preview.map((item) => (
                  <span key={item.id} data-fit={item.fit}>
                    <Image
                      src={sitePath(item.image)}
                      alt=""
                      width={300}
                      height={420}
                      sizes="(max-width: 760px) 30vw, 12vw"
                      loading="lazy"
                      unoptimized
                    />
                  </span>
                ))}
              </div>
              <div className={styles.copy}>
                <h3>{exhibition.title}</h3>
                <p>{exhibition.description}</p>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </CollectionLink>
          );
        })}
      </div>
    </section>
  );
}
