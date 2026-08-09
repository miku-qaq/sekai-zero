/**
 * Returns a public URL that works both at a domain root and below a GitHub
 * Pages repository path. `NEXT_PUBLIC_BASE_PATH` is inlined into client code at
 * build time, so the same helper is safe in server and interactive components.
 */
export function sitePath(pathname: string): string {
  if (/^(?:https?:|mailto:|tel:)/i.test(pathname)) return pathname;

  const segment = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
  const basePath = segment ? `/${segment}` : "";

  if (pathname.startsWith("#")) return `${basePath}/${pathname}`;

  const normalizedPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "")}`;
  return `${basePath}${normalizedPath}`;
}
