import { animeCatalog } from "./anime";
import type { CollectionRoomId } from "./collections";
import { collectionStories } from "./collection-stories";
import { controllerCollection } from "./controllers";
import { deviceCollection } from "./devices";
import { figureCollection } from "./figures";
import { fufuCollection } from "./fufu";
import { gameCatalog } from "./games";
import { headphoneCollection } from "./headphones";

export type CollectionItem = {
  id: string;
  room: CollectionRoomId;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel: string;
  imageNote: string;
  fit: "cover" | "contain";
  keywords: readonly string[];
  story: string;
};

/** 同一份已确认资料供画册、小展与随机漫游使用，不另造收藏记录。 */
export const collectionItems: readonly CollectionItem[] = [
  ...animeCatalog.map((entry): CollectionItem => ({
    id: entry.id,
    room: "anime",
    title: entry.title,
    subtitle: [entry.format, entry.year].filter(Boolean).join(" · "),
    image: entry.image,
    imageAlt: `${entry.title}作品封面`,
    sourceUrl: entry.source.url,
    sourceLabel: "Bangumi 资料",
    imageNote: "作品封面 · 来源 Bangumi",
    fit: "cover",
    keywords: [entry.title, entry.format, String(entry.year ?? "")],
    story: collectionStories[entry.id] ?? "",
  })),
  ...gameCatalog.flatMap((entry): CollectionItem[] =>
    entry.image
      ? [
          {
            id: entry.id,
            room: "games",
            title: entry.title,
            subtitle: entry.platform,
            image: entry.image,
            imageAlt: `${entry.title}游戏封面`,
            sourceUrl: entry.storeUrl,
            sourceLabel: "Steam 商店",
            imageNote: "游戏封面 · 来源 Steam",
            fit: "cover",
            keywords: [entry.title, entry.platform],
            story: collectionStories[entry.id] ?? "",
          },
        ]
      : [],
  ),
  ...figureCollection.flatMap((entry): CollectionItem[] => {
    const product = entry.product;
    if (!product?.image) return [];
    return [
      {
        id: entry.id,
        room: "figures",
        title: product.title,
        subtitle: [entry.character, product.manufacturer, product.scale]
          .filter(Boolean)
          .join(" · "),
        image: product.image,
        imageAlt: product.imageAlt ?? product.title,
        sourceUrl: product.productUrl,
        sourceLabel: "商品资料",
        imageNote: product.manufacturer,
        fit: "contain",
        keywords: [entry.character, entry.work, product.title, product.manufacturer],
        story: collectionStories[entry.id] ?? "",
      },
    ];
  }),
  ...fufuCollection.map((entry): CollectionItem => ({
    id: entry.id,
    room: "fufu",
    title: entry.title,
    subtitle: entry.year
      ? `初音未来 Fufu · ${entry.year} ${entry.motif}生肖`
      : "初音未来 · 大 Fufu",
    image: entry.image,
    imageAlt: entry.title,
    sourceUrl: entry.officialUrl,
    sourceLabel: "SEGA 资料",
    imageNote: "SEGA 官方资料",
    fit: "contain",
    keywords: [
      entry.title,
      entry.character,
      "Fufu",
      entry.motif,
      entry.zodiac ?? "",
      String(entry.year ?? ""),
    ],
    story: collectionStories[entry.id] ?? "",
  })),
  ...controllerCollection.map((entry): CollectionItem => ({
    id: entry.id,
    room: "controllers",
    title: entry.title,
    subtitle: entry.edition,
    image: entry.image,
    imageAlt: entry.imageAlt,
    sourceUrl: entry.sourceUrl,
    sourceLabel: "商品资料",
    imageNote: entry.brand,
    fit: "contain",
    keywords: [entry.title, entry.shortName, entry.brand, entry.edition],
    story: collectionStories[entry.id] ?? "",
  })),
  ...deviceCollection.flatMap((entry): CollectionItem[] =>
    entry.image
      ? [
          {
            id: entry.id,
            room: "devices",
            title: entry.title,
            subtitle: entry.edition ?? entry.category,
            image: entry.image,
            imageAlt: entry.imageAlt,
            sourceUrl: entry.sourceUrl,
            sourceLabel: `${entry.brand} 官方资料`,
            imageNote: entry.imageNote,
            fit: "contain",
            keywords: [
              entry.title,
              entry.shortName,
              entry.brand,
              entry.category,
              entry.edition ?? "",
            ],
            story: collectionStories[entry.id] ?? "",
          },
        ]
      : [],
  ),
  ...headphoneCollection.flatMap((entry): CollectionItem[] =>
    entry.image
      ? [
          {
            id: entry.id,
            room: "headphones",
            title: entry.title,
            subtitle: entry.edition ?? entry.category,
            image: entry.image,
            imageAlt: entry.imageAlt,
            sourceUrl: entry.sourceUrl,
            sourceLabel: `${entry.brand} 官方资料`,
            imageNote: entry.imageNote,
            fit: "contain",
            keywords: [
              entry.title,
              entry.shortName,
              entry.brand,
              entry.category,
              entry.edition ?? "",
            ],
            story: collectionStories[entry.id] ?? "",
          },
        ]
      : [],
  ),
];
