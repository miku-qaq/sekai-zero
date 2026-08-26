"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/content/site";
import { sitePath } from "@/lib/site-path";

const THEME_STORAGE_KEY = "sekai-theme";
const THEME_CHANGE_EVENT = "sekai-theme-change";
type Theme = "light" | "dark";

function clientThemeSnapshot(): Theme {
  const explicitTheme = document.documentElement.dataset.theme;
  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  // The site is designed to open like a bright anime magazine. Dark mode is
  // still available as an explicit, persisted choice, but the operating
  // system theme no longer turns the first visit into a near-black page.
  return "light";
}

function serverThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(THEME_CHANGE_EVENT, notify);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
  };
}

function subscribeToPath() {
  // Navigation uses normal document requests, so the path cannot change during
  // one mounted page. The empty subscriber gives hydration a stable snapshot.
  return () => undefined;
}

function clientPathSnapshot() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function serverPathSnapshot() {
  return "";
}

/**
 * The only stateful global navigation surface.
 * Theme preference is deliberately device-local and never requires an account.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useSyncExternalStore(
    subscribeToTheme,
    clientThemeSnapshot,
    serverThemeSnapshot,
  );
  const currentPath = useSyncExternalStore(
    subscribeToPath,
    clientPathSnapshot,
    serverPathSnapshot,
  );
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
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The visual switch still works for this page even without persistence.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href={sitePath("/")} onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            00
          </span>
          <span>{siteConfig.name}</span>
        </a>

        <nav id="primary-navigation" className="desktop-navigation" aria-label="主导航">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={sitePath(item.href)}
              aria-current={
                currentPath === (sitePath(item.href).replace(/\/+$/, "") || "/")
                  ? "page"
                  : undefined
              }
            >
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
          <a className="header-cta" href={sitePath("/study/#cs224n-nlp-word-vectors")}>
            正在学 CS224N
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
        {siteConfig.navigation.map((item) => (
          <a
            key={item.href}
            href={sitePath(item.href)}
            onClick={closeMenu}
            aria-current={
              currentPath === (sitePath(item.href).replace(/\/+$/, "") || "/")
                ? "page"
                : undefined
            }
          >
            <span>{item.index}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
