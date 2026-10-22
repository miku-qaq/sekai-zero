"use client";

import { useEffect, useState } from "react";
import styles from "./back-to-top.module.css";

/** The same unobtrusive return point on every long page. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 700);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return visible ? (
    <a className={styles.backToTop} href="#top" aria-label="回到页面顶部">
      <span aria-hidden="true">↑</span>
      <span className={styles.label}>回到顶部</span>
    </a>
  ) : null;
}
