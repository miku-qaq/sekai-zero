"use client";

import { useEffect, useRef } from "react";
import { collectionRooms, type CollectionRoomId } from "@/content/collections";
import { CollectionLink } from "./collection-link";
import styles from "./collection-navigation.module.css";

/** Shared doorway between the collection rooms inside the Wonder Collection. */
export function CollectionNavigation({ current }: { current?: CollectionRoomId }) {
  const routesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const routes = routesRef.current;
    const active = routes?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!routes || !active || routes.scrollWidth <= routes.clientWidth) return;

    // 只移动分馆栏，让当前展柜可见，不改变页面原有的滚动位置。
    routes.scrollLeft =
      active.offsetLeft - (routes.clientWidth - active.offsetWidth) / 2;
  }, [current]);

  return (
    <nav className={styles.switcher} aria-label="奇妙收藏馆分馆导航">
      <div className={styles.intro}>
        <span>MIKUREINA&apos;S WONDER COLLECTION</span>
        <strong>选择一间展柜</strong>
        <div className={styles.actions}>
          <CollectionLink
            href={`/collections/gallery/${current ? `?room=${current}` : ""}`}
          >
            画册模式
          </CollectionLink>
          <CollectionLink href="/collections/">馆内导览</CollectionLink>
        </div>
      </div>
      <div ref={routesRef} className={styles.routes}>
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
            </CollectionLink>
          );
        })}
      </div>
    </nav>
  );
}
