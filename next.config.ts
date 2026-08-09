import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

/**
 * GitHub project sites live below `/repository-name`. Keeping normalization in
 * one place prevents accidental double slashes in generated asset URLs.
 */
function normalizeBasePath(value: string | undefined): string | undefined {
  const path = value?.trim().replace(/^\/+|\/+$/g, "");
  return path ? `/${path}` : undefined;
}

const pagesBasePath = normalizeBasePath(process.env.PAGES_BASE_PATH);

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      // Vinext beta.5 currently asks its prerender server for `/` even when a
      // basePath is configured, which makes the export return 404. This site
      // has one hash-routed page, so an asset prefix plus explicit public-asset
      // paths gives Pages the correct project subdirectory without that bug.
      assetPrefix: pagesBasePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
