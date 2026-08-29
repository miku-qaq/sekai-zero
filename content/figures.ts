export type FigureVerification = "character-confirmed" | "pending";

export type FigureCollectionEntry = {
  id: string;
  character: string;
  format: "手办" | "待确认";
  verification: FigureVerification;
  motif: string;
  tone: "mint" | "violet" | "pink" | "amber";
};

/**
 * Public allow-list derived from two owner-provided collection screenshots.
 *
 * The screenshots contain third-party product imagery, prices and date fields,
 * so the public model deliberately keeps only the deduplicated record and the
 * character-level information that can be identified with confidence. Product
 * names, manufacturers, scales, prices, dates and order details stay out of the
 * repository until the owner confirms an appropriate public source.
 */
export const figureCollection: readonly FigureCollectionEntry[] = [
  {
    id: "figure-001",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-002",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-004",
    character: "吉普莉尔",
    format: "手办",
    verification: "character-confirmed",
    motif: "翼",
    tone: "violet",
  },
  {
    id: "figure-005",
    character: "立华奏",
    format: "手办",
    verification: "character-confirmed",
    motif: "奏",
    tone: "violet",
  },
  {
    id: "figure-006",
    character: "白",
    format: "手办",
    verification: "character-confirmed",
    motif: "白",
    tone: "pink",
  },
  {
    id: "figure-007",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-008",
    character: "伊蕾娜",
    format: "手办",
    verification: "character-confirmed",
    motif: "旅",
    tone: "violet",
  },
  {
    id: "figure-009",
    character: "胡桃",
    format: "手办",
    verification: "character-confirmed",
    motif: "蝶",
    tone: "pink",
  },
  {
    id: "figure-010",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-011",
    character: "焰",
    format: "手办",
    verification: "character-confirmed",
    motif: "焰",
    tone: "pink",
  },
  {
    id: "figure-012",
    character: "光",
    format: "手办",
    verification: "character-confirmed",
    motif: "光",
    tone: "amber",
  },
  {
    id: "figure-013",
    character: "洛琪希·米格路迪亚",
    format: "手办",
    verification: "character-confirmed",
    motif: "魔",
    tone: "violet",
  },
  {
    id: "figure-014",
    character: "芙莉莲",
    format: "手办",
    verification: "character-confirmed",
    motif: "芙",
    tone: "amber",
  },
  {
    id: "figure-015",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-016",
    character: "初音未来",
    format: "手办",
    verification: "character-confirmed",
    motif: "39",
    tone: "mint",
  },
  {
    id: "figure-017",
    character: "角色待确认",
    format: "待确认",
    verification: "pending",
    motif: "?",
    tone: "pink",
  },
] as const;

export const figureCollectionMeta = {
  title: "Mikureina 的手办收藏",
  summary:
    "根据本人提供的收藏记录去重整理；原有大 Fufu 已迁入独立 Fufu 分馆。这里仅公开可以确认的手办角色，不公开价格、订单、购买平台或含义不明确的日期。",
  sourceLabel: "Mikureina 提供的收藏记录",
  rightsNote:
    "角色与商品形象版权归各自权利方所有；本站仅进行非商业性的个人收藏记录。具体商品名、厂商、比例与系列等待逐件核对。Fufu 毛绒由独立分馆维护。",
} as const;
