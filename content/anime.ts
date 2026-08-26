import catalog from "./anime-catalog.json";

export type AnimeCatalogEntry = {
  id: string;
  title: string;
  image: string;
  year: number | null;
  format: string;
  status: "watched";
  source: {
    label: "Bangumi";
    url: string;
    imageUrl: string;
    matchedTitle: string;
  };
};

/**
 * Mikureina's watched-anime archive.
 *
 * The public title is the single canonical work title returned by the curated
 * Bangumi subject. The original user input remains in anime-source.json as a
 * maintenance audit trail and is not imported into the public browser bundle,
 * so the page neither drops a title nor displays aliases.
 */
export const animeCatalog = catalog as readonly AnimeCatalogEntry[];

export const animeCatalogMeta = {
  title: "Mikureina 的动画收藏馆",
  description:
    "按我看过的动画清单整理，共收录 89 部作品。这里不是评分榜，每个名称只对应一条观看记录；多季作品暂不拆分季度。",
  updatedAt: "2026.08.26",
  sourceLabel: "封面与作品资料索引来自 Bangumi",
  sourceUrl: "https://bgm.tv/",
  rightsNote: "封面版权归各作品的原始权利方所有，本站仅用于个人观看记录与作品识别。",
} as const;
