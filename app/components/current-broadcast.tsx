import { currentBroadcast } from "@/content/now";
import { sitePath } from "@/lib/site-path";
import styles from "./current-broadcast.module.css";

/** A static, shareable snapshot of the owner's current verified priorities. */
export function CurrentBroadcast() {
  return (
    <section
      className={`${styles.broadcast} section-shell section-pad`}
      id="current"
      aria-labelledby="current-title"
    >
      <div className={`section-heading horizontal-heading ${styles.heading}`}>
        <div>
          <p className="section-index">01 / NOW</p>
          <h2 id="current-title">{currentBroadcast.headline}</h2>
        </div>
        <div className={styles.intro}>
          <p>{currentBroadcast.summary}</p>
          <p className={styles.updated}>
            LAST VERIFIED /{" "}
            <time dateTime={currentBroadcast.updatedAt.replaceAll(".", "-")}>
              {currentBroadcast.updatedAt}
            </time>
          </p>
        </div>
      </div>

      <div className={styles.console}>
        <div className={styles.episodePanel} aria-label="Mikureina 的当前状态">
          <div className={styles.episodeTopline}>
            <span>{currentBroadcast.panel.eyebrow}</span>
            <span>
              <i aria-hidden="true" /> UPDATED {currentBroadcast.updatedAt}
            </span>
          </div>
          <span className={styles.episodeNumber} aria-hidden="true">
            {currentBroadcast.panel.mark}
          </span>
          <div className={styles.episodeCopy}>
            <span>PERSONAL SNAPSHOT</span>
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
              <a href={sitePath(signal.href)}>
                {signal.action} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
