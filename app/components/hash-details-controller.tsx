"use client";

import { useEffect } from "react";

/**
 * Opens a deep-linked `<details>` block without adding a second animated jump
 * during initial page load. Later hash changes receive a short, user-initiated
 * scroll unless reduced motion is requested.
 */
export function HashDetailsController() {
  useEffect(() => {
    function revealTarget(shouldScroll: boolean) {
      if (!window.location.hash) return;

      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (!(target instanceof HTMLDetailsElement)) return;

      target.open = true;
      if (!shouldScroll) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    revealTarget(false);
    const onHashChange = () => revealTarget(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
