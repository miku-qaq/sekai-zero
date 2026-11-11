"use client";

import Image from "next/image";
import { useState } from "react";
import { favoriteChannels } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./page-masthead.module.css";

type CharacterId = (typeof favoriteChannels)[number]["id"];

/** A local photo fan: stable markup, no automatic rotation or global theme changes. */
export function CharacterPostcard({
  className,
  fileCode,
  featuredCharacter,
}: {
  className: string;
  fileCode: string;
  featuredCharacter: CharacterId;
}) {
  const [selected, setSelected] = useState<CharacterId>(featuredCharacter);
  const active = favoriteChannels.find((character) => character.id === selected)!;
  const supporting = favoriteChannels.filter((character) => character.id !== selected);

  return (
    <div className={className} role="group" aria-label="角色明信片">
      <span className={styles.postcardCode} aria-hidden="true">
        {fileCode} / FAVORITES
      </span>
      <span className={styles.sparkle} aria-hidden="true">
        ✦
      </span>
      <div className={styles.portraits}>
        {favoriteChannels.map((character) => {
          const featured = character.id === selected;
          const slot = featured
            ? "center"
            : supporting[0].id === character.id
              ? "left"
              : "right";

          return (
            <button
              type="button"
              className={styles.portrait}
              data-slot={slot}
              data-featured={featured || undefined}
              data-character={character.id}
              aria-label={`查看${character.name}的角色明信片`}
              aria-pressed={featured}
              onClick={() => setSelected(character.id)}
              key={character.id}
            >
              <Image
                src={sitePath(character.image)}
                alt=""
                width={1024}
                height={1536}
                sizes="(max-width: 900px) 110px, 140px"
                draggable={false}
              />
              <span>{character.name}</span>
            </button>
          );
        })}
      </div>
      <span className={styles.postcardCaption} aria-live="polite" aria-atomic="true">
        {active.name} · {active.tags[0]}
      </span>
      <span className={styles.postcardStamp} aria-hidden="true">
        好き × 3
      </span>
    </div>
  );
}
