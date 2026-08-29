import { worldRoutes, type WorldRouteHref } from "@/content/site";
import { sitePath } from "@/lib/site-path";

type PageMastheadProps = {
  currentHref: WorldRouteHref;
  subpageLabel?: string;
  title: string;
  lead: string;
  meta: readonly { label: string; value: string }[];
};

/** Shared opening frame driven by the canonical route registry. */
export function PageMasthead({
  currentHref,
  subpageLabel,
  title,
  lead,
  meta,
}: PageMastheadProps) {
  const route = worldRoutes.find((item) => item.href === currentHref);

  if (!route) {
    throw new Error(`Unknown public route: ${currentHref}`);
  }

  const fileCode = `FILE ${route.index}`;

  return (
    <section className={`subpage-hero subpage-${route.tone} section-shell`} id="top">
      <div className="subpage-crumb reveal reveal-one">
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
        <p className="eyebrow reveal reveal-one">
          <span className="status-dot" aria-hidden="true" />
          {route.eyebrow}
        </p>
        <h1 className="reveal reveal-two">{title}</h1>
        <p className="subpage-lead reveal reveal-three">{lead}</p>
      </div>
      <div className="subpage-visual reveal reveal-three" aria-hidden="true">
        <span className="subpage-visual-code">{fileCode}</span>
        <strong>{route.motif}</strong>
        <span className="subpage-visual-caption">{route.title}</span>
        <i className="subpage-orbit" />
      </div>
      <dl className="subpage-meta reveal reveal-four">
        {meta.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
