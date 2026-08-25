import { worldRoutes } from "@/content/site";
import { sitePath } from "@/lib/site-path";

type WorldRouteHref = (typeof worldRoutes)[number]["href"];

const homeStop = {
  index: "00",
  href: "/",
  title: "世界入口",
} as const;

/** Previous/next controls driven by the same route order as the global nav. */
export function JourneyNavigation({ currentHref }: { currentHref: WorldRouteHref }) {
  const currentIndex = worldRoutes.findIndex((route) => route.href === currentHref);

  if (currentIndex < 0) return null;

  const previous = currentIndex === 0 ? homeStop : worldRoutes[currentIndex - 1];
  const next =
    currentIndex === worldRoutes.length - 1 ? homeStop : worldRoutes[currentIndex + 1];

  return (
    <nav className="journey-navigation section-shell" aria-label="继续探索世界线">
      <a className="journey-link journey-previous" href={sitePath(previous.href)}>
        <span>PREVIOUS / ROUTE {previous.index}</span>
        <strong>
          <span aria-hidden="true">←</span> {previous.title}
        </strong>
      </a>

      <div className="journey-progress" aria-label="当前世界线进度">
        <span>CURRENT FILE</span>
        <strong>
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(worldRoutes.length).padStart(2, "0")}
        </strong>
        <i aria-hidden="true">
          {worldRoutes.map((route, index) => (
            <b data-active={index === currentIndex} key={route.href} />
          ))}
        </i>
      </div>

      <a className="journey-link journey-next" href={sitePath(next.href)}>
        <span>NEXT / ROUTE {next.index}</span>
        <strong>
          {next.title} <span aria-hidden="true">→</span>
        </strong>
      </a>
    </nav>
  );
}
