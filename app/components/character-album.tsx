"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { favoriteChannels } from "@/content/site";
import { sitePath } from "@/lib/site-path";
import styles from "./character-album.module.css";

type ChannelId = (typeof favoriteChannels)[number]["id"];

/** A small, on-demand art book. Browsing a page does not change the site theme. */
export function CharacterAlbum({
  initialChannel,
  selectedChannel,
  onSelectTheme,
  onClose,
}: {
  initialChannel: ChannelId;
  selectedChannel: ChannelId;
  onSelectTheme: (id: ChannelId) => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(() =>
    favoriteChannels.findIndex((entry) => entry.id === initialChannel),
  );
  const [direction, setDirection] = useState("next");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const titleId = useId();
  const character = favoriteChannels[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, []);

  function turnTo(next: number) {
    if (next < 0 || next >= favoriteChannels.length || next === index) return;
    setDirection(next > index ? "next" : "previous");
    setIndex(next);
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native modal owns arrow-key navigation and backdrop dismissal; showModal contains focus.
    <dialog
      ref={dialogRef}
      className={styles.album}
      aria-labelledby={titleId}
      data-character={character.id}
      data-direction={direction}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          turnTo(index + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
    >
      <div className={styles.topline}>
        <span>SEKAI / 角色画册</span>
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="合上角色画册"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className={styles.spread}>
        <div className={styles.visual}>
          <div
            className={styles.stage}
            onTouchStart={(event) => {
              if (
                event.touches.length !== 1 ||
                (window.visualViewport?.scale ?? 1) > 1.05
              ) {
                touchRef.current = null;
                return;
              }
              const touch = event.touches[0];
              touchRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now(),
              };
            }}
            onTouchMove={(event) => {
              if (event.touches.length !== 1) touchRef.current = null;
            }}
            onTouchCancel={() => {
              touchRef.current = null;
            }}
            onTouchEnd={(event) => {
              const start = touchRef.current;
              touchRef.current = null;
              if (
                !start ||
                event.touches.length ||
                (window.visualViewport?.scale ?? 1) > 1.05
              )
                return;
              const touch = event.changedTouches[0];
              if (!touch) return;
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (
                Math.abs(dx) >= 56 &&
                Math.abs(dx) > Math.abs(dy) * 1.5 &&
                Date.now() - start.time < 850
              )
                turnTo(index + (dx < 0 ? 1 : -1));
            }}
          >
            {favoriteChannels.map((entry, page) => (
              <div
                className={styles.page}
                key={entry.id}
                data-active={page === index}
                aria-hidden={page !== index}
              >
                <Image
                  className={styles.portrait}
                  src={sitePath(entry.image)}
                  alt={page === index ? entry.imageAlt : ""}
                  width={1024}
                  height={1536}
                  sizes="(max-width: 600px) 70vw, 400px"
                  loading="eager"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className={styles.tabs} role="group" aria-label="翻阅角色画册">
            {favoriteChannels.map((entry, page) => (
              <button
                type="button"
                key={entry.id}
                aria-pressed={page === index}
                onClick={() => turnTo(page)}
              >
                <span>{entry.index}</span>
                {entry.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.caption} key={character.id}>
            <span className={styles.chapter}>{character.chapter}</span>
            <h2 id={titleId}>{character.name}</h2>
            <span className={styles.romanized}>{character.romanized}</span>
            <p>{character.note}</p>
            <div className={styles.tags}>
              {character.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className={styles.controls}>
            <div className={styles.navigation}>
              <button
                type="button"
                onClick={() => turnTo(index - 1)}
                aria-disabled={index === 0}
              >
                上一页
              </button>
              <span>{character.index} / 03</span>
              <button
                type="button"
                onClick={() => turnTo(index + 1)}
                aria-disabled={index === favoriteChannels.length - 1}
              >
                下一页
              </button>
            </div>
            <button
              className={styles.theme}
              type="button"
              onClick={() => onSelectTheme(character.id)}
              aria-pressed={selectedChannel === character.id}
            >
              {selectedChannel === character.id
                ? "正在使用这个主题"
                : "把她的颜色带回网站"}
            </button>
            <a
              className={styles.original}
              href={sitePath(character.image)}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原图<span className="sr-only">（新标签页）</span>
            </a>
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            第 {index + 1} 页，共 3 页：{character.name}
          </p>
        </div>
      </div>
    </dialog>
  );
}
