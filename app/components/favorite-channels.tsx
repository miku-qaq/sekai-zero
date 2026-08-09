"use client";

import { useEffect, useState } from "react";
import { favoriteChannels } from "@/content/site";

type ChannelId = (typeof favoriteChannels)[number]["id"];

/**
 * A playful, copyright-conscious tribute: each favorite is represented through
 * palette, rhythm and symbols rather than copied character artwork.
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
        <div className="channel-screen-header">
          <span>FAVORITE SIGNAL SELECTOR</span>
          <span className="channel-live">
            <i /> LIVE
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
        <div className="equalizer" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
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
        <span aria-hidden="true">↳</span> 点击频道，观察整站的信号颜色。
      </p>
    </div>
  );
}
