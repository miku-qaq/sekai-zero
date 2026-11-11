"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { capsuleTiming, type CapsulePhase } from "@/lib/capsule-draw";
import { sitePath } from "@/lib/site-path";
import styles from "./capsule-machine.module.css";

const capsuleTones = ["mint", "pink", "violet", "yellow", "pink", "mint", "violet"];

/** A hand-turned cabinet; the parent owns the bounded draw and its result. */
export function CapsuleMachine({
  phase,
  onDraw,
  drawCount,
}: {
  phase: CapsulePhase;
  onDraw: () => void;
  drawCount: number;
}) {
  const busy = phase !== "idle";
  // The count advances on landing; the capsule keeps its colour through reveal.
  const capsuleNumber =
    drawCount + (phase === "turning" || phase === "dropping" ? 1 : 0);
  const prizeTone = capsuleTones[Math.max(0, capsuleNumber - 1) % capsuleTones.length];

  return (
    <div
      className={styles.machine}
      data-phase={phase}
      data-used={drawCount > 0}
      style={
        {
          "--turn-duration": `${capsuleTiming.turning}ms`,
          "--drop-duration": `${capsuleTiming.dropping}ms`,
          "--open-duration": `${capsuleTiming.revealing}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.cabinet}>
        <div className={styles.globe} aria-hidden="true">
          <span className={styles.glassDepth} />
          <div className={styles.pile}>
            {capsuleTones.map((tone, index) => (
              <span className={styles.capsule} data-tone={tone} key={index}>
                <span className={styles.cap} />
                <span className={styles.base}>
                  <span className={styles.ticket} />
                </span>
                <span className={styles.seam} />
                <i />
              </span>
            ))}
          </div>
          <span className={styles.glassShine} />
        </div>
        <div className={styles.crown} aria-hidden="true">
          <span className={styles.emblem}>00</span>
          <span className={styles.wordmark}>
            SEKAI<span>カプセル</span>
          </span>
          <i />
        </div>

        <div className={styles.body} aria-hidden="true">
          <span className={styles.screw} />
          <span className={styles.screw} />
        </div>
        <div className={styles.rim} aria-hidden="true" />

        <div className={styles.sticker} aria-hidden="true">
          <Image
            src={sitePath("/characters/companions/miku-v1.webp")}
            alt=""
            width={512}
            height={512}
            sizes="78px"
            draggable={false}
          />
        </div>
        <span className={styles.edition} aria-hidden="true">
          すき、ひとつ。
        </span>

        <button
          className={styles.handleButton}
          type="button"
          aria-label="转动旋钮，抽取一件收藏"
          aria-disabled={busy}
          onClick={(event) => {
            if (busy) return;
            event.currentTarget.focus({ preventScroll: true });
            onDraw();
          }}
        >
          <span className={styles.dial} aria-hidden="true">
            <span className={styles.dialTicks} />
            <span className={styles.dialInset} />
            <span className={styles.grip}>
              <span />
            </span>
            <span className={styles.hub} />
          </span>
          <span className={styles.buttonLabel}>{busy ? "出蛋中" : "扭一下"}</span>
        </button>

        <div className={styles.outlet} aria-hidden="true">
          <div className={styles.chute}>
            <span className={styles.prize} data-tone={prizeTone}>
              <span className={styles.prizeTop} />
              <span className={styles.prizeTicket} />
              <span className={styles.prizeBottom} />
            </span>
          </div>
          <span className={styles.flap} />
          <span className={styles.lip} />
        </div>
        <div className={styles.foot} aria-hidden="true">
          <span className={styles.serial}>
            NO. <b>{String(drawCount).padStart(3, "0")}</b>
          </span>
          <span className={styles.statusLight} />
        </div>
      </div>
      <span className={styles.floor} aria-hidden="true" />
    </div>
  );
}
