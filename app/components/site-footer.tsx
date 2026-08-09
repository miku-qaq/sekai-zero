import { siteConfig } from "@/content/site";
import { sitePath } from "@/lib/site-path";

/** A shared footer keeps every route connected to the same site map. */
export function SiteFooter() {
  return (
    <footer className="site-footer section-shell">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true">
          00
        </span>
        <div>
          <strong>{siteConfig.name}</strong>
          <span>PERSONAL SIGNAL</span>
        </div>
      </div>
      <nav className="footer-navigation" aria-label="页脚导航">
        {siteConfig.navigation.map((item) => (
          <a href={sitePath(item.href)} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <p>
        © {new Date().getFullYear()} {siteConfig.owner} · SIGNAL STILL ON
      </p>
    </footer>
  );
}
