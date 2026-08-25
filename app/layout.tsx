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

// Runs before hydration so an explicitly saved theme is restored without a
// flash. First visits intentionally use the bright house theme.
const themeInitializationScript = `try{const theme=localStorage.getItem("sekai-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}const channel=localStorage.getItem("sekai-channel");if(channel==="miku"||channel==="elaina"||channel==="bocchi"){document.documentElement.dataset.channel=channel}}catch{}`;

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
const socialImage = new URL("og-v4.png", metadataBase).toString();
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
    images: [
      {
        url: socialImage,
        alt: "SEKAI / 00 白昼动画杂志风格分享卡片",
        width: 1200,
        height: 630,
      },
    ],
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
  themeColor: "#fff9fd",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="light" data-channel="miku" suppressHydrationWarning>
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
