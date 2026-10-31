import { currentBroadcast } from "@/content/now";
import { currentRelease } from "@/content/releases";
import { sitePath } from "@/lib/site-path";
import styles from "./current-broadcast.module.css";

/** Confirmed personal notes stay separate from the site's latest release. */
export function CurrentBroadcast() {
  return (
    <section
      className={`${styles.broadcast} section-shell section-pad`}
      id="current"
      aria-labelledby="current-title"
    >
      <div className={`section-heading horizontal-heading ${styles.heading}`}>
        <div>
          <p className="section-index">01 / DAILY</p>
          <h2 id="current-title">{currentBroadcast.headline}</h2>
        </div>
        <div className={styles.intro}>
          <p>{currentBroadcast.summary}</p>
        </div>
      </div>

      <div className={styles.console}>
        <div className={styles.episodePanel} aria-label="Mikureina 的学习与日常记录">
          <div className={styles.episodeTopline}>
            <span>{currentBroadcast.panel.eyebrow}</span>
            <span>
              <i aria-hidden="true" /> 记录于{" "}
              <time dateTime={currentBroadcast.updatedAt.replaceAll(".", "-")}>
                {currentBroadcast.updatedAt}
              </time>
            </span>
          </div>
          <span className={styles.episodeNumber} aria-hidden="true">
            {currentBroadcast.panel.mark}
          </span>
          <div className={styles.episodeCopy}>
            <strong>{currentBroadcast.panel.title}</strong>
            <p>{currentBroadcast.panel.copy}</p>
          </div>
        </div>

        <div className={styles.signalGrid}>
          {currentBroadcast.signals.map((signal) => (
            <article
              className={styles.signal}
              data-tone={signal.tone}
              key={signal.code}
            >
              <div className={styles.signalMeta}>
                <span>{signal.code}</span>
                <span>{signal.status}</span>
              </div>
              <h3>{signal.title}</h3>
              <p>{signal.copy}</p>
              <a href={sitePath(signal.href)}>{signal.action}</a>
            </article>
          ))}
        </div>
      </div>
      <a
        className={styles.latestRelease}
        href={sitePath(`/logs/#ep-${currentRelease.number}`)}
      >
        <span className={styles.releaseLabel}>
          世界线更新 · {currentRelease.episode}
        </span>
        <strong>{currentRelease.title}</strong>
        <time dateTime={currentRelease.date.replaceAll(".", "-")}>
          {currentRelease.date}
        </time>
      </a>
    </section>
  );
}
