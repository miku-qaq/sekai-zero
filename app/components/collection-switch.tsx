import { animeCatalog } from "@/content/anime";
import { gameCatalog } from "@/content/games";
import { sitePath } from "@/lib/site-path";
import styles from "./collection-switch.module.css";

type CollectionKind = "anime" | "games";

const collections = [
  {
    id: "anime" as const,
    href: "/anime/",
    index: "A-01",
    label: "动画收藏",
    count: animeCatalog.length,
    unit: "部已看",
    accent: "pink",
  },
  {
    id: "games" as const,
    href: "/games/",
    index: "G-02",
    label: "游戏收藏",
    count: gameCatalog.length,
    unit: "款游戏",
    accent: "violet",
  },
] as const;

/** Shared doorway between the two collection rooms. */
export function CollectionSwitch({ current }: { current: CollectionKind }) {
  return (
    <nav className={styles.switcher} aria-label="收藏馆分类">
      <div className={styles.intro}>
        <span>MIKUREINA&apos;S COLLECTION</span>
        <strong>选择一座收藏馆</strong>
      </div>
      <div className={styles.routes}>
        {collections.map((collection) => {
          const isCurrent = collection.id === current;
          return (
            <a
              key={collection.id}
              href={sitePath(collection.href)}
              aria-current={isCurrent ? "page" : undefined}
              data-accent={collection.accent}
            >
              <span className={styles.routeIndex}>{collection.index}</span>
              <span className={styles.routeName}>
                <strong>{collection.label}</strong>
                <small>
                  {collection.count} {collection.unit}
                </small>
              </span>
              <span className={styles.routeArrow} aria-hidden="true">
                {isCurrent ? "●" : "↗"}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
