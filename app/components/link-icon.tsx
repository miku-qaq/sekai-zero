"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { LinkCategoryId } from "@/content/links";
import { sitePath } from "@/lib/site-path";
import styles from "./link-terminal.module.css";

type GlyphKind = LinkCategoryId | "all" | "notebook" | "mail";

/** One quiet line style for categories, local destinations and failed image loads. */
export function NavigationGlyph({
  kind,
  className,
}: {
  kind: GlyphKind;
  className?: string;
}) {
  const paths: Record<GlyphKind, ReactNode> = {
    all: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    video: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 5 3-5 3Z" />
      </>
    ),
    games: (
      <>
        <path d="M8 7h8a4 4 0 0 1 4 3l1 7a2 2 0 0 1-3.4 1.7L15 16H9l-2.6 2.7A2 2 0 0 1 3 17l1-7a4 4 0 0 1 4-3Z" />
        <path d="M8 10v4M6 12h4M16 11h.01M18 13h.01" />
      </>
    ),
    community: (
      <>
        <path d="M20 11a7 7 0 0 1-7 7H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z" />
        <path d="M7 8h9M7 12h6" />
      </>
    ),
    shopping: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    study: (
      <>
        <path d="M12 6C8 3 4 4 3 5v14c3-2 6-1 9 1 3-2 6-3 9-1V5c-1-1-5-2-9 1Z" />
        <path d="M12 6v14" />
      </>
    ),
    site: (
      <>
        <path d="m3 11 9-8 9 8M5 10v11h14V10" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    notebook: (
      <>
        <rect x="5" y="3" width="15" height="18" rx="2" />
        <path d="M9 3v18M3 7h4M3 12h4M3 17h4M12 8h5M12 12h5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  };

  return (
    <svg
      className={`${styles.glyph}${className ? ` ${className}` : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[kind]}
    </svg>
  );
}

/** Only bundled local artwork is allowed; every icon retains a drawn fallback. */
export function LinkIcon({ icon, group }: { icon: string; group: LinkCategoryId }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const internal = icon === "notebook" || icon === "mail";
  const hasImage =
    /^\/link-icons\/[\w.-]+\.(?:png|svg)$/.test(icon) && failedSource !== icon;

  return (
    <span
      className="terminal-card-icon"
      data-internal={internal || !hasImage || undefined}
      data-brand={
        hasImage && icon.endsWith("/nintendo-switch.svg") ? "nintendo" : undefined
      }
      aria-hidden="true"
    >
      {hasImage ? (
        <Image
          className={styles.logoImage}
          src={sitePath(icon)}
          alt=""
          width={32}
          height={32}
          unoptimized
          onError={() => setFailedSource(icon)}
        />
      ) : (
        <NavigationGlyph kind={internal ? icon : group} />
      )}
    </span>
  );
}
