export type DeviceCollectionEntry = {
  id: string;
  title: string;
  shortName: string;
  brand: string;
  category: "游戏主机";
  /** 仅填写本人确认的版本与配色。 */
  edition: string | null;
  tone: "mint" | "violet";
  image: string | null;
  imageAlt: string;
  imageNote: string;
  sourceUrl: string;
};

/** 本人确认拥有的设备；未确认的型号、配色和交易信息不作推断。 */
export const deviceCollection: readonly DeviceCollectionEntry[] = [
  {
    id: "device-nintendo-switch",
    title: "Nintendo Switch",
    shortName: "NS1",
    brand: "Nintendo",
    category: "游戏主机",
    edition: "OLED 款式",
    tone: "mint",
    // https://assets.nintendo.com/image/upload/q_auto/f_auto/dpr_2.0/ncom/en_US/products/hardware/nintendo-switch-oled-model-white-set/115461-switch-oled-white-console-front-1200x675
    image: "/devices/nintendo-switch-oled.jpg",
    imageAlt: "Nintendo Switch OLED 款式官方商品图，白色配色示意，非本人实拍",
    imageNote: "官方商品图 · 配色示意 · 非本人实拍",
    sourceUrl: "https://www.nintendo.com/hk/hardware/detail/switch-oled/index.html",
  },
  {
    id: "device-nintendo-switch-2",
    title: "Nintendo Switch 2",
    shortName: "NS2",
    brand: "Nintendo",
    category: "游戏主机",
    edition: "普通版",
    tone: "violet",
    // https://www.nintendo.com/hk/hardware/switch2/assets/img/modal-more/block-portable-before.png
    image: "/devices/nintendo-switch-2.png",
    imageAlt: "Nintendo Switch 2 普通版主机官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.nintendo.com/hk/hardware/switch2/index.html",
  },
];
