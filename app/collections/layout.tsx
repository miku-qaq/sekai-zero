import type { ReactNode } from "react";
import styles from "./collection-layout.module.css";

/** Keep the collection rooms on one reading scale without changing other worlds. */
export default function CollectionLayout({ children }: { children: ReactNode }) {
  return <div className={styles.collectionLayout}>{children}</div>;
}
