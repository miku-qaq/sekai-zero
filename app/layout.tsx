import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/content/site";
import { SiteHeader } from "./components/site-header";
import "./globals.css";

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

const defaultSiteUrl = "https://sekai-zero.miku125194847910362.chatgpt.site/";

/**
 * Metadata must be deterministic so the same page can be pre-rendered for
 * GitHub Pages. CI injects the final Pages URL; Sites uses the stable fallback.
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
const socialImage = new URL("og.png", metadataBase).toString();
const favicon = new URL("favicon.svg", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${siteConfig.name} · 个人次元站`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["个人网站", "作品集", "二次元", "动漫", "设计", "开发"],
  authors: [{ name: siteConfig.shortName }],
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
