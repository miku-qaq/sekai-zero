"use client";

import { useSyncExternalStore } from "react";
import { favoriteChannels } from "@/content/site";
import { sitePath } from "@/lib/site-path";

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

/**
 * A playful, copyright-conscious tribute. The original key visual establishes
 * the site's own cast; this selector references the owner's favorites through
 * editorial copy, palettes and motifs instead of reproducing official assets.
 */
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
    <div className="channel-console">
      <div className="channel-screen" aria-live="polite">
        <div className="channel-screen-grid" aria-hidden="true" />
        <div className="channel-manga-burst" lang="ja" aria-hidden="true">
          好き!
        </div>
        <div className="channel-screen-header">
          <span>CHARACTER INSPIRATION ARCHIVE</span>
          <span className="channel-live">
            <i /> LIVE
          </span>
        </div>
        <div className="channel-rarity-row">
          <span className="rarity-badge">{active.rarity} PICK</span>
          <span>
            CH.{active.index} / {active.chapter}
          </span>
        </div>
        <div className="channel-screen-content">
          <span className="channel-glyph" aria-hidden="true">
            {active.motif}
          </span>
          <div>
            <p>{active.signal}</p>
            <h3>{active.name}</h3>
            <span>{active.romanized}</span>
          </div>
        </div>
        <p className="channel-quote">{active.note}</p>
        <a className="channel-program" href={sitePath(active.program.href)}>
          <span>NOW PLAYING / {active.program.label}</span>
          <strong>{active.program.title}</strong>
          <p>{active.program.description}</p>
          <i>
            {active.program.action} <span aria-hidden="true">↗</span>
          </i>
        </a>
        <div className="channel-screen-footer">
          <ul className="channel-tags" aria-label={`${active.name} 频道关键词`}>
            {active.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
          <div className="channel-connection" aria-label="主题频道已接通">
            <span>CHANNEL CONNECTED</span>
            <i aria-hidden="true">
              <b style={{ width: "100%" }} />
            </i>
          </div>
        </div>
        <div className="equalizer" aria-hidden="true">
          {Array.from({ length: 22 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>

      <div className="channel-options" role="group" aria-label="切换喜爱角色主题">
        {favoriteChannels.map((channel) => {
          const selected = channel.id === activeChannel;
          return (
            <button
              className={`channel-option channel-${channel.id}`}
              type="button"
              key={channel.id}
              aria-pressed={selected}
              onClick={() => selectChannel(channel.id)}
            >
              <span className="channel-option-index">CH / {channel.index}</span>
              <span className="channel-option-rarity">{channel.rarity}</span>
              <span className="channel-option-symbol" aria-hidden="true">
                {channel.motif}
              </span>
              <span className="channel-option-name">
                <strong>{channel.name}</strong>
                <small>{channel.romanized}</small>
              </span>
              <span className="channel-check" aria-hidden="true">
                {selected ? "●" : "○"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="channel-hint">
        <span aria-hidden="true">↳</span>{" "}
        点击角色卡会切换整站信号色，也会接通一条真实的站内节目。
      </p>
    </div>
  );
}
