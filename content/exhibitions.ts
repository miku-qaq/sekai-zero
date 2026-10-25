export type CollectionExhibition = {
  id: string;
  title: string;
  description: string;
  tone: "mint" | "violet" | "pink";
  items: readonly string[];
};

/** 以作品和角色串联已有收藏；顺序是策展编排，不代表个人排名。 */
export const collectionExhibitions: readonly CollectionExhibition[] = [
  {
    id: "miku",
    title: "初音的一角",
    description: "从音游舞台，到展柜与毛绒。",
    tone: "mint",
    items: [
      "figure-002",
      "steam-1761390",
      "fufu-zodiac-2024-dragon",
      "figure-001",
      "figure-010",
      "figure-015",
      "figure-016",
      "figure-017",
      "figure-003",
      "fufu-zodiac-2022-tiger",
      "fufu-zodiac-2023-rabbit",
      "fufu-zodiac-2025-snake",
      "fufu-zodiac-2026-horse",
    ],
  },
  {
    id: "journeys",
    title: "旅途与魔法",
    description: "伊蕾娜与芙莉莲，旅途仍在继续。",
    tone: "violet",
    items: ["wandering-witch", "figure-008", "frieren", "figure-014"],
  },
  {
    id: "from-screen",
    title: "从屏幕到身边",
    description: "把作品里的相遇，留在现实的一角。",
    tone: "pink",
    items: [
      "no-game-no-life",
      "figure-006",
      "angel-beats",
      "figure-005",
      "figure-004",
      "steam-1451940",
      "figure-007",
    ],
  },
];
