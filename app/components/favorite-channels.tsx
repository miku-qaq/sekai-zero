"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { favoriteChannels } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./favorite-channels.module.css";

type ChannelId = (typeof favoriteChannels)[number]["id"];
const CHANNEL_STORAGE_KEY = "sekai-channel";
const CHANNEL_CHANGE_EVENT = "sekai-channel-change";

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
  const activeChannel = useSyncExternalStore(
    subscribeToChannel,
    clientChannelSnapshot,
    serverChannelSnapshot,
  );

  function selectChannel(channel: ChannelId) {
    setClientChannel(channel);
  }

  const active = favoriteChannels.find((channel) => channel.id === activeChannel)!;

  return (
    <div className={styles.gallery}>
      <div className={styles.spotlight}>
        <a
          className={styles.artwork}
          href={sitePath(active.image)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`查看${active.name}插画大图（新标签页）`}
        >
          <Image
            key={active.id}
            className={styles.portrait}
            src={sitePath(active.image)}
            alt={active.imageAlt}
            width={1024}
            height={1536}
            sizes="(max-width: 600px) 48vw, (max-width: 1100px) 40vw, 280px"
          />
          <span className={styles.expand} aria-hidden="true">
            ↗
          </span>
        </a>
        <div className={styles.identity} aria-live="polite" aria-atomic="true">
          <span className={styles.index}>{active.index} / FAVORITES</span>
          <h3>{active.name}</h3>
          <span className={styles.romanized}>{active.romanized}</span>
          <p>{active.note}</p>
        </div>
        <a className={styles.program} href={sitePath(active.program.href)}>
          <strong>{active.program.title}</strong>
          <p>{active.program.description}</p>
          <span>
            {active.program.action} <span aria-hidden="true">↗</span>
          </span>
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
