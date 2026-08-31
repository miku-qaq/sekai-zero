import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { CollectionLink } from "./collection-link";
import styles from "./collection-navigation.module.css";

/** Shared doorway between the four rooms inside the Wonder Collection. */
export function CollectionNavigation({ current }: { current?: CollectionRoomId }) {
  return (
    <nav className={styles.switcher} aria-label="奇妙收藏馆分馆导航">
      <div className={styles.intro}>
        <span>MIKUREINA&apos;S WONDER COLLECTION</span>
        <strong>选择一间展柜</strong>
        <CollectionLink href="/collections/">返回馆内导览</CollectionLink>
      </div>
      <div className={styles.routes}>
        {collectionRooms.map((room) => {
          const isCurrent = room.id === current;
          return (
            <CollectionLink
              key={room.id}
              href={room.href}
              scroll={false}
              aria-current={isCurrent ? "page" : undefined}
              data-accent={room.tone}
            >
              <span className={styles.routeIndex}>{room.index}</span>
              <span className={styles.routeName}>
                <strong>{room.label}</strong>
                <small>
                  {room.count} {room.unit}
                </small>
              </span>
              <span className={styles.routeArrow} aria-hidden="true">
                {isCurrent ? "●" : "↗"}
              </span>
            </CollectionLink>
          );
        })}
      </div>
    </nav>
  );
}
