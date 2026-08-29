import { animeCatalog } from "./anime";
import { figureCollection } from "./figures";
import { gameCatalog } from "./games";

export type CollectionRoomId = "anime" | "games" | "figures";

/** Canonical registry for the three rooms inside the Wonder Collection. */
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
    label: "手办与周边",
    count: figureCollection.length,
    unit: "件收藏",
    motif: "◇",
    tone: "mint",
    description: "先记录能够确认的角色，具体商品资料等待逐件核对。",
  },
] as const;

export const collectionRecordCount = collectionRooms.reduce(
  (total, room) => total + room.count,
  0,
);
