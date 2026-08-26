import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/content/site";
import { absoluteSiteUrl, resolveSiteUrl } from "@/lib/site-url";
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

const metadataBase = resolveSiteUrl();
const socialImage = absoluteSiteUrl("og-v4.png");
const favicon = absoluteSiteUrl("favicon.svg");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${siteConfig.name} · 个人次元站`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "个人网站",
    "二次元",
    "动漫",
    "游戏",
    "计算机学习",
    "CS224N",
    "自然语言处理",
  ],
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
