import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
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

/** Derives absolute social image URLs from the host serving this exact request. */
export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    requestHeaders.get("host") ||
    "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol || (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
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
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
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
}

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
