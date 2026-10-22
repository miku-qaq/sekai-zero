export type ControllerCollectionEntry = {
  id: string;
  title: string;
  shortName: string;
  brand: string;
  edition: string;
  note: string;
  collaboration: boolean;
  tone: "mint" | "violet" | "blue" | "pink";
  image: string;
  imageAlt: string;
  sourceUrl: string;
};

/** Owner-confirmed inventory; package contents and purchase details are not inferred. */
export const controllerCollection: readonly ControllerCollectionEntry[] = [
  {
    id: "controller-xbox-carbon-black",
    title: "Xbox 无线手柄",
    shortName: "Xbox",
    brand: "Microsoft / Xbox",
    edition: "Series X|S 标准款 · 碳黑",
    note: "碳黑机身与彩色 ABXY 按键，熟悉的 Xbox 模样。",
    collaboration: false,
    tone: "mint",
    image: "/controllers/xbox-carbon-black.webp",
    imageAlt: "Xbox Series X|S 碳黑色无线手柄正面商品图，非本人实拍",
    sourceUrl:
      "https://www.microsoft.com/en-us/d/xbox-wireless-controller/8xn59crbsqgz",
  },
  {
    id: "controller-switch-pro",
    title: "Nintendo Switch Pro 手柄",
    shortName: "NS Pro 1",
    brand: "Nintendo",
    edition: "Nintendo Switch · 标准款",
    note: "半透明深色外壳，把第一代 Switch 的 Pro 控制器收进展柜。",
    collaboration: false,
    tone: "violet",
    image: "/controllers/switch-pro.webp",
    imageAlt: "Nintendo Switch Pro 标准款手柄商品图，非本人实拍",
    sourceUrl: "https://www.nintendo.com/hk/hardware/switch/accessories/#procon",
  },
  {
    id: "controller-switch2-pro",
    title: "Nintendo Switch 2 Pro 手柄",
    shortName: "NS Pro 2",
    brand: "Nintendo",
    edition: "Nintendo Switch 2 · 标准款",
    note: "熟悉的按键布局与新的 C 键，和上一代 Pro 并排收藏。",
    collaboration: false,
    tone: "blue",
    image: "/controllers/switch2-pro.webp",
    imageAlt: "Nintendo Switch 2 Pro 标准款手柄正面商品图，非本人实拍",
    sourceUrl: "https://www.nintendo.com/hk/hardware/switch2/accessories/index.html",
  },
  {
    id: "controller-apex4-yae-miko",
    title: "飞智八爪鱼 4",
    shortName: "八重神子联名",
    brand: "飞智 / FLYDIGI",
    edition: "《原神》八重神子联名版",
    note: "樱粉色机身与八重神子主题图案，让喜欢的角色也来到手边。",
    collaboration: true,
    tone: "pink",
    image: "/controllers/apex4-yae-miko.webp",
    imageAlt: "飞智八爪鱼 4 八重神子联名手柄商品图，非本人实拍",
    sourceUrl:
      "https://whotao.com/products/genshin-impact-yae-miko-astute-amusement-game-controller-apex-4",
  },
] as const;
