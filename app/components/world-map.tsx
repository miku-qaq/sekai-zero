import Image from "next/image";
import { animeCatalog } from "@/content/anime";
import { worldRoutes } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./world-map.module.css";
import { RouteStamp } from "./roaming-notebook";

const collectionPreview = ["wandering-witch", "frieren", "bocchi-the-rock"]
  .map((id) => animeCatalog.find((entry) => entry.id === id))
  .filter((entry) => entry !== undefined);

/** Homepage route teasers; detailed content lives on its own shareable URL. */
export function WorldMap() {
  return (
    <section
      className="world-map section-shell section-pad"
      aria-labelledby="world-map-title"
    >
      <div className="section-heading horizontal-heading">
        <div>
          <p className="section-index">02 / EXPLORE</p>
          <h2 id="world-map-title">从这里开始浏览。</h2>
        </div>
      </div>
      <div className="world-route-grid">
        {worldRoutes.map((route) => (
          <a
            className={`world-route-card world-route-${route.tone} ${route.href === "/collections/" ? styles.collectionCard : ""}`}
            href={sitePath(route.href)}
            key={route.href}
            data-layout={route.layout}
            data-scene-reveal
          >
            <span className={styles.topline}>
              <span className="world-route-index">ROUTE / {route.index}</span>
              <RouteStamp href={route.href} />
            </span>
            {route.href === "/collections/" ? (
              <div className={styles.coverStack} aria-hidden="true">
                {collectionPreview.map((entry) => (
                  <Image
                    key={entry.id}
                    src={sitePath(entry.image)}
                    alt=""
                    width={180}
                    height={270}
                    sizes="(max-width: 760px) 40px, 64px"
                    loading="lazy"
                    unoptimized
                  />
                ))}
              </div>
            ) : (
              <span className="world-route-motif" aria-hidden="true">
                {route.motif}
              </span>
            )}
            <div>
              <p>{route.eyebrow}</p>
              <h3>{route.title}</h3>
              <span>{route.description}</span>
            </div>
            <strong>{route.action}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}
