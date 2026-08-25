import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/content/site";
import { SiteHeader } from "./components/site-header";
import "./globals.css";
import "./subpages.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Runs before hydration to prevent a flash when the saved theme differs from
// the operating-system preference. Failure simply falls back to CSS.
const themeInitializationScript = `try{const value=localStorage.getItem("sekai-theme");if(value==="light"||value==="dark"){document.documentElement.dataset.theme=value}}catch{}`;

const defaultSiteUrl = "https://miku-qaq.github.io/sekai-zero/";

/**
 * Metadata must be deterministic so the same page can be pre-rendered for
 * GitHub Pages. CI injects the final target URL; other builds use the stable
 * public Pages address instead of depending on the optional Worker endpoint.
 */
function resolveSiteUrl(): URL {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteUrl;

  try {
    return new URL(candidate.endsWith("/") ? candidate : `${candidate}/`);
  } catch {
    return new URL(defaultSiteUrl);
  }
}

const metadataBase = resolveSiteUrl();
const socialImage = new URL("og-v3.png", metadataBase).toString();
const favicon = new URL("favicon.svg", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${siteConfig.name} · 个人次元站`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["个人网站", "作品集", "二次元", "动漫", "游戏", "计算机学习", "开发"],
  authors: [{ name: siteConfig.owner }],
  creator: siteConfig.owner,
  icons: {
    icon: favicon,
    shortcut: favicon,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: `${siteConfig.name} · 个人次元站`,
    description: siteConfig.description,
    images: [{ url: socialImage, alt: "SEKAI / 00 个人次元站分享卡片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · 个人次元站`,
    description: siteConfig.description,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#090b11" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-channel="miku" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
