"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";

const THEME_STORAGE_KEY = "sekai-theme";
type Theme = "light" | "dark";

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const explicitTheme = document.documentElement.dataset.theme;
  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The only stateful global navigation surface.
 * Theme preference is deliberately device-local and never requires an account.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [menuOpen]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The visual switch still works for this page even without persistence.
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            00
          </span>
          <span>{siteConfig.name}</span>
        </a>

        <nav id="primary-navigation" className="desktop-navigation" aria-label="主导航">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
            suppressHydrationWarning
          >
            <span className="sun-icon" aria-hidden="true">
              ☼
            </span>
            <span className="moon-icon" aria-hidden="true">
              ◐
            </span>
          </button>
          <a className="header-cta" href="#works">
            进入世界
            <span aria-hidden="true">↘</span>
          </a>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-navigation"
        aria-label="移动端导航"
        data-open={menuOpen}
        hidden={!menuOpen}
      >
        {siteConfig.navigation.map((item, index) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            <span>0{index + 1}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
