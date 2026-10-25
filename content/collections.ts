import { animeCatalog } from "./anime";
import { controllerCollection } from "./controllers";
import { deviceCollection } from "./devices";
import { figureCollection } from "./figures";
import { fufuCollection } from "./fufu";
import { gameCatalog } from "./games";

export type CollectionRoomId =
  "anime" | "games" | "figures" | "fufu" | "controllers" | "devices";

/** Canonical registry for the rooms inside the Wonder Collection. */
export const collectionRooms = [
  {
    id: "anime",
    index: "01",
    href: "/collections/anime/",
    label: "动画展柜",
    count: animeCatalog.length,
    unit: "部已看",
    motif: "★",
    tone: "pink",
    description: "用正式作品名、年份与类型找回看过的故事。",
  },
  {
    id: "games",
    index: "02",
    href: "/collections/games/",
    label: "游戏展柜",
    count: gameCatalog.length,
    unit: "款记录",
    motif: "▣",
    tone: "violet",
    description: "整理 Steam 游玩足迹，并为 Nintendo Switch 收藏保留入口。",
  },
  {
    id: "figures",
    index: "03",
    href: "/collections/figures/",
    label: "手办收藏",
    count: figureCollection.length,
    unit: "件收藏",
    motif: "◇",
    tone: "mint",
    description: "逐件核对款式与商品图，按角色、作品或厂商发现收藏。",
  },
  {
    id: "fufu",
    index: "04",
    href: "/collections/fufu/",
    label: "Fufu 收藏",
    count: fufuCollection.length,
    unit: "只毛绒",
    motif: "ふ",
    tone: "amber",
    description: "从虎生肖开始，单独整理初音未来 Fufu 与每年的生肖成员。",
  },
  {
    id: "controllers",
    index: "05",
    href: "/collections/controllers/",
    label: "手柄收藏",
    count: controllerCollection.length,
    unit: "只手柄",
    motif: "＋",
    tone: "blue",
    description: "从 Xbox 与两代 Switch Pro，到八重神子联名款，收藏握在手里的喜欢。",
  },
  {
    id: "devices",
    index: "06",
    href: "/collections/devices/",
    label: "设备收藏",
    count: deviceCollection.length,
    unit: "件设备",
    motif: "▰",
    tone: "mint",
    description: "Apple 与 Nintendo，陪伴日常与游戏时光的设备。",
  },
] as const;

export const collectionRecordCount = collectionRooms.reduce(
  (total, room) => total + room.count,
  0,
);
