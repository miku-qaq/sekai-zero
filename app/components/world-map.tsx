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
          <p className="section-index">02 / EXPLORE</p>
          <h2 id="world-map-title">从这里开始浏览。</h2>
        </div>
        <p>
          每个页面只负责一件事。先认识我、读学习笔记、逛链接收藏，或查看完整世界线日志。
        </p>
      </div>
      <div className="world-route-grid">
        {worldRoutes.map((route) => (
          <a
            className={`world-route-card world-route-${route.tone}`}
            href={sitePath(route.href)}
            key={route.href}
            data-layout={route.layout}
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
