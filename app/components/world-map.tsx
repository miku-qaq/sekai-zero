import { worldRoutes } from "@/content/site";
import { sitePath } from "@/lib/site-path";

/** Homepage route teasers; detailed content lives on its own shareable URL. */
export function WorldMap() {
  return (
    <section
      className="world-map section-shell section-pad"
      aria-labelledby="world-map-title"
    >
      <div className="section-heading horizontal-heading">
        <div>
          <p className="section-index">01 / WORLD MAP</p>
          <h2 id="world-map-title">这次，不只是一张首页。</h2>
        </div>
        <p>三个独立频道已经接入主世界；每一页都有自己的任务，也能单独收藏和分享。</p>
      </div>
      <div className="world-route-grid">
        {worldRoutes.map((route) => (
          <a
            className={`world-route-card world-route-${route.tone}`}
            href={sitePath(route.href)}
            key={route.href}
          >
            <span className="world-route-index">ROUTE / {route.index}</span>
            <span className="world-route-motif" aria-hidden="true">
              {route.motif}
            </span>
            <div>
              <p>{route.eyebrow}</p>
              <h3>{route.title}</h3>
              <span>{route.description}</span>
            </div>
            <strong>
              {route.action} <span aria-hidden="true">↗</span>
            </strong>
          </a>
        ))}
      </div>
    </section>
  );
}
