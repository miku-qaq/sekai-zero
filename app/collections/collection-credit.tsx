import type { ReactNode } from "react";
import styles from "./collection-credit.module.css";

/** Keep provenance available without interrupting the collection itself. */
export function CollectionCredit({
  label,
  source,
  children,
}: {
  label: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <details className={styles.credit}>
      <summary aria-label={`图片与资料：${label}`}>
        <span>图片与资料</span>
        <span className={styles.indicator} aria-hidden="true">
          +
        </span>
      </summary>
      <div className={styles.body}>
        <p className={styles.source}>{source}</p>
        {children}
      </div>
    </details>
  );
}
