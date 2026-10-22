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
      <summary>
        <span>{label}</span>
        <small>{source}</small>
        <span className={styles.indicator} aria-hidden="true">
          +
        </span>
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  );
}
