import Image from "next/image";
import { worldRoutes, type WorldRouteHref } from "@/content/site";
import { sitePath } from "@/lib/site-path";

type PageMastheadProps = {
  currentHref: WorldRouteHref;
  subpageLabel?: string;
  title: string;
  lead: string;
  meta?: readonly { label: string; value: string }[];
  artwork?: { src: string; alt: string; width: number; height: number };
  /** Collection rooms disable entry motion so client navigation feels continuous. */
  animate?: boolean;
};

/** Shared opening frame driven by the canonical route registry. */
export function PageMasthead({
  currentHref,
  subpageLabel,
  title,
  lead,
  meta = [],
  artwork,
  animate = true,
}: PageMastheadProps) {
  const route = worldRoutes.find((item) => item.href === currentHref);

  if (!route) {
    throw new Error(`Unknown public route: ${currentHref}`);
  }

  const fileCode = `FILE ${route.index}`;
  const reveal = (step: string) => (animate ? ` reveal ${step}` : "");

  return (
    <section
      className={`subpage-hero subpage-${route.tone} section-shell`}
      id="top"
      data-artwork={artwork ? true : undefined}
    >
      <div className={`subpage-crumb${reveal("reveal-one")}`}>
        <a href={sitePath("/")}>首页</a>
        <span aria-hidden="true">/</span>
        <span>{route.navLabel}</span>
        {subpageLabel ? (
          <>
            <span aria-hidden="true">/</span>
            <span>{subpageLabel}</span>
          </>
        ) : null}
      </div>
      <div className="subpage-copy">
        <p className={`eyebrow${reveal("reveal-one")}`}>
          <span className="status-dot" aria-hidden="true" />
          {route.eyebrow}
        </p>
        <h1 className={animate ? "reveal reveal-two" : undefined}>{title}</h1>
        <p className={`subpage-lead${reveal("reveal-three")}`}>{lead}</p>
      </div>
      {artwork ? (
        <figure className={`subpage-artwork${reveal("reveal-three")}`}>
          <Image
            src={sitePath(artwork.src)}
            alt={artwork.alt}
            width={artwork.width}
            height={artwork.height}
            sizes="(max-width: 900px) 90vw, 46vw"
            priority
          />
          <figcaption>
            <span>FAN ART / FAVORITES</span>
            <span>好き × 3</span>
          </figcaption>
        </figure>
      ) : (
        <div className={`subpage-visual${reveal("reveal-three")}`} aria-hidden="true">
          <span className="subpage-visual-code">{fileCode}</span>
          <strong>{route.motif}</strong>
          <span className="subpage-visual-caption">{route.title}</span>
          <i className="subpage-orbit" />
        </div>
      )}
      {meta.length > 0 ? (
        <dl
          className={`subpage-meta${reveal("reveal-four")}`}
          style={{ gridTemplateColumns: `repeat(${meta.length}, minmax(0, 1fr))` }}
        >
          {meta.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
