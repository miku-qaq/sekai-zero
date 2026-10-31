import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { characterBanner, siteConfig } from "@/content/site";
import { absoluteSiteUrl, resolveSiteUrl } from "@/lib/site-url";
import { SiteHeader } from "./components/site-header";
import { BackToTop } from "./components/back-to-top";
import { SiteMotion } from "./components/site-motion";
import { CharacterCompanion } from "./components/character-companion";
import { RoamingTracker } from "./components/roaming-notebook";
import "./globals.css";
import "./subpages.css";
import "./motion.css";

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
const themeInitializationScript = `try{const theme=localStorage.getItem("sekai-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}const channel=localStorage.getItem("sekai-channel");if(channel==="miku"||channel==="elaina"||channel==="bocchi"){document.documentElement.dataset.channel=channel}const motion=localStorage.getItem("sekai-motion");if(motion==="off"||motion==="on"){document.documentElement.dataset.motion=motion}}catch{}`;

const metadataBase = resolveSiteUrl();
const socialImage = absoluteSiteUrl(characterBanner.socialImage);
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
    "手办收藏",
    "Fufu 收藏",
    "奇妙收藏馆",
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
        alt: characterBanner.alt,
        width: characterBanner.width,
        height: characterBanner.height,
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
    <html
      lang="zh-CN"
      data-theme="light"
      data-channel="miku"
      data-motion="on"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        <SiteMotion />
        <RoamingTracker />
        {children}
        <CharacterCompanion />
        <BackToTop />
      </body>
    </html>
  );
}
