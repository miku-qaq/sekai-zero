"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { favoriteChannels } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./favorite-channels.module.css";

type ChannelId = (typeof favoriteChannels)[number]["id"];
const CHANNEL_STORAGE_KEY = "sekai-channel";
const CHANNEL_CHANGE_EVENT = "sekai-channel-change";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
type ChannelTransition = {
  from: ChannelId;
  to: ChannelId;
  direction: "next" | "previous";
  ready: boolean;
};

function canAnimate() {
  return (
    document.documentElement.dataset.motion !== "off" &&
    !window.matchMedia(REDUCED_MOTION).matches
  );
}

function isChannelId(value: string | null | undefined): value is ChannelId {
  return favoriteChannels.some((channel) => channel.id === value);
}

function clientChannelSnapshot(): ChannelId {
  const channel = document.documentElement.dataset.channel;
  return isChannelId(channel) ? channel : "miku";
}

function serverChannelSnapshot(): ChannelId {
  return "miku";
}

function subscribeToChannel(onStoreChange: () => void) {
  window.addEventListener(CHANNEL_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CHANNEL_CHANGE_EVENT, onStoreChange);
}

function setClientChannel(channel: ChannelId) {
  document.documentElement.dataset.channel = channel;
  try {
    window.localStorage.setItem(CHANNEL_STORAGE_KEY, channel);
  } catch {
    // The active visual channel still works for this page without storage.
  }
  window.dispatchEvent(new Event(CHANNEL_CHANGE_EVENT));
}

/** The selected character pairs a dedicated fan illustration with the site theme. */
export function FavoriteChannels() {
  const [transition, setTransition] = useState<ChannelTransition | null>(null);
  const transitionRef = useRef<ChannelTransition | null>(null);
  const departureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeChannel = useSyncExternalStore(
    subscribeToChannel,
    clientChannelSnapshot,
    serverChannelSnapshot,
  );

  const finishTransition = useCallback(() => {
    if (departureTimer.current) clearTimeout(departureTimer.current);
    departureTimer.current = null;
    transitionRef.current = null;
    setTransition(null);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION);
    function settleMotion() {
      if (!canAnimate()) finishTransition();
    }
    const observer = new MutationObserver(settleMotion);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    preference.addEventListener("change", settleMotion);
    window.addEventListener("sekai-motion-change", settleMotion);
    return () => {
      if (departureTimer.current) clearTimeout(departureTimer.current);
      observer.disconnect();
      preference.removeEventListener("change", settleMotion);
      window.removeEventListener("sekai-motion-change", settleMotion);
    };
  }, [finishTransition]);

  function selectChannel(channel: ChannelId) {
    const current = clientChannelSnapshot();
    if (current === channel) return;
    if (departureTimer.current) clearTimeout(departureTimer.current);
    // Keep the last visible portrait when several choices arrive before an image loads.
    const from =
      transitionRef.current && !transitionRef.current.ready
        ? transitionRef.current.from
        : current;
    if (canAnimate() && from !== channel) {
      const next: ChannelTransition = {
        from,
        to: channel,
        direction:
          favoriteChannels.findIndex((entry) => entry.id === channel) >
          favoriteChannels.findIndex((entry) => entry.id === from)
            ? "next"
            : "previous",
        ready: false,
      };
      transitionRef.current = next;
      setTransition(next);
    } else finishTransition();
    setClientChannel(channel);
  }

  function revealPortrait(channel: ChannelId) {
    const pending = transitionRef.current;
    if (!pending || pending.to !== channel || pending.ready) return;
    if (!canAnimate()) {
      finishTransition();
      return;
    }
    const ready = { ...pending, ready: true };
    transitionRef.current = ready;
    setTransition(ready);
    departureTimer.current = setTimeout(finishTransition, 440);
  }

  function recoverPortrait(channel: ChannelId) {
    const pending = transitionRef.current;
    if (!pending || pending.to !== channel) return;
    finishTransition();
    setClientChannel(pending.from);
  }

  const active = favoriteChannels.find((channel) => channel.id === activeChannel)!;
  const previous = favoriteChannels.find((channel) => channel.id === transition?.from);

  return (
    <div className={styles.gallery}>
      <div className={styles.spotlight} data-direction={transition?.direction}>
        <a
          className={styles.artwork}
          href={sitePath(active.image)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`查看${active.name}插画大图（新标签页）`}
          data-turning={transition?.ready || undefined}
        >
          <Image
            key={active.id}
            className={`${styles.portrait} ${styles.currentPortrait}`}
            data-loading={Boolean(transition && !transition.ready) || undefined}
            src={sitePath(active.image)}
            alt={active.imageAlt}
            width={1024}
            height={1536}
            sizes="(max-width: 600px) 48vw, (max-width: 1100px) 40vw, 280px"
            onLoad={() => revealPortrait(active.id)}
            onError={() => recoverPortrait(active.id)}
          />
          {previous ? (
            <span
              className={styles.previousPortrait}
              aria-hidden="true"
              key={previous.id}
            >
              <Image
                className={styles.portrait}
                src={sitePath(previous.image)}
                alt=""
                width={1024}
                height={1536}
                sizes="(max-width: 600px) 48vw, (max-width: 1100px) 40vw, 280px"
              />
            </span>
          ) : null}
        </a>
        <div className={styles.identity} aria-live="polite" aria-atomic="true">
          <div className={styles.identityPage} key={active.id}>
            <span className={styles.index}>{active.index} / FAVORITES</span>
            <h3>{active.name}</h3>
            <span className={styles.romanized}>{active.romanized}</span>
            <p>{active.note}</p>
          </div>
        </div>
        <a className={styles.program} href={sitePath(active.program.href)}>
          <div className={styles.programPage} key={active.id}>
            <strong>{active.program.title}</strong>
            <p>{active.program.description}</p>
            <span>{active.program.action}</span>
          </div>
        </a>
      </div>

      <div className={styles.options} role="group" aria-label="切换喜爱角色主题">
        {favoriteChannels.map((channel) => {
          const selected = channel.id === activeChannel;
          return (
            <button
              className={styles.option}
              type="button"
              key={channel.id}
              aria-pressed={selected}
              onClick={() => selectChannel(channel.id)}
            >
              <Image
                className={styles.thumbnail}
                src={sitePath(channel.image)}
                alt=""
                width={1024}
                height={1536}
                sizes="(max-width: 600px) 28vw, (max-width: 1100px) 29vw, 180px"
              />
              <span className={styles.optionName}>
                <strong>{channel.name}</strong>
                <span className={styles.selected} aria-hidden="true">
                  {selected ? "✓" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className={styles.hint}>点选角色，切换插画与主题色。</p>
    </div>
  );
}
