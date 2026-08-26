import { worldRoutes, type WorldRouteHref } from "@/content/site";
import { sitePath } from "@/lib/site-path";

const homeStop = {
  index: "00",
  href: "/",
  navLabel: "首页",
} as const;

/** A clear route handoff: current location, home and one suggested next page. */
export function JourneyNavigation({ currentHref }: { currentHref: WorldRouteHref }) {
  const currentIndex = worldRoutes.findIndex((route) => route.href === currentHref);

  if (currentIndex < 0) return null;

  const next =
    currentIndex === worldRoutes.length - 1 ? homeStop : worldRoutes[currentIndex + 1];

  return (
    <nav className="journey-navigation section-shell" aria-label="继续浏览网站">
      <a className="journey-link journey-previous" href={sitePath(homeStop.href)}>
        <span>BACK TO HOME</span>
        <strong>
          <span aria-hidden="true">←</span> 返回首页
        </strong>
      </a>

      <div className="journey-progress" aria-label="当前页面位置">
        <span>当前位置</span>
        <strong>
          {worldRoutes[currentIndex].navLabel} · {worldRoutes[currentIndex].index} /{" "}
          {String(worldRoutes.length).padStart(2, "0")}
        </strong>
      </div>

      <a className="journey-link journey-next" href={sitePath(next.href)}>
        <span>{next.href === "/" ? "FINISH" : `NEXT / ${next.index}`}</span>
        <strong>
          {next.navLabel} <span aria-hidden="true">→</span>
        </strong>
      </a>
    </nav>
  );
}
