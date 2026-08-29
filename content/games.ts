import catalog from "./games-catalog.json";

export type GameCatalogEntry = {
  id: string;
  appId: string;
  title: string;
  platform: "Steam";
  image: string | null;
  storeUrl: string;
};

type GameCatalogFile = {
  updatedAt: string;
  source: string;
  items: GameCatalogEntry[];
};

const gameCatalogFile = catalog as GameCatalogFile;

/**
 * Public game data generated from Steam's local client cache.
 *
 * The sync step deliberately discards account identifiers, playtime and last
 * played timestamps. Public UI should never infer rankings from this archive.
 */
export const gameCatalog = gameCatalogFile.items as readonly GameCatalogEntry[];

export const gameCatalogMeta = {
  title: "Mikureina 的游戏展柜",
  description:
    "从这台电脑的 Steam 本地记录整理实际玩过的游戏；只公开作品名称与识别封面，不公开账号、时长或最近上线信息。",
  updatedAt: gameCatalogFile.updatedAt,
  sourceLabel: "Steam 客户端本地缓存",
  sourceUrl: "https://store.steampowered.com/",
  rightsNote:
    "游戏名称与封面版权归各自权利方所有；Steam 商店链接用于核对作品，本站不声称拥有这些素材。",
} as const;

export const switchCollectionPlaceholder = {
  title: "Nintendo Switch 收藏待补充",
  copy: "Nintendo Switch 是我的常玩平台之一；具体游戏会在我确认清单后逐项加入，不根据热度或猜测代填。",
} as const;
