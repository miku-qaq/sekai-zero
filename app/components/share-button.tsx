"use client";

import { useRef, useState } from "react";

/** Uses the native share sheet, clipboard, then a selectable URL in that order. */
export function ShareButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [manualUrl, setManualUrl] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function shareSite() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: "来看看这个持续生长的个人次元站。",
          url: window.location.href,
        });
        return;
      }

      if (!navigator.clipboard) {
        setManualUrl(window.location.href);
        setStatus("manual");
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus("idle"), 1800);
    } catch (error) {
      // Closing the native share sheet is expected and needs no error UI.
      if (error instanceof DOMException && error.name === "AbortError") return;

      setManualUrl(window.location.href);
      setStatus("manual");
    }
  }

  return (
    <div className="share-control">
      <button className="share-button" type="button" onClick={shareSite}>
        <span aria-hidden="true">{status === "copied" ? "✓" : "↗"}</span>
        {status === "copied" ? "链接已复制" : "分享这一话"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? "网站链接已复制到剪贴板" : ""}
      </span>
      {status === "manual" ? (
        <label className="manual-share">
          <span>请手动复制链接</span>
          <input
            type="text"
            readOnly
            value={manualUrl}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="网站链接"
          />
        </label>
      ) : null}
    </div>
  );
}
