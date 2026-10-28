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

function isCurrentNavigationPath(currentPath: string, href: string) {
  const targetPath = sitePath(href).replace(/\/+$/, "") || "/";
  if (currentPath === targetPath) return true;
  if (href === "/") return false;

  // Old public bookmarks stay readable, but their matching canonical channel
  // remains highlighted so visitors never feel that they left the museum.
  if (href === "/collections/" && /\/(?:anime|games)$/.test(currentPath)) {
    return true;
  }
  if (href === "/logs/" && /\/projects$/.test(currentPath)) return true;

  return currentPath.startsWith(`${targetPath}/`);
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
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    // This is a disclosure navigation, not a modal: leaving it closes the panel
    // without trapping focus or interrupting the visitor's next action.
    function closeOutsideHeader(event: Event) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    const mobileViewport = window.matchMedia("(max-width: 1040px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (!event.matches) setMenuOpen(false);
    }

    window.addEventListener("keydown", closeWithEscape);
    document.addEventListener("pointerdown", closeOutsideHeader);
    document.addEventListener("focusin", closeOutsideHeader);
    mobileViewport.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeWithEscape);
      document.removeEventListener("pointerdown", closeOutsideHeader);
      document.removeEventListener("focusin", closeOutsideHeader);
      mobileViewport.removeEventListener("change", closeOnDesktop);
    };
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
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <a
          className="brand"
          href={sitePath("/")}
          onClick={closeMenu}
          aria-label={`${siteConfig.name} · 返回首页`}
        >
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
                isCurrentNavigationPath(currentPath, item.href) ? "page" : undefined
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
            <svg className="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z" />
            </svg>
          </button>
          <a className="header-cta" href={sitePath("/study/#cs224n-nlp-word-vectors")}>
            正在学 CS224N
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
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M6 18 18 6" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
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
              isCurrentNavigationPath(currentPath, item.href) ? "page" : undefined
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
