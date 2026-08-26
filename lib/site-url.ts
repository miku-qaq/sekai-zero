const defaultSiteUrl = "https://miku-qaq.github.io/sekai-zero/";

/** Returns the deployment root, including a GitHub Pages repository prefix. */
export function resolveSiteUrl(): URL {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteUrl;

  try {
    return new URL(candidate.endsWith("/") ? candidate : `${candidate}/`);
  } catch {
    return new URL(defaultSiteUrl);
  }
}

/** Builds an absolute public URL without discarding a repository base path. */
export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname.replace(/^\/+/, ""), resolveSiteUrl()).toString();
}
