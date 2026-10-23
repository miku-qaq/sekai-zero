export type FigureProductDetails = {
  /** Single matched product name; aliases do not belong in the catalog. */
  title: string;
  manufacturer: string;
  scale: string | null;
  productUrl: string;
  image: string | null;
  imageAlt: string | null;
};

type FigureCollectionBase = {
  id: string;
  character: string;
  work: string;
  format: "手办";
  motif: string;
  tone: "mint" | "violet" | "pink" | "amber";
};

/**
 * Product-level fields stay unavailable until a box photo or a trustworthy
 * product page confirms one exact item. This discriminated union prevents a
 * card from looking fully verified while its product details are still null.
 */
export type FigureCollectionEntry =
  | (FigureCollectionBase & {
      verification: "identity-confirmed";
      product: null;
    })
  | (FigureCollectionBase & {
      verification: "product-confirmed";
      product: FigureProductDetails;
    });

/**
 * Public catalog matched against the owner's two screenshots and the linked
 * product pages. Images depict these exact products, not the owner's copies.
 * Keep purchase information and the original screenshots out of this model.
 */
export const figureCollection: readonly FigureCollectionEntry[] = [
  {
    id: "figure-001",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "赛车初音 2024 Ver.",
      manufacturer: "GOODSMILE RACING",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/en/product/36455/",
      image: "/figures/figure-001.webp",
      imageAlt: "赛车初音 2024 Ver. 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-002",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "初音未来 feat. 米山舞",
      manufacturer: "Good Smile Company",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/ja/product/60248/",
      image: "/figures/figure-002.webp",
      imageAlt: "初音未来 feat. 米山舞 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-004",
    character: "吉普莉尔",
    work: "游戏人生 -Zero-",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "吉普莉尔 大战 Ver.",
      manufacturer: "Good Smile Company",
      scale: "1/8",
      productUrl: "https://www.goodsmile.com/en/product/6261/",
      image: "/figures/figure-004.webp",
      imageAlt: "吉普莉尔 大战 Ver. 商品展示图，非本人实拍",
    },
    motif: "翼",
    tone: "violet",
  },
  {
    id: "figure-005",
    character: "立华奏",
    work: "Angel Beats!",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "Coreful 立华奏",
      manufacturer: "TAITO",
      scale: null,
      productUrl:
        "https://www.figurechoice.com/products/coreful-figure-angel-kanade-tachibana-angel-beats-official-statue-taito",
      image: "/figures/figure-005.webp",
      imageAlt: "Coreful 立华奏 商品展示图，非本人实拍",
    },
    motif: "奏",
    tone: "violet",
  },
  {
    id: "figure-006",
    character: "白",
    work: "游戏人生",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "Aqua Float Girls 白",
      manufacturer: "TAITO",
      scale: null,
      productUrl: "https://www.taito.co.jp/taito-prize/0451621300",
      image: "/figures/figure-006.webp",
      imageAlt: "Aqua Float Girls 白 商品展示图，非本人实拍",
    },
    motif: "白",
    tone: "pink",
  },
  {
    id: "figure-007",
    character: "超天酱",
    work: "主播女孩重度依赖",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "POP UP PARADE 超天酱",
      manufacturer: "Good Smile Company",
      scale: null,
      productUrl: "https://www.goodsmile.com/en/product/11091/",
      image: "/figures/figure-007.webp",
      imageAlt: "POP UP PARADE 超天酱 商品展示图，非本人实拍",
    },
    motif: "†",
    tone: "pink",
  },
  {
    id: "figure-008",
    character: "伊蕾娜",
    work: "魔女之旅",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "AMP+ 伊蕾娜 魔女服 Ver.",
      manufacturer: "TAITO",
      scale: null,
      productUrl: "https://www.taito.co.jp/taito-prize/0451839700",
      image: "/figures/figure-008.webp",
      imageAlt: "AMP+ 伊蕾娜 魔女服 Ver. 商品展示图，非本人实拍",
    },
    motif: "旅",
    tone: "violet",
  },
  {
    id: "figure-009",
    character: "胡桃",
    work: "原神",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "胡桃·雪霁梅香 Ver.",
      manufacturer: "APEX-TOYS",
      scale: "1/7",
      productUrl: "https://www.amiami.jp/top/detail/review?gcode=FIGURE-171184",
      image: "/figures/figure-009.webp",
      imageAlt: "胡桃·雪霁梅香 Ver. 商品展示图，非本人实拍",
    },
    motif: "蝶",
    tone: "pink",
  },
  {
    id: "figure-010",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "初音未来 常世 Ver.",
      manufacturer: "Good Smile Company",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/en/product/9369/",
      image: "/figures/figure-010.webp",
      imageAlt: "初音未来 常世 Ver. 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-011",
    character: "焰",
    work: "异度神剑2",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "焰",
      manufacturer: "Good Smile Company",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/en/product/4687/",
      image: "/figures/figure-011.webp",
      imageAlt: "焰 商品展示图，非本人实拍",
    },
    motif: "焰",
    tone: "pink",
  },
  {
    id: "figure-012",
    character: "光",
    work: "异度神剑2",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "光",
      manufacturer: "Good Smile Company",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/en/product/4912/",
      image: "/figures/figure-012.webp",
      imageAlt: "光 商品展示图，非本人实拍",
    },
    motif: "光",
    tone: "amber",
  },
  {
    id: "figure-013",
    character: "洛琪希·米格路迪亚",
    work: "无职转生",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "洛琪希·米格路迪亚",
      manufacturer: "寿屋 / Kotobukiya",
      scale: "1/8",
      productUrl: "https://shop.kotobukiya.co.jp/shop/g/g4934054070169/",
      image: "/figures/figure-013.webp",
      imageAlt: "洛琪希·米格路迪亚 商品展示图，非本人实拍",
    },
    motif: "魔",
    tone: "violet",
  },
  {
    id: "figure-014",
    character: "芙莉莲",
    work: "葬送的芙莉莲",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "芙莉莲 黄昏色的魔法",
      manufacturer: "Good Smile Company",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/en/product/56125/",
      image: "/figures/figure-014.webp",
      imageAlt: "芙莉莲 黄昏色的魔法 商品展示图，非本人实拍",
    },
    motif: "芙",
    tone: "amber",
  },
  {
    id: "figure-015",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "赛车初音 2023 Ver.",
      manufacturer: "GOODSMILE RACING",
      scale: "1/7",
      productUrl: "https://www.goodsmile.com/ja/product/56065/",
      image: "/figures/figure-015.webp",
      imageAlt: "赛车初音 2023 Ver. 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-016",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "初音未来交响乐 5th Anniversary Ver.",
      manufacturer: "Good Smile Company",
      scale: null,
      productUrl: "https://www.goodsmile.com/en/product/9449/",
      image: "/figures/figure-016.webp",
      imageAlt: "初音未来交响乐 5th Anniversary Ver. 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-017",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "product-confirmed",
    product: {
      title: "樱初音 赏花穿搭 Ver.",
      manufacturer: "Good Smile Company",
      scale: "1/6",
      productUrl: "https://www.goodsmile.com/en/product/54788/",
      image: "/figures/figure-017.webp",
      imageAlt: "樱初音 赏花穿搭 Ver. 商品展示图，非本人实拍",
    },
    motif: "39",
    tone: "pink",
  },
] as const;

export const figureCollectionMeta = {
  title: "Mikureina 的手办收藏",
  summary: "初音未来与来自不同作品的伙伴，在这里相聚。",
  sourceLabel: "Mikureina 的收藏 · 商品资料逐件核对",
  rightsNote:
    "图片来自厂商及商品资料页，用于展示对应款式，非本人实拍；角色、商品设计与图片版权归各自权利方。每张卡片保留资料入口，个人购买信息不公开。",
} as const;
