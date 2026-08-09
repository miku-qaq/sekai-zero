"use client";

import { useEffect, useState } from "react";
import { favoriteChannels } from "@/content/site";

type ChannelId = (typeof favoriteChannels)[number]["id"];

/**
 * A playful, copyright-conscious tribute. The original key visual establishes
 * the site's own cast; this selector references the owner's favorites through
 * editorial copy, palettes and motifs instead of reproducing official assets.
 */
export function FavoriteChannels() {
  const [activeChannel, setActiveChannel] = useState<ChannelId>("miku");

  useEffect(() => {
    document.documentElement.dataset.channel = activeChannel;
  }, [activeChannel]);

  function selectChannel(channel: ChannelId) {
    setActiveChannel(channel);
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
        <p className="channel-quote">「{active.note}」</p>
        <div className="channel-screen-footer">
          <ul className="channel-tags" aria-label={`${active.name} 频道关键词`}>
            {active.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
          <div
            className="sync-meter"
            role="meter"
            aria-label="次元同步率"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={active.sync}
            aria-valuetext={`${active.sync}%`}
          >
            <span>SYNC {active.sync}%</span>
            <i aria-hidden="true">
              <b style={{ width: `${active.sync}%` }} />
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
        <span aria-hidden="true">↳</span> 点击角色卡，整站会同步切换专属信号色。
      </p>
    </div>
  );
}
