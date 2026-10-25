export type DeviceCollectionEntry = {
  id: string;
  title: string;
  shortName: string;
  brand: "Nintendo" | "Apple";
  category: "游戏主机" | "手机" | "平板" | "耳机";
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
  {
    id: "device-iphone-17-pro",
    title: "iPhone 17 Pro",
    shortName: "iPhone 17 Pro",
    brand: "Apple",
    category: "手机",
    edition: "星宇橙色",
    tone: "mint",
    // https://www.apple.com.cn/v/iphone/compare/an/images/overview/compare_iphone17_pro_cosmic_orange__dm1qripnvq82_large_2x.jpg
    image: "/devices/iphone-17-pro-orange.jpg",
    imageAlt: "iPhone 17 Pro 星宇橙色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl:
      "https://www.apple.com.cn/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max-cn/",
  },
  {
    id: "device-ipad-pro-m5",
    title: "iPad Pro",
    shortName: "iPad Pro",
    brand: "Apple",
    category: "平板",
    edition: "13 英寸 · M5 · 深空黑色",
    tone: "violet",
    // https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-13-select-wifi-spaceblack-202405?wid=940&hei=1112&fmt=p-jpg&qlt=95&.v=T1BCOVhFWUx5RnVHWklQQWdsQTFDY3pCNlo3Y2trYUx2VGtnRmoxbk1mRFcvUGs3Z3lJUWVHYk5KZW9nNkdxb1Q5NVJ4OStiQklybHZqYkJwOUI0UWt2aHJVVVRvS3hUQ0EwVk8wak9Ka0g3djBPZUREMElRMHhHVnprUmxPLzg
    image: "/devices/ipad-pro-m5-space-black.jpg",
    imageAlt: "13 英寸 iPad Pro M5 深空黑色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.apple.com.cn/ipad-pro/",
  },
  {
    id: "device-airpods-pro-3",
    title: "AirPods Pro 3",
    shortName: "AirPods Pro 3",
    brand: "Apple",
    category: "耳机",
    edition: null,
    tone: "mint",
    // https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-3-hero-select-202509?wid=976&hei=916&fmt=jpeg&qlt=90&.v=cmp4MmZ6OWxOeHNNTXh4SzlBNUpEb1RucE9zZTI5eEREaWZpY29lSld3eWVDYXovZDMyN1dXU211bjZoVlVUcWJGcXNRQnFCV0w3WVRjTExvdm1ic1YxRUxFRmRlWDBITzhnRmZ5OTRmaVdKTExiOEFsRmxtQ2Nua0tRSC83MkI
    image: "/devices/airpods-pro-3.jpg",
    imageAlt: "AirPods Pro 3 白色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.apple.com.cn/airpods-pro/",
  },
  {
    id: "device-airpods-max-2",
    title: "AirPods Max 2",
    shortName: "AirPods Max 2",
    brand: "Apple",
    category: "耳机",
    edition: "午夜色",
    tone: "violet",
    // https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=azQxRkVJKzd6V3J0aGNqWFhLMzBmdmVWNWdHYnp5cHkwMldsSElEOHpyd0cyWGRFNFZ5QTk3bFlteis2Q2NNaWpENFdPQTN0TWQ4ejhtTWxrUHVDeElGZGV2eWhZaEljUzNSeDlxcDVuWGszbTFldUtUQzN0ellEWHZ3UUFYSS8
    image: "/devices/airpods-max-2-midnight.jpg",
    imageAlt: "AirPods Max 2 午夜色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.apple.com.cn/airpods-max/",
  },
];
