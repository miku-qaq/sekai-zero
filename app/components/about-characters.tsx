"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { favoriteChannels } from "@/content/site";
import {
  clientChannelSnapshot,
  serverChannelSnapshot,
  setClientChannel,
  subscribeToChannel,
  type ChannelId,
} from "@/lib/character-channel";
import { sitePath } from "@/lib/site-path";
import { CharacterAlbum } from "./character-album";
import styles from "./about-characters.module.css";

/** Keep the profile's three portraits, with the same art book as the homepage. */
export function AboutCharacters() {
  const [albumChannel, setAlbumChannel] = useState<ChannelId | null>(null);
  const selectedChannel = useSyncExternalStore(
    subscribeToChannel,
    clientChannelSnapshot,
    serverChannelSnapshot,
  );

  return (
    <>
      <div className="influence-grid">
        {favoriteChannels.map((signal) => (
          <article className={`influence-card influence-${signal.id}`} key={signal.id}>
            <a
              className={`influence-artwork ${styles.artwork}`}
              href={sitePath(signal.image)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`打开${signal.name}角色画册`}
              aria-haspopup="dialog"
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                )
                  return;
                if (!("HTMLDialogElement" in window)) return;
                event.preventDefault();
                event.currentTarget.focus({ preventScroll: true });
                setAlbumChannel(signal.id);
              }}
            >
              <Image
                src={sitePath(signal.image)}
                alt={signal.imageAlt}
                width={1024}
                height={1536}
                sizes="(max-width: 760px) 44vw, 30vw"
              />
              <small className={styles.label}>翻开画册</small>
            </a>
            <div className="influence-caption">
              <span className="influence-topline">{signal.index} / FAVORITES</span>
              <p>{signal.romanized}</p>
              <h3>{signal.name}</h3>
              <span className="influence-copy">{signal.note}</span>
            </div>
          </article>
        ))}
      </div>
      {albumChannel ? (
        <CharacterAlbum
          initialChannel={albumChannel}
          selectedChannel={selectedChannel}
          onSelectTheme={setClientChannel}
          onClose={() => setAlbumChannel(null)}
        />
      ) : null}
    </>
  );
}
