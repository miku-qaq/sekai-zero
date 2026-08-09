import { sitePath } from "@/lib/site-path";

type PageMastheadProps = {
  episode: string;
  eyebrow: string;
  title: string;
  lead: string;
  motif: string;
  tone: "mint" | "violet" | "pink" | "blue";
  meta: readonly { label: string; value: string }[];
};

/** Shared opening frame for secondary pages; content remains route-specific. */
export function PageMasthead({
  episode,
  eyebrow,
  title,
  lead,
  motif,
  tone,
  meta,
}: PageMastheadProps) {
  return (
    <section className={`subpage-hero subpage-${tone} section-shell`} id="top">
      <div className="subpage-crumb reveal reveal-one">
        <a href={sitePath("/")}>SEKAI / 00</a>
        <span aria-hidden="true">/</span>
        <span>{episode}</span>
      </div>
      <div className="subpage-copy">
        <p className="eyebrow reveal reveal-one">
          <span className="status-dot" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="reveal reveal-two">{title}</h1>
        <p className="subpage-lead reveal reveal-three">{lead}</p>
      </div>
      <div className="subpage-visual reveal reveal-three" aria-hidden="true">
        <span className="subpage-visual-code">{episode}</span>
        <strong>{motif}</strong>
        <span className="subpage-visual-caption">PERSONAL SIGNAL / ON AIR</span>
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
