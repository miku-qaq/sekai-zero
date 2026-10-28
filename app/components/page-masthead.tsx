import Image from "next/image";
import { favoriteChannels, worldRoutes, type WorldRouteHref } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./page-masthead.module.css";

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
  // 只在独立页面补充角色明信片，收藏分馆继续使用紧凑的开场。
  const showPostcard = !artwork && animate && currentHref !== "/collections/";
  const featuredCharacter =
    currentHref === "/links/" ? "elaina" : currentHref === "/logs/" ? "bocchi" : "miku";
  const supportingCharacters = favoriteChannels.filter(
    (channel) => channel.id !== featuredCharacter,
  );
  const postcardCharacters = [
    ...supportingCharacters.slice(0, 1),
    ...favoriteChannels.filter((channel) => channel.id === featuredCharacter),
    ...supportingCharacters.slice(1),
  ];

  return (
    <section
      className={`subpage-hero subpage-${route.tone} section-shell${showPostcard ? ` ${styles.masthead}` : ""}`}
      id="top"
      data-artwork={artwork ? true : undefined}
      data-character-visual={showPostcard ? true : undefined}
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
      ) : showPostcard ? (
        <div
          className={`subpage-visual ${styles.postcard}${reveal("reveal-three")}`}
          aria-hidden="true"
        >
          <span className={styles.postcardCode}>{fileCode} / FAVORITES</span>
          <span className={styles.sparkle}>✦</span>
          <div className={styles.portraits}>
            {postcardCharacters.map((character) => (
              <span
                className={styles.portrait}
                data-featured={character.id === featuredCharacter || undefined}
                data-character={character.id}
                key={character.id}
              >
                <Image
                  src={sitePath(character.image)}
                  alt=""
                  width={1024}
                  height={1536}
                  sizes="(max-width: 900px) 110px, 140px"
                />
                <span>{character.name}</span>
              </span>
            ))}
          </div>
          <span className={styles.postcardCaption}>SONG · MAGIC · ROCK</span>
          <span className={styles.postcardStamp}>好き × 3</span>
        </div>
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
