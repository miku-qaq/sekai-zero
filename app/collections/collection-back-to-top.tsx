"use client";

import { useEffect, useState } from "react";
import styles from "./collection-layout.module.css";

export function CollectionBackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 700);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return visible ? (
    <a className={styles.backToTop} href="#top" aria-label="回到本馆顶部">
      ↑<span>回到顶部</span>
    </a>
  ) : null;
}
