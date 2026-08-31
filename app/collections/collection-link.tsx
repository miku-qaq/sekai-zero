"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { sitePath } from "@/lib/site-path";

type CollectionLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  scroll?: boolean;
  children: ReactNode;
};

/**
 * Small hydrated boundary for collection navigation.
 *
 * Keeping this wrapper separate lets server-rendered collection pages retain
 * their static HTML while Next/Vinext intercepts ordinary primary clicks for
 * client-side navigation. The rendered anchor still works without JavaScript.
 */
export function CollectionLink({
  href,
  scroll,
  children,
  ...anchorProps
}: CollectionLinkProps) {
  return (
    <Link href={href} scroll={scroll} legacyBehavior>
      <a href={sitePath(href)} {...anchorProps}>
        {children}
      </a>
    </Link>
  );
}
