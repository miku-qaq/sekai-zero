"use client";

import { useState } from "react";
import { dimensionalFortunes } from "@/content/site";

/**
 * Draws a different original prompt without network state or an account. The
 * card pool lives in content/site.ts, so future weekly updates can add cards
 * without changing the interaction logic.
 */
export function DimensionalGacha() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawCount, setDrawCount] = useState(0);
  const activeFortune = dimensionalFortunes[activeIndex];

  function drawFortune() {
    setActiveIndex((current) => {
      const offset = 1 + Math.floor(Math.random() * (dimensionalFortunes.length - 1));
      return (current + offset) % dimensionalFortunes.length;
    });
    setDrawCount((count) => count + 1);
  }

  return (
    <div className="gacha-machine">
      <div
        className={`gacha-ticket gacha-${activeFortune.channel}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="gacha-ticket-topline">
          <span>{activeFortune.code}</span>
          <strong>{activeFortune.rarity}</strong>
        </div>
        <div className="gacha-ticket-content">
          <span className="gacha-ticket-motif" aria-hidden="true">
            {activeFortune.motif}
          </span>
          <div>
            <p>TODAY&apos;S DIMENSIONAL PROMPT</p>
            <h3>{activeFortune.title}</h3>
            <p className="gacha-message">{activeFortune.message}</p>
          </div>
        </div>
        <p className="gacha-action">{activeFortune.action}</p>
        <span className="gacha-serial" aria-hidden="true">
          #{String(activeIndex + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="gacha-controls">
        <div className="gacha-capsule" aria-hidden="true">
          <span>✦</span>
        </div>
        <div>
          <p className="gacha-control-label">DIMENSIONAL GACHA / 6 CARDS</p>
          <h3>今天会抽到哪一种能量？</h3>
          <p>
            六张原创行动小签，分别回应音乐、旅行与摇滚带来的勇气。每次抽取都会避开当前卡片。
          </p>
        </div>
        <button className="gacha-button" type="button" onClick={drawFortune}>
          抽取下一张
          <span aria-hidden="true">↻</span>
        </button>
        <p className="gacha-count" aria-live="polite">
          本次访问已抽取 {drawCount} 次
        </p>
      </div>
    </div>
  );
}
