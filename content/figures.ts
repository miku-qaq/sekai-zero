export type FigureProductDetails = {
  /** Single official product name; aliases do not belong in the catalog. */
  title: string;
  manufacturer: string;
  scale: string | null;
  officialUrl: string;
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
 * Public allow-list derived from two owner-provided collection screenshots.
 *
 * The screenshots contain third-party product imagery, prices and date fields,
 * so the public model deliberately keeps only the deduplicated record and the
 * character and source-work information that can be identified with
 * confidence. Product names, manufacturers and scales remain null until the
 * owner supplies a box photo or one exact product page. Prices, dates and order
 * details never belong in this public model.
 */
export const figureCollection: readonly FigureCollectionEntry[] = [
  {
    id: "figure-001",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-002",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-004",
    character: "吉普莉尔",
    work: "游戏人生",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "翼",
    tone: "violet",
  },
  {
    id: "figure-005",
    character: "立华奏",
    work: "Angel Beats!",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "奏",
    tone: "violet",
  },
  {
    id: "figure-006",
    character: "白",
    work: "游戏人生",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "白",
    tone: "pink",
  },
  {
    id: "figure-007",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-008",
    character: "伊蕾娜",
    work: "魔女之旅",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "旅",
    tone: "violet",
  },
  {
    id: "figure-009",
    character: "胡桃",
    work: "原神",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "蝶",
    tone: "pink",
  },
  {
    id: "figure-010",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-011",
    character: "焰",
    work: "异度神剑2",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "焰",
    tone: "pink",
  },
  {
    id: "figure-012",
    character: "光",
    work: "异度神剑2",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "光",
    tone: "amber",
  },
  {
    id: "figure-013",
    character: "洛琪希·米格路迪亚",
    work: "无职转生",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "魔",
    tone: "violet",
  },
  {
    id: "figure-014",
    character: "芙莉莲",
    work: "葬送的芙莉莲",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "芙",
    tone: "amber",
  },
  {
    id: "figure-015",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-016",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-017",
    character: "初音未来",
    work: "初音未来",
    format: "手办",
    verification: "identity-confirmed",
    product: null,
    motif: "39",
    tone: "pink",
  },
] as const;

export const figureCollectionMeta = {
  title: "Mikureina 的手办收藏",
  summary:
    "两张收藏记录去重后共有 17 条实体收藏：1 只大 Fufu 已迁入独立分馆，本页保留 16 件手办。现在可以确认全部角色与作品出处，正式商品名、厂商和比例继续等待盒照或本人实拍核对。",
  sourceLabel: "Mikureina 提供的收藏记录",
  rightsNote:
    "角色与商品形象版权归各自权利方所有；本站仅进行非商业性的个人收藏记录。价格、订单、购买平台与日期不公开，未来优先使用本人实拍补全具体商品资料。",
} as const;
