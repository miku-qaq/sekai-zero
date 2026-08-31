export type FufuCollectionEntry = {
  id: string;
  title: string;
  character: "初音未来";
  kind: "large" | "zodiac";
  zodiac:
    | "子"
    | "丑"
    | "寅"
    | "卯"
    | "辰"
    | "巳"
    | "午"
    | "未"
    | "申"
    | "酉"
    | "戌"
    | "亥"
    | null;
  /** A number keeps future annual entries from requiring a schema change. */
  year: number | null;
  motif: string;
  tone: "mint" | "violet" | "pink" | "amber" | "blue";
  verification: "owner-confirmed";
  officialUrl: string;
};

/**
 * Owner-confirmed Fufu collection.
 *
 * `figure-003` intentionally keeps its original stable identifier: it is the
 * large Fufu that was first recorded with the figure screenshot and later
 * moved into this dedicated collection. The five zodiac entries use SEGA's
 * published Japanese product names verbatim; prices, orders, purchase dates,
 * shops and production batches are deliberately outside the public model.
 */
export const fufuCollection: readonly FufuCollectionEntry[] = [
  {
    id: "figure-003",
    title: "初音ミクシリーズ　初音ミク　ふわぷち　どでかジャンボぬいぐるみ",
    character: "初音未来",
    kind: "large",
    zodiac: null,
    year: null,
    motif: "大",
    tone: "mint",
    verification: "owner-confirmed",
    officialUrl: "https://segaplaza.jp/goods/120696/",
  },
  {
    id: "fufu-zodiac-2022-tiger",
    title: "初音ミク　寅2022　ふわふわぬいぐるみ(LL)",
    character: "初音未来",
    kind: "zodiac",
    zodiac: "寅",
    year: 2022,
    motif: "虎",
    tone: "amber",
    verification: "owner-confirmed",
    officialUrl: "https://info.miku.sega.jp/16431",
  },
  {
    id: "fufu-zodiac-2023-rabbit",
    title: "初音ミク　卯2023　ふわぷち　ぬいぐるみ（LL）",
    character: "初音未来",
    kind: "zodiac",
    zodiac: "卯",
    year: 2023,
    motif: "兔",
    tone: "pink",
    verification: "owner-confirmed",
    officialUrl: "https://info.miku.sega.jp/17297",
  },
  {
    id: "fufu-zodiac-2024-dragon",
    title: "初音ミク　辰2024　ふわぷち　ぬいぐるみ（LL）",
    character: "初音未来",
    kind: "zodiac",
    zodiac: "辰",
    year: 2024,
    motif: "龙",
    tone: "violet",
    verification: "owner-confirmed",
    officialUrl: "https://segaplaza.jp/goods/120142/",
  },
  {
    id: "fufu-zodiac-2025-snake",
    title: "初音ミク　巳2025　ふわぷち　ぬいぐるみ（ＬＬ）",
    character: "初音未来",
    kind: "zodiac",
    zodiac: "巳",
    year: 2025,
    motif: "蛇",
    tone: "blue",
    verification: "owner-confirmed",
    officialUrl: "https://segaplaza.jp/goods/120683/",
  },
  {
    id: "fufu-zodiac-2026-horse",
    title: "初音ミク　午2026　ふわぷち　ぬいぐるみ（LL）",
    character: "初音未来",
    kind: "zodiac",
    zodiac: "午",
    year: 2026,
    motif: "马",
    tone: "mint",
    verification: "owner-confirmed",
    officialUrl: "https://segaplaza.jp/goods/120684/",
  },
] as const;

const zodiacFufu = fufuCollection.filter((entry) => entry.kind === "zodiac");
const firstZodiacFufu = zodiacFufu.at(0);
const latestZodiacFufu = zodiacFufu.at(-1);
const collectionRangeSummary =
  firstZodiacFufu && latestZodiacFufu
    ? `从${firstZodiacFufu.zodiac} ${firstZodiacFufu.year} 生肖款开始连续收藏到 ${latestZodiacFufu.zodiac} ${latestZodiacFufu.year}`
    : "生肖收藏时间线仍待补充";

export const fufuCollectionMeta = {
  title: "Mikureina 的 Fufu 毛绒收藏",
  summary: `单独记录我的初音未来 Fufu 毛绒：${collectionRangeSummary}，也把原先记录在手办区的大 Fufu 迁回这里。`,
  sourceLabel: "本人确认的收藏范围与 SEGA 商品资料",
  rightsNote:
    "Fufu 是本站使用的收藏称呼；商品卡保留 SEGA 公布的正式名称。角色与商品形象版权归各自权利方所有，本站仅作非商业性的个人收藏记录。",
} as const;
