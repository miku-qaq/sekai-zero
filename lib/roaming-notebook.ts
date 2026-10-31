export const roamingPlaces = [
  { id: "home", href: "/", label: "首页", title: "相遇", tone: "mint" },
  { id: "about", href: "/about/", label: "关于我", title: "认识", tone: "pink" },
  {
    id: "collections",
    href: "/collections/",
    label: "收藏馆",
    title: "喜欢",
    tone: "violet",
  },
  { id: "study", href: "/study/", label: "学习笔记", title: "发现", tone: "blue" },
  { id: "links", href: "/links/", label: "导航终端", title: "远行", tone: "violet" },
  { id: "logs", href: "/logs/", label: "日志", title: "留念", tone: "pink" },
] as const;

export type RoamingPlaceId = (typeof roamingPlaces)[number]["id"];
export const roamingStorageKey = "sekai-roaming-notebook";
export const roamingVisitDelay = 1_500;

/** Public route aliases belong to one chapter, never to extra invented places. */
export function roamingPlaceForPath(
  pathname: string,
  basePath = "",
): RoamingPlaceId | null {
  let path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  const base = basePath.replace(/\/+$/, "");
  if (base && base !== "/") {
    if (path === base) path = "/";
    else if (path.startsWith(`${base}/`)) path = path.slice(base.length);
  }
  if (path === "/") return "home";
  if (path === "/anime" || path === "/games") return "collections";
  if (path === "/projects") return "logs";
  if (
    /^\/collections\/(?:anime|games|figures|fufu|controllers|devices|headphones|gallery)$/.test(
      path,
    )
  )
    return "collections";
  const place = roamingPlaces.find(
    (entry) => entry.id !== "home" && path === entry.href.replace(/\/$/, ""),
  );
  return place?.id ?? null;
}

/** Only six known IDs are stored, with no dates, user identifiers or activity detail. */
export function readRoamingVisits(raw: string | null): RoamingPlaceId[] {
  if (!raw || raw.length > 2_048) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return roamingPlaces
      .filter((place) => parsed.includes(place.id))
      .map((place) => place.id);
  } catch {
    return [];
  }
}

export function addRoamingVisit(
  visits: readonly RoamingPlaceId[],
  place: RoamingPlaceId,
): RoamingPlaceId[] {
  return roamingPlaces
    .filter((entry) => entry.id === place || visits.includes(entry.id))
    .map((entry) => entry.id);
}

/** A quota/read denial must not undo a successful in-memory addition or clear. */
export function createRoamingStorage(
  source: () => {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  },
) {
  let memory: RoamingPlaceId[] = [];
  let unavailable = false;
  return {
    read() {
      if (!unavailable) {
        try {
          memory = readRoamingVisits(source().getItem(roamingStorageKey));
        } catch {
          unavailable = true;
        }
      }
      return [...memory];
    },
    write(visits: RoamingPlaceId[]) {
      memory = [...visits];
      if (!unavailable) {
        try {
          source().setItem(roamingStorageKey, JSON.stringify(memory));
        } catch {
          unavailable = true;
        }
      }
    },
  };
}

type Timer = ReturnType<typeof setTimeout>;
type VisitClock = {
  setTimeout: (callback: () => void, delay: number) => Timer;
  clearTimeout: (timer: Timer) => void;
};

/** A hidden tab cannot earn a stamp; reset stays empty until the next navigation. */
export function createRoamingVisitTracker({
  clock,
  record,
}: {
  clock: VisitClock;
  record: (place: RoamingPlaceId) => void;
}) {
  let timer: Timer | undefined;
  let visible = false;
  let place: RoamingPlaceId | null = null;
  let recorded = false;
  let stopped = false;

  function cancel() {
    if (timer !== undefined) clock.clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    cancel();
    if (!visible || !place || recorded || stopped) return;
    timer = clock.setTimeout(() => {
      timer = undefined;
      if (!stopped && visible && place && !recorded) {
        recorded = true;
        record(place);
      }
    }, roamingVisitDelay);
  }

  return {
    navigate(pathname: string, basePath = "") {
      if (stopped) return;
      place = roamingPlaceForPath(pathname, basePath);
      recorded = false;
      schedule();
    },
    setVisible(next: boolean) {
      if (visible === next || stopped) return;
      visible = next;
      schedule();
    },
    reset() {
      recorded = true;
      cancel();
    },
    destroy() {
      stopped = true;
      cancel();
    },
  };
}
